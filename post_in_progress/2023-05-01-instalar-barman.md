---
layout: post
title: Instalar Barman para Ubuntu
date: 2023-05-01 08:00:00 +0000
description: Tener al día los backups es algo muy importante y más si hablamos de BBDD, por eso el día de hoy traigo esta herramienta llamada Barman.
img: sysadmin.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, ubuntu, postgres, backup]
---

Tener al día los backups es algo muy importante y más si hablamos de BBDD, por eso el día de hoy traigo esta herramienta llamada [Barman](https://pgbarman.org) que funciona con servidores PostgreSQL.

Para este tutorial voy a contar con que ya tengamos un servidor de PostgreSQL montado, para centrarnos únicamente en la instalación de Barman y la configuración que hay que realizar en ambos servidores.

## Instalación Barman

Para instalarlo es muy sencillo, sólo tendremos que ejecutar el siguiente comando en el servidor de Barman.

```bash
sudo apt update -y && sudo apt install barman -y
```

Con esto actualizaremos los repositorios en Ubuntu e instalaremos el paquete sin necesidad de tener que confirma que queremos hacerlo.

Una vez haya terminado, podremos ponernos a editar los ficheros de configuración, que se pueden encontrar bien en `/etc/barman.conf` o `/etc/barman/barman.conf`.

Para comprobar que versión tenemos instalada, podemos ejecutar `barman --version`

## Configuración Barman

En este apartado vamos a hacer la parte tanto que implica el servidor de barman como en el servidor PostgreSQL.

Lo primero que hay que hacer es iniciar sesión con el usuario **barman** y generar un par de claves para la conexión sin contraseña por SSH.

```bash
sudo su barman
ssh-keygen -t rsa
```

De esta forma, no tendremos que estar cambiando la contraseña del usuario **barman**. En el segundo comando, damos siguiente a todo y nos habrá creado el par de claves. Para pasarlos al otro servidor, podemos ejecutar el comando `ssh-copy-id` pero en ocasiones no tenemos la contraseña del usuario postgres, así que yo lo haré a mano, copiando el contenido del fichero `/var/lib/barman/.ssh/id_rsa.pub` y dejandolo en el fichero `authorized_keys` que crearemos cuando configuremos la parte de postgres.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
