---
layout: post
title: Instalar Let's Encrypt en CentOS 7 y Ubuntu 20.04
date: 2023-03-18 12:00:00 +0000
description: 
img: sysadmin.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, centos, ubuntu, blog]
---

**Importante, esto sólo es válido si tenemos un dominio público para que Let's Encrypt pueda comprobar nuestra identidad y un registro DNS publicado, no funciona si queremos trabajar con localhost.**

## Dependencias para CentOS 7

Sólo indico para CentOS ya que para Ubuntu no es necesario instalar nada previamente, actualizar el sistema con `apt update` y ya.
Actualizamos e instalamos dependencias necesarias. Además de asegurarnos que tenemos disponible _epel-release_.  
```bash
yum update -y
yum -y install yum-utils
```

En la [Wiki de CentOS][wikicentos] te indican cómo activarlo en arquitecturas ARMHFP por si trabajais en una Raspberry Pi.

Una vez hecho esto, podemos seguir con la instalación.

## Instalación Certbot

Instalamos Certbot.  
```bash
# Para CentOS
yum install certbot

# Para Ubuntu
apt install certbot
```

Comprobamos que se ha instalado correctamente ejecutando `certbot --version` y que nos muestre la versión del programa.

## Creación de los certificados

Para obtener únicamente el certificado, ejecutaremos el siguiente comando, reemplazando lo que viene a continuación de `-d` por nuestro dominio. Aquí pondremos algunos parámetros más, porque el comando puede llegar a ser un poco puñetero si dejamos los valores por defecto.

```bash
certbot certonly --manual --preferred-challenges=dns --email=samuran@samurantech.com --agree-tos -d *.samurantech.com
```

Donde:
* `certonly`, indicamos que queremos descargar el certificado, que nos proporcione los ficheros.
* `--manual`, hacemos que la ejecución sea de forma interactiva, que nos permita realizar cambios en los registros DNS, por ejemplo, antes de continuar con la ejecución del comando.
* `--preferred-challenges=dns`, recomiendo esta opción porque sólo tendremos que crear un registro TXT en nuestro proveedor de DNS para que el comando compruebe que tenemos en propiedad ese dominio. Hay otra opción cambiando `dns` por `http`, pero la considero más tediosa al tener que crear un fichero en un servidor, publicarlo a internet y el comando compruebe si existe.
* `--email=samuran@samurantech.com`, la cuenta de correo donde llegarán las notificaciones importantes.
* `--agree-tos`, aceptamos las condiciones de uso y términos.
* `-d <dominio>`, dominio del que queremos obtener un certificado. Con * indicamos que sea un wildcard (comodín para subdominios).

Cuando lo ejecutemos nos aparecerá un registro TXT que tendremos que crear (os generará un valor aleatorio, yo he puesto cualquier valor para el ejemplo):

```text
Please deploy a DNS TXT record under the name
_acme-challenge.samurantech.com with the following value:

xxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx

Before continuing, verify the record is deployed.
```

Una vez creado el registro TXT en nuestro proveedor DNS, daremos a `Enter` y los servidores de Let's Encrypt se encargarán de comprobar que eso es así.

Con esto tendremos todos los ficheros necesarios en la carpeta `/etc/letsencrypt/live/<dominio>/`.

Y como último, no olvidar configurar que los certificados se renueven automáticamente creando una tarea en cron con `crontab -e`:

```bash
00 5 * * * /usr/bin/certbot renew
```

Esto ejecutará la tarea todos los días a las 5 de la mañana.

[wikicentos]: https://wiki.centos.org/SpecialInterestGroup/AltArch/armhfp#How_Can_I_Enable_EPEL_7_on_armhfp_.3F

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
