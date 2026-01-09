---
title: Hacer backup de una BDD en MySQL
date: 2026-01-09 17:25:00 +0100
description: Por si no os habéis dado cuenta, he tenido que empezar a trabajar más con MySQL, haciendo que pueda escribir más posts al respecto. El de hoy va sobre un comando muy simple para hacer backups de forma fácil y cómoda.
image: /assets/img/sysadmin.jpg # Add image post (optional)
tags: [linux, mysql, mariadb]
categories: [linux, mysql]
---

Por si no os habéis dado cuenta, he tenido que empezar a trabajar más con MySQL, haciendo que pueda escribir posts al respecto. El de hoy va sobre un comando muy simple para hacer backups de forma fácil y cómoda.

Con el siguiente comando podemos hacer un backup y que lo guarde en el mismo directorio en el que estamos con la fecha que se ha realizado.

```bash
MYSQL_DATABASE=bbd_test
mysqldump -u root -p$MYSQL_PASSWORD --single-transaction --quick $MYSQL_DATABASE | gzip > bk.$MYSQL_DATABASE.`date +%d%m%Y`.sql.gz
```

He definido la variable `MYSQL_DATABASE` para no tener que poner el nombre de la BDD varias veces. En caso de que no tener definida la variable `MYSQL_PASSWORD`, tendremos que quitar la primera variable en el comando para que nos pida la contraseña y tener que ponerla a mano.

Esto podremos ponerlo en el cron de nuestro servidor y que así que vayan haciendo los backups de forma automática.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
