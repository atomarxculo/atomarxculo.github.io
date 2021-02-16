---
layout: post
title: Instalar Docker en CentOS
date: 2021-02-16 16:45:00 +0000
description: Hoy hablaremos de una herramienta muy interesante y que cada vez tiene más cabida en nuestro trabajo como sysadmin, Docker. Aprenderemos a instalar Docker en CentOS. # Add post description (optional)
img: docker.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [docker]
---

Hoy hablaremos de una herramienta muy interesante y que cada vez tiene más cabida en nuestro trabajo como sysadmin, Docker. Aprenderemos a instalar Docker en Linux.

Vamos a empezar hablando de lo que es Docker, para tener una idea. Docker es una tecnología de creación de contenedores que permite la creación y el uso de contenedores Linux o Windows. Suelta la explicación que viene en la documentación, seguimos desglosando lo qué es Docker.

Docker revoluciona el concepto que tenemos de máquinas virtuales, ya no virtualiza un sistema operativo como venimos haciendo desde hace años, lo que hace es virtualizar el software encapsulandolo, gracias a que utiliza caracteristicas del kernel de Linux, de hay que se llamen contenedor, haciendo referencia a las cajas de los barcos. Dentro del contenedor se ejecuta todas aquellas cosas que la aplicación necesita para funcionar y la propia aplicación. El contenedor es la aplicación en funcionamiento por así decirlo.

En posts posteriores seguiremos viendo más características del software y explicando cómo se compone, por ahora, vamos al lío que a eso hemos venido.

## Instalación CentOS

Instalaremos Docker en un CentOS 7.

### Paso 1: Actualizar paquetes

En la terminal, escribiremos el siguiente comando para actualizar los repositorios de nuestro servidor.

`sudo yum update -y`

### Paso 2: Instalamos dependencias

El siguiente paso es instalar las dependencias que necesita Docker para instalarse.

`sudo yum install yum-utils device-mapper-persistent-data lvm2 -y`

### Paso 3: Agregamos el repositorio de Docker a CentOS

Por defecto, Docker no viene en los repositorios oficiales de Centos, por lo que tenemos que agregarlos nosotros para poder instalarlo. Esta es la versión estable.

`sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo`

### Paso 4: Instalamos Docker CE (Community Edition)

Finalmente, instalamos Docker ejecutando el siguiente comando.

`sudo yum install docker-ce`

### Paso 5: Administrar el servicio de Docker

Aunque hayamos instalado Docker, todavía no se está ejecutando. Tenemos que configurarlo ejecutando los siguientes comandos.

Habilitamos que el servicio inicie con el arranque del servidor.  

`systemctl enable docker`

Iniciamos el servicio de Docker para que empiece a funcionar.

`systemctl start docker`

Comprobamos que el servicio está iniciado.

`systemctl status docker`

Nos debería aparecer una línea verde que indica que el servicio está en funcionamiento.

### Paso 6: Trabajando con Docker

En entornos de laboratorio se suele utilizar el usuario root para poder trabajar comodamente, pero una buena práctica es darle permisos a un usuario que no sea root permisos sobre el grupo docker. Si estáis usando el usuario al que habéis dado permisos, tenéis que reiniciar la sesión.

`sudo usermod -aG docker <usuario>`

Una vez hecho esto, vamos a comprobar que Docker funciona correctamente.

`docker run hello-world`

Con este comando, descargaremos el contenedor _hello-world_ y lo ejecutaremos una vez haya terminado. Si todo ha funcionado correctamente, nos aparecerá el siguiente mensaje.

```bash
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

En siguientes posts explicaremos más apartados de Docker, como qué son las imagenes, cómo crearlos con Dockerfiles, descargarnos imagenes sin ejecutarlas o acceder a los mismos con una consola interactiva. 

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
