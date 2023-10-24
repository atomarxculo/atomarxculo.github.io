---
layout: post
title: Instalar etcd en Ubuntu
date: 2023-10-24 15:00:00 +0000
description: En este artículo se documenta cómo realizar la instalación de un clúster de ETCD, una BBDD que almacena los datos en formato key-value.
img: sysadmin.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, ubuntu, postgres]
---

En este artículo voy a explicar cómo realizar la instalación de un clúster de [ETCD](https://etcd.io/), una BBDD que almacena los datos en formato key-value. La instalación se ha realizado sobre 3 nodos Ubuntu 20.04.

Toda esta configuración se está realizando con el usuario `root`.

Vamos a abrir los puertos necesarios en el firewall para que los nodos se puedan comunicar entre ellos y las aplicaciones que posteriormente conectemos contra el clúster:

```bash
firewall-cmd --permanent --add-port={2379/tcp,2380/tcp}
firewall-cmd --reload
```

Creamos el usuario `etcd`, que será quien arranque el servicio. Le hemos configurado para que no cree su carpeta `home` ni le dé permisos que pueda abrir una shell, pues no lo necesita.

```bash
useradd --no-create-home -s /bin/false etcd
```

Creamos las carpetas necesarias y le damos permisos al usuario `etcd`

```bash
mkdir -p /var/lib/etcd/default/
chown etcd: /var/lib/etcd/default/
```

Ahora vamos a descomprimir el fichero que contiene los ejecutables de etcd que anteriormente nos habremos descargado de la página de las releases [Github de ETCD](https://github.com/etcd-io/etcd/releases/), en nuestro caso lo hemos dejado en `/var/tmp`. Una vez se ha descomprimido, movemos los ejecutables a la carpeta `/usr/bin`.

```bash
tar xzvf /var/tmp/etcd-v3.4.27-linux-amd64.tar.gz
mv etcd-v3.4.27-linux-amd64/etcd* /usr/bin/
```

Vamos a crear el fichero de servicio para etcd, con el siguiente comando no hace falta editar el fichero, nos deja ya el contenido que le pongamos en el mismo.

```bash
cat >/lib/systemd/system/etcd.service<<\EOF
[Unit]
Description=etcd - highly-available key value store
Documentation=https://github.com/coreos/etcd
Documentation=man:etcd
After=network.target
Wants=network-online.target

[Service]
Environment=DAEMON_ARGS=
Environment=ETCD_NAME=%H
Environment=ETCD_DATA_DIR=/var/lib/etcd/default
EnvironmentFile=-/etc/default/%p
Type=notify
User=etcd
PermissionsStartOnly=true
#ExecStart=/bin/sh -c "GOMAXPROCS=$(nproc) /usr/bin/etcd $DAEMON_ARGS"
ExecStart=/usr/bin/etcd $DAEMON_ARGS
Restart=on-abnormal
#RestartSec=10s
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
Alias=etcd2.service
EOF
```

Ahora vamos a crear el fichero de configuración de `etcd` para el nodo 1.

```bash
cat >/etc/default/etcd<<\EOF
ETCD_NAME=node-1
ETCD_LISTEN_PEER_URLS="http://<IP_nodo1>:2380"
ETCD_LISTEN_CLIENT_URLS="http://<IP_nodo1>:2379"
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"
ETCD_INITIAL_CLUSTER="node-1=http://<IP_nodo1>:2380,node-2=http://<IP_nodo2>:2380,node-3=http://<IP_nodo3>:2380"
ETCD_INITIAL_ADVERTISE_PEER_URLS="http://<IP_nodo1>:2380"
ETCD_ADVERTISE_CLIENT_URLS="http://<IP_nodo1>:2379"
ETCD_INITIAL_CLUSTER_STATE=new
EOF
```

La configuración para el nodo 2 sería la misma, pero cambiando lo siguiente.

```bash
cat >/etc/default/etcd<<\EOF
ETCD_NAME=node-2
ETCD_LISTEN_PEER_URLS="http://<IP_nodo2>:2380"
ETCD_LISTEN_CLIENT_URLS="http://<IP_nodo2>:2379"
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"
ETCD_INITIAL_CLUSTER="node-1=http://<IP_nodo1>:2380,node-2=http://<IP_nodo2>:2380,node-3=http://<IP_nodo3>:2380"
ETCD_INITIAL_ADVERTISE_PEER_URLS="http://<IP_nodo2>:2380"
ETCD_ADVERTISE_CLIENT_URLS="http://<IP_nodo2>:2379"
ETCD_INITIAL_CLUSTER_STATE=new
EOF
```

La configuración para el nodo 3 sería la misma, pero cambiando lo siguiente.

```bash
cat >/etc/default/etcd<<\EOF
ETCD_NAME=node-3
ETCD_LISTEN_PEER_URLS="http://<IP_nodo3>:2380"
ETCD_LISTEN_CLIENT_URLS="http://<IP_nodo3>:2379"
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"
ETCD_INITIAL_CLUSTER="node-1=http://<IP_nodo1>:2380,node-2=http://<IP_nodo2>:2380,node-3=http://<IP_nodo3>:2380"
ETCD_INITIAL_ADVERTISE_PEER_URLS="http://<IP_nodo3>:2380"
ETCD_ADVERTISE_CLIENT_URLS="http://<IP_nodo3>:2379"
ETCD_INITIAL_CLUSTER_STATE=new
EOF
```

Lo que cambia de un fichero a otro son las propiedades que apuntan al nodo en el que estamos haciendo la configuración.

Para terminar, sólo nos quedaría aplicar los cambios en el daemon, habilitar el servicio y ver los logs.

```bash
systemctl daemon-reload
systemctl enable --now etcd.service
journalctl -u etcd -f
```

Con la opción `enable --now` hacemos que el servicio arranque con el sistema y lo inicia ahora.

Con esto ya tendremos montado nuestro clúster de etcd, donde podremos comprobar los nodos y la salud del mismo con estos comandos. Donde `<IP_nodoN>` es cualquier nodo del clúster.

```bash
etcdctl --endpoints http://<IP_nodoN>:2379 member list --write-out=table
etcdctl --endpoints http://<IP_nodoN>:2379 endpoint status --cluster --write-out=table
```

La verdad es que sólo conocía esta BBDD de oídas porque es con la que trabaja Kubernetes, y ahora entiendo por qué la utiliza. Es muy ligera y la funcionalidad que tiene es impresionante, es mi caso la uso para integrar servicios como Patroni, que haré un artículo más adelante, APISIX u otro servicio.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
