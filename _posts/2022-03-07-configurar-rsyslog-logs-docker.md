---
layout: post
title: Configurar Rsyslog para recolectar logs de Docker
date: 2022-03-07 19:00:00 +0200
description: En el post anterior, configuramos un servidor rsyslog para centralizar todos los logs de nuestra infraestructura. # Add post description (optional)
img: /assets/img/rsyslog-logo.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, docker, rsyslog]
categories: [linux, docker, rsyslog]
---

En el post anterior, configuramos un servidor rsyslog para centralizar todos los logs de nuestra infraestructura. En este, configuraremos tanto el servidor Docker que desplegamos para que envíe los logs al rsyslog, como el servidor rsyslog para que los recoja.

## Configurar el servidor de rsyslog

Primero vamos a crear un fichero de configuración que recolecte todos los logs del demonio de Docker. Para ello crearemos el fichero `/etc/rsyslog.d/docker-daemon.log` en el servidor rsyslog con el siguiente contenido:

```conf
$template DockerLogs, "/var/log/docker/daemon.log"

if $programname startswith 'dockerd' then -?DockerLogs

& stop
```

Con esto haremos que todo log que empiece por _dockerd_ se guarde en la ruta definida.

Ahora, crearemos el fichero de configuración para los logs de los contenedores, esto también se hará en el servidor rsyslog. El nombre del fichero será `/etc/rsyslog.d/docker-containers.log` y tendrá lo siguiente:

```conf
$template DockerContainerLogs,"/var/log/docker/%hostname%_%syslogtag:R,ERE,1,ZERO:.*container_name/([^\[]+)--end%.log"

if $syslogtag contains 'container_name'  then -?DockerContainerLogs

& stop
```

Aquí indicamos que guarde en la ruta definida e indique el nombre del host que ha enviado dichos logs.

Reiniciamos el servicio para que se apliquen las configuraciones que acabamos de agregar:  
`systemctl restart rsyslog`

## Configurar Docker para que envíe los logs a rsyslog

Una vez configurado rsyslog, vamos a configurar el fichero del demonio de Docker, `daemon.json`, que se encuentra en `/etc/docker` para servidores Linux y `%userprofile%\.docker` en Windows con Docker Desktop.

Tendremos que añadir el siguiente texto a continuación de lo que ya haya en el fichero (he tenido que colocar una imagen porque no reconoce _.Name_ como texto por el formato y lo borra):

![dockerrsyslog](..\assets\img\dockerrsyslog.png)

Esto etiquetará a todos los contenedores con `container_name` y el nombre de dicho contenedor para que rsyslog sea capaz de procesarlo según lo hemos indicado anteriormente.

Reiniciamos el servicio de Docker para aplicar cambios:  
`sudo systemctl restart docker`

Con esto ya empezarán a llegar los logs de Docker y de los contenedores que ejecute, teniendo de esta forma una manera más cómoda de poder visualizar que puede ocurrir con un contenedor y no tener que acceder a todos los servidores Docker que tengamos en busca de él.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
