---
layout: post
title: Instalar Barman para Ubuntu
date: 2023-05-02 08:00:00 +0000
description: Tener al día los backups es algo muy importante y más si hablamos de BBDD, por eso el día de hoy traigo esta herramienta llamada Barman.
image: /assets/img/sysadmin.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, ubuntu, postgres, backup]
categories: [linux, ubuntu, postgres, backup]
---

Tener al día los backups es algo muy importante y más si hablamos de BBDD, por eso el día de hoy traigo esta herramienta llamada [Barman](https://pgbarman.org) que funciona con servidores PostgreSQL.

Para este tutorial voy a contar con que ya tengamos un servidor de PostgreSQL montado, para centrarnos únicamente en la instalación de Barman y la configuración que hay que realizar en ambos servidores.

## Instalación Barman y barman-cli

Para instalarlo es muy sencillo, sólo tendremos que ejecutar el siguiente comando en el servidor de Barman.

```bash
sudo apt update -y && sudo apt install barman -y
```

Con esto actualizaremos los repositorios en Ubuntu e instalaremos el paquete sin necesidad de tener que confirma.

Una vez haya terminado, podremos ponernos a editar los ficheros de configuración, que se pueden encontrar bien en `/etc/barman.conf` o `/etc/barman/barman.conf`.

Para comprobar que versión tenemos instalada, podemos ejecutar `barman --version`

Para el servidor de PostgreSQL tendremos que instalar barman-cli de la siguiente manera.

```bash
sudo apt update -y && sudo apt install barman-cli -y
```

## Configuración Barman

En este apartado vamos a hacer la parte tanto que implica el servidor de Barman como en el servidor PostgreSQL.

### Autenticación sin contraseña en Barman

Lo primero que hay que hacer es iniciar sesión con el usuario **barman** y generar un par de claves para la conexión sin contraseña por SSH.

```bash
sudo su barman
ssh-keygen -t rsa
```

De esta forma, no tendremos que estar cambiando la contraseña del usuario **barman**. En el segundo comando, damos siguiente a todo y nos habrá creado el par de claves. Para pasarlos al otro servidor, podemos ejecutar el comando `ssh-copy-id` pero en ocasiones no tenemos la contraseña del usuario postgres, así que yo lo haré a mano, copiando el contenido del fichero `/var/lib/barman/.ssh/id_rsa.pub` y dejándolo en el fichero `authorized_keys` que crearemos cuando configuremos la parte de postgres.

### Autenticación sin contraseña en PostgreSQL

Tendremos que hacer lo mismo que hemos realizado en el paso anterior, pero sólo que habrá que iniciar sesión con el usuario **postgres** en el servidor de PostgreSQL.

```bash
sudo su postgres
ssh-keygen -t rsa
```

De igual manera, damos siguiente a todo para que nos cree el par de claves. Por defecto nos dejará las claves en `/var/lib/postgres/.ssh/id_rsa.pub`

En este punto tendremos que hacer lo siguiente, el contenido del fichero `/var/lib/postgres/.ssh/id_rsa.pub` del servidor PostgreSQL tendrá que estar en `/var/lib/barman/.ssh/authorized_keys` y el fichero `/var/lib/barman/.ssh/id_rsa.pub` en `/var/lib/postgres/.ssh/authorized_keys`. Con esto podremos hacer que ambos servidores se conecten el uno al otro sin necesidad de poner contraseña.

Algo recomendable por si os salta error es intentar conectarse por ssh del servidor de Barman con el usuario **barman** al servidor de PostgreSQL y del servidor de PostgreSQL con el usuario **postgres** al servidor de barman para aceptar la _key fingerprint_.

### Crear rol barman en BBDD

Necesitamos crear un usuario con permisos de superusuario para poder hacer el backup. Para ello, nos conectaremos a nuestra BBDD, ya sea con herramientas como PGAdmin o la propia línea de comandos, psql.

Os dejo el comando a ejecutar para crearlo. La contraseña puede ser la que quiera, que se indica en lo entrecomillado que viene después de _password_.

```psql
postgres=# create user barman superuser password 'barman';
```

### Modificar ficheros configuración Barman

En este apartado vamos a cambiar tanto el fichero general de Barman, como el fichero que hay que crear para la conexión al servidor PostgreSQL.

En el fichero de configuración `/etc/barman.conf`, vamos a añadir las siguientes líneas, ya sea agregándolas o descomentando las que ya hay.

```conf
barman_home = /var/lib/barman # Aquí definimos dónde se guardan los backups
compression = gzip
parallel_jobs = 2 # Aquí definimos que a la hora de hacer la copia, utilicé 2 jobs en vez de 1 como hace por defecto
retention_policy = RECOVERY WINDOW OF 4 WEEKS # Aquí definimos que queremos que mantengan 4 semanas de backups
retention_policy_mode = auto
```

Para el fichero de conexión al servidor que queramos hacer el backup, dentro de la carpeta `/etc/barman/conf.d` hay templates para poder copiar el fichero y simplemente modificar los datos de conexión. Aquí os dejo uno de ejemplo.

```conf
; Barman, Backup and Recovery Manager for PostgreSQL
; http://www.pgbarman.org/ - http://www.2ndQuadrant.com/
;
; Template configuration file for a server using
; SSH connections and rsync for copy.
;

[postgres-test]
; Human readable description
description =  "Servidor test Postgres"

; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; SSH options (mandatory)
; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
ssh_command = ssh -q postgres@10.1.10.201

; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; PostgreSQL connection string (mandatory)
; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
conninfo = host=10.1.10.201 user=barman dbname=postgres

; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Backup settings (via rsync over SSH)
; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
backup_method = rsync
; Incremental backup support: possible values are None (default), link or copy
reuse_backup = link
; Identify the standard behavior for backup operations: possible values are
; exclusive_backup (default), concurrent_backup
; concurrent_backup is the preferred method with PostgreSQL >= 9.6
backup_options = exclusive_backup

; Number of parallel workers to perform file copy during backup and recover
parallel_jobs = 2

; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Continuous WAL archiving (via 'archive_command')
; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
archiver = on
;archiver_batch_size = 50

; PATH setting for this server
path_prefix = "/usr/pgsql-12/bin"
retention_policy = RECOVERY WINDOW OF 2 WEEKS
retention_policy_mode = auto
```

### Comprobar conexión Barman-PostgreSQL

Una vez hecho todo esto, podremos verificar que Barman ha tomado correctamente la configuración que hemos realizado y se conecta al servidor.

Con `barman list-server`, nos mostrará los servidores que hayamos configurado.  
Con `barman show-server <server>`, en este caso cambiamos `<server>` por `postgres-test` como he puesto en el fichero de configuración y nos mostrará la configuración para ese servidor.

Con el siguiente comando comprobaremos la conexión, que en este punto nos dará fallo porque todavía queda por configurar los WAL. El comando es cuestión es `barman check <server>`

### Configurar envío WAL a servidor Barman

Hay que modificar los siguientes parámetros en el fichero de configuración `postgresql.conf` que se encuentra en el servidor PostgreSQL.

```conf
archive_mode = on # Prestar especial atención a este, porque si está con otro valor, habrá que reiniciar el servicio
archive_command = 'barman-wal-archive 10.1.10.202 10.1.10.201 "%p" ' # Siendo la primera IP el servidor de Barman y la segunda el servidor de PostgreSQL. Con este sólo será necesario hacer un reload
```

Reiniciamos o recargamos el servicio de PostgreSQL según venga al caso y volvemos al servidor de Barman.

En el servidor de Barman ejecutaremos el siguiente comando para forzar que copie los ficheros WALs y comprobar que hemos hecho la configuración correctamente.

```bash
barman switch-xlog --force --archive postgres-test
```

Volvemos a ejecutar el comando `barman check postgres-test` para confirmar que va a realizar el backup correctamente.

### Configuración extra

Para que Barman haga una comprobación del estado de los servidores y se traiga los WALs que estos tengan, hay que hacer una configuración en Crontab del usuario **barman**.

```bash
sudo su barman
crontab -e
```

Ahí podremos configurar que cada minuto haga la comprobación y haga un backup, ya sea completo o incremental según indiquemos. Aquí un ejemplo de ello.

```bash
*/1 * * * *  barman cron # Cada minuto hará la comprobación que he comentado
00 22 * * 1  barman backup --reuse-backup off postgres-test # Que haga una copia completa los lunes, a las 10 de la noche
00 22 * * 0,2,3,4,5,6  barman backup postgres-test # Que haga una copia incremental el resto de días, a las 10 de la noche
```

Con todo esto, ya tendremos un backup de nuestros servidores de BBDD, por si fuera necesario algún tener que echar mano de ellos, que esperemos que no.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
