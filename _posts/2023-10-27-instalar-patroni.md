---
layout: post
title: Instalar Patroni en Ubuntu
date: 2023-10-27 11:00:00 +0000
description: En este artículo se documenta cómo realizar la instalación de Patroni, un componente para crear cluster de PostgreSQL con Zookeeper, etcd o Consul.
image: /assets/img/sysadmin.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, ubuntu, postgres]
categories: [linux, ubuntu, postgres]
---

En este artículo se documenta cómo realizar la instalación de [Patroni](https://github.com/zalando/patroni), un componente para crear cluster de PostgreSQL con Zookeeper, etcd o Consul. En nuestro caso, utilizaremos etcd, que comenté en el [artículo anterior](https://www.samurantech.com/instalar-etcd/), para ello y HAProxy, esto explicado al final de este mismo artículo, para el balanceo entre los nodos finales.

Previamente tendremos que haber instalado PostgreSQL en cada uno de los nodos en los que se vaya a desplegar Patroni. La instalación se ha realizado sobre 3 nodos Ubuntu 22.04.

Toda esta configuración se está realizando con el usuario root

Vamos a abrir los puertos necesarios en el firewall para que los nodos se puedan comunicar entre ellos y las aplicaciones que posteriormente conectemos contra el clúster:

```bash
firewall-cmd --permanent --add-port={5432,8008}/tcp
firewall-cmd --reload
```

Configuramos Watchdog y los permisos necesarios.

```bash
cat <<EOF | sudo tee /etc/udev/rules.d/99-watchdog.rules
KERNEL=="watchdog", OWNER="postgres", GROUP="postgres"
EOF

echo "softdog" >> /etc/modules-load.d/softdog.conf

modprobe softdog

chown postgres: /dev/watchdog
```

Tenemos que buscar si Softdog está en la blacklist de modules para que arranque con el servidor.

```bash
grep blacklist /lib/modprobe.d/* /etc/modprobe.d/* |grep softdog

# Nos aparecerá el fichero en el que se encuentra, en nuestro caso es "/lib/modprobe.d/blacklist_linux_5.4.0-148-generic.conf", y eliminamos la línea "blacklist softdog"

# Comprobamos que esté cargado
lsmod | grep softdog
```

Instalamos Patroni en cada uno de los nodos.

```bash
apt install -y patroni
```

Ahora vamos a configurar el componente. De la siguiente manera sólo tendremos que cambiar las IPs de los nodos de etcd a los que se tiene que conectar, propiedades tales como el nombre del host, se hará automáticamente. Con esto será copiar y pegar.

```bash
PGPORT=5432
CLUSTER_NAME="cluster-1"
MY_NAME=$(hostname --short)
MY_IP=$(hostname -I | awk ' {print $1}')
cat <<EOF | sudo tee /etc/patroni/config.yml
scope: $CLUSTER_NAME
namespace: /db/
name: $MY_NAME

restapi:
  listen: "0.0.0.0:8008"
  connect_address: "$MY_IP:8008"
  authentication:
    username: patroni
    password: mySuperSecretPassword

etcd3:
    hosts:
    - <nodo1_etcd>:2379
    - <nodo2_etcd>:2379
    - <nodo3_etcd>:2379

bootstrap:
  dcs:
    ttl: 30
    loop_wait: 10
    retry_timeout: 10
    maximum_lag_on_failover: 1048576
    postgresql:
      use_pg_rewind: true
      use_slots: true
      parameters:
        archive_mode: "on"
        archive_command: "/bin/true"
        logging_collector: 'on'

  initdb:
  - encoding: UTF8
  - data-checksums
  - auth-local: peer
  - auth-host: scram-sha-256

  pg_hba:
  - host replication replicator 0.0.0.0/0 scram-sha-256
  - host all all 0.0.0.0/0 md5

  # Some additional users which needs to be created after initializing new cluster
  users:
    admin:
      password: admin%
      options:
        - createrole
        - createdb

postgresql:
  listen: "0.0.0.0:$PGPORT"
  connect_address: "$MY_IP:$PGPORT"
  data_dir: /data01/pgstorage/
  bin_dir: /usr/lib/postgresql/15/bin/
  pgpass: /tmp/pgpass0
  authentication:
    replication:
      username: replicator
      password: confidential
    superuser:
      username: postgresql
      password: postgres
    rewind:
      username: rewind_user
      password: rewind_password
  parameters:
    unix_socket_directories: "/var/run/postgresql/"

watchdog:
  mode: required
  device: /dev/watchdog
  safety_margin: 5

tags:
  nofailover: false
  noloadbalance: false
  clonefrom: false
  nosync: false
EOF

systemctl enable --now patroni
systemctl restart patroni
```

Si llegase a fallar la creación automática de los usuarios, habría que crearlos o cambiarles la contraseña manual, metiéndonos con usuario postgres y ejecutando las siguientes queries desde psql.

```sql
# Cambiar la contraseña del usuario postgres
ALTER USER postgres WITH PASSWORD 'postgres';

# Crear el usuario para la replicación
CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'confidential';

# Crear el usuario para el rewind (el streaming de datos) y darle los permisos necesarios
CREATE USER rewind_user LOGIN PASSWORD 'rewind_password';
GRANT EXECUTE ON function pg_catalog.pg_ls_dir(text, boolean, boolean) TO rewind_user;
GRANT EXECUTE ON function pg_catalog.pg_stat_file(text, boolean) TO rewind_user;
GRANT EXECUTE ON function pg_catalog.pg_read_binary_file(text) TO rewind_user;
GRANT EXECUTE ON function pg_catalog.pg_read_binary_file(text, bigint, bigint, boolean) TO rewind_user;
```

Para comprobar que la instalación es correcta, con el siguiente comando podremos listar los nodos que tenemos, su rol, el lag a la hora de replicar entre ellos o si queda pendiente reiniciar alguno de los nodos por configuraciones que hayamos hecho.

```bash
patronictl -c /etc/patroni/config.yml list

+ Cluster: cluster-1 (7284196933919984482) --------+----+-----------+--------------+
| Member         | Host          | Role         | State     | TL | Lag in MB | Tags         |
+----------------+---------------+--------------+-----------+----+-----------+--------------+
| n1-pro         | 10.255.10.121 | Leader       | running   | 31 |           |              |
| n2-pro         | 10.255.10.122 | Replica      | streaming | 31 |         0 | nosync: true |
| n3-pro         | 10.255.10.123 | Replica      | streaming | 31 |         0 | nosync: true |
+----------------+---------------+--------------+-----------+----+-----------+--------------+
```

## HAProxy

Con los pasos realizados anteriormente habremos configurado el cluster de Patroni, ahora configuraremos el HAProxy para que haga el balanceo.

Previamente tendremos que haber instalado HAProxy, en este apartado sólo se mencionará la configuración.

```bash
# Hacemos una copia del fichero de configuración y eliminamos el contenido del original
cp /etc/haproxy/haproxy.cfg{,.bak}
>/etc/haproxy/haproxy.cfg

# Ponemos la configuración correspondiente en el fichero
cat<<EOF | tee /etc/haproxy/haproxy.cfg
global
    maxconn 100

defaults
    log    global
    mode   tcp
    retries 2
    timeout client 30m
    timeout connect 4s
    timeout server 30m
    timeout check 5s

listen stats
    mode http
    bind *:7000
    stats enable
    stats uri /

listen read-write
    bind *:5432
    option httpchk OPTIONS /read-write
    http-check expect status 200
    default-server inter 3s fall 3 rise 2 on-marked-down shutdown-sessions
    server n1-pro 10.255.10.121:5432 maxconn 100 check port 8008
    server n2-pro 10.255.10.122:5432 maxconn 100 check port 8008
    server n3-pro 10.255.10.123:5432 maxconn 100 check port 8008

listen read-only
    balance roundrobin
    bind *:5433
    option httpchk OPTIONS /replica
    http-check expect status 200
    default-server inter 3s fall 3 rise 2 on-marked-down shutdown-sessions
    server n1-pro 10.255.10.121:5432 maxconn 100 check port 8008
    server n2-pro 10.255.10.122:5432 maxconn 100 check port 8008
    server n3-pro 10.255.10.123:5432 maxconn 100 check port 8008
EOF
```

Reiniciamos el servicio de HAProxy y comprobamos en el log si todo está bien.

```bash
systemctl restart haproxy; tail -f /var/log/haproxy.log
```

Si nos conectamos a la IP del Haproxy y al puerto 7000, podremos ver que nodos están en escritura/lectura y cuáles en sólo lectura.

Con esto último ya habremos terminado la configuración por completo. Se pueden hacer más configuraciones como poner que uno de los nodos sea asíncrono con la etiqueta `nosync: true` o síncrono si lo configuramos como `nosync: false`

La verdad es que es una herramienta que da mucho juego y nos permite manejar un cluster de postgres de forma muy sencilla.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
