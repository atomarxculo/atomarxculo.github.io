---
layout: post
title: Instalar Docker en Ubuntu
date: 2021-02-17 16:45:00 +0200
description: En el post anterior aprendimos a instalar Docker, en este post haremos lo propio Ubuntu.
img: docker.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [docker, linux, ubuntu]
---

En el post anterior aprendimos a instalar Docker, en este post haremos lo propio Ubuntu. Aunque haya varias maneras de instalarlo, en esta caso utilizaremos la instalación por repositorio.

### Paso 1: Eliminar versiones anteriores de Docker

Siempre viene bien hacer una limpieza por si el equipo con el que estamos ya tiene una versión anterior de Docker instalada.

```bash
sudo apt remove docker docker-engine docker.io containerd runc
```

### Paso 2: Instalamos dependencias

El siguiente paso es instalar las dependencias que necesita Docker para instalarse.  

```bash
sudo apt update
sudo apt install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

### Paso 3: Configurar el repositorio de Docker

Agregamos la key GPG oficial de Docker.

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

Con este comando añadimos el repositorio dentro de la carpeta `sources.list.d`

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Y actualizamos los repositorios.

```bash
sudo apt update
```

### Paso 4: Instalamos Docker CE (Community Edition)

Finalmente, instalamos Docker ejecutando el siguiente comando:  

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### Paso 5: Administrar el servicio de Docker

Aunque hayamos instalado Docker, todavía no se está ejecutando. Tenemos que configurarlo ejecutando los siguientes comandos:

* Habilitamos que el servicio inicie con el arranque del servidor:  

```bash
systemctl enable docker
```

* Iniciamos el servicio de Docker para que empiece a funcionar:  

```bash
systemctl start docker
```

* Podemos habilitar el servicio y que arranque a la vez si ejecutamos el siguiente comando:

```bash
systemctl enable docker --now
```

* Comprobamos que el servicio está iniciado:  

```bash
systemctl status docker
```

Nos debería aparecer una línea verde que indica que el servicio está en funcionamiento.

### Paso 6: Trabajando con Docker

Tendremos que agregar el usuario con el que hemos instalado Docker al grupo correspondiente para que pueda ejecutar los comandos sin tener que utilizar `sudo` constantemente.

```bash
sudo usermod -aG docker $USER
```

Una vez hecho esto, vamos a comprobar que Docker funciona correctamente.  

```bash
docker run hello-world
```

Con este comando, descargaremos el contenedor _hello-world_ y lo ejecutaremos una vez haya terminado. Si todo ha funcionado correctamente, nos aparecerá el siguiente mensaje:

```text
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

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
