---
layout: post
title: Restaurar backup de Barman
date: 2024-02-12 08:00:00 +0000
description: En anteriores posts, instalamos y configuramos Barman para que se encargase de las copias de seguridad de nuestras BBDD montadas sobre PostgreSQL.
image: /assets/img/sysadmin.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, ubuntu, postgres, backup]
categories: [linux, ubuntu, postgres, backup]
---

En anteriores [posts](https://www.samurantech.com/instalar-barman/), instalamos y configuramos Barman para que se encargase de las copias de seguridad de nuestras BBDD montadas sobre PostgreSQL. En este veremos cómo restaurar uno de los backups que hayamos hecho.

Para ello seguiremos los siguientes pasos:

1. Apagaremos el servidor Postgres que será el destino, el comando de ejemplo que se utiliza es la versión 12 sobre un Ubuntu 22.04

   ```bash
   systemctl stop postgresql@12-main.service
   ```

2. Hacemos un backup de la carpeta de los datos originales en Postgres, aunque esto no es necesario si en el servidor no hay datos de por sí (si es un servidor nuevo).

3. Ejecutamos el siguiente comando desde Barman

   ```bash
   barman recover \
   --remote-ssh-command "ssh postgres@<ip_server>" \
   --target-time="2024-01-21 17:00:00.00+00:00" \
   <id_server> <backup_id> <ruta_destino>
   ```

Donde:

- `<ip_server>` es la IP del servidor destino, donde previamente hemos realizado la configuración de las claves de SSH.
- `--target-time` es la fecha de cuando queremos recuperar el backup. He dejado esa fecha para saber el formato que tiene que tener.
- `<id_server>` el nombre del servidor que hemos definido en la configuración del Barman, se puede obtener con el comando `barman list-backup all` para que te muestre todos los backups disponibles. Un ejemplo sería `dbpgn1-pro`.
- `<backup_id>` el timestamp del backup que tengamos disponible, también se puede sacar con el comando `barman list-backup all`. Un ejemplo sería `20240215T200002`.
- `<ruta_destino>` la carpeta donde vamos a dejar los datos en el servidor Postgres destino.

Con esto ya podremos iniciar de nuevo el servidor Postgres y ya tendrá los datos disponibles recuperados.

```bash
systemctl start postgresql@12-main.service
```

Este post más corto de lo normal, pero era algo necesario de hacer, porque podemos tener los backups que queramos, pero si no sabemos cómo utilizarlos, de poco nos sirve. Una práctica recomendable a realizar en nuestros entornos productivos es realizar cada cierto tiempo, semestralmente por ejemplo, un simulacro de restauración, para comprobar que nuestros backups no están corruptos el día que lo necesitemos realmente.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
