---
title: Cambiar contraseña a un usuario en MySQL
date: 2025-12-31 18:25:00 +0100
description: Otro post cortito enfocado a MySQL, esta vez para cambiar la contraseña de cualquier usuario.
image: /assets/img/sysadmin.jpg # Add image post (optional)
tags: [linux, mysql, mariadb]
categories: [linux, mysql]
---

Otro post cortito enfocado a MySQL, esta vez para cambiar la contraseña de cualquier usuario.

Para poder hacerlo, tenemos que ejecutar el siguiente comando desde la propia consola de MySQL.

```sql
MariaDB [(none)]> ALTER USER 'username'@'host' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
```

Esto vale para cualquier usuario, ya sea uno de sistema, uno nóminal o el propio usuario `root`. Si no sabemos qué usuarios hay en MySQL, en el [post anterior](https://www.samurantech.com/posts/mysql-ver-usuarios-permisos/) hablé sobre cómo poder consultarlos.

Tengo que indicar que si ejecutamos el comando así, estaremos usando el plugin de autenticación por defecto del sistema, existen otros pero no voy a profundizar sobre ello aquí. De momento hay que saber que si ponemos alguna opción distinta, podremos hacer que aplicaciones legacy o clientes existentes dejen de funcionar más allá de haber cambiado la contraseña, y esto es un verdadero dolor de cabeza cuando no caéis en que falla por esto.

Con esto ya sabremos cómo cambiar la contraseña de los usuarios y damos pie a otro post donde profundizaré en los tipos de plugins de autenticación en MySQL.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
