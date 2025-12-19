---
layout: post
title: Instalar Docker en Windows
date: 2021-02-19 15:55:00 +0200
description: En el post anterior, aprendimos cómo instalar Docker en un servidor CentOS. En esta ocasión haremos lo propio en un Windows 10, para poder trabajar con la herramienta en nuestro equipo. # Add post description (optional)
image: /assets/img/docker.jpg # Add image post (optional)
tags: [windows, docker]
categories: [windows, docker]
---

En el [post][linuxdocker] anterior, aprendimos cómo instalar Docker en un servidor CentOS. En esta ocasión haremos lo propio en un Windows 10, para poder trabajar con la herramienta en nuestro equipo.

## Requisitos

* Windows 10 64-bit: Pro, Enterprise o Education.
* 4GB de RAM.
* Tener habilitado la virtualización en la BIOS.

En la web oficial de Docker te indican que necesitas tener habilitado el cliente de HyperV, pero como fue en mi caso, al tener habilitado esta característica, aplicaciones como VMware Workstation dejan de funcionar. Por suerte, a partir de Windows 10 2004, salió Windows Subsystem for Linux (WSL) 2, permitiendo correr contenedores Docker de forma nativa, además de reducir el consumo de CPU y memoria de forma considerable.

Para poder seguir este tutorial, tenemos que tener actualizado Windows 10 a la versión 2004 o superior.

## Instalación WSL 2

Para poder tener instalado WSL 2, debemos instalar antes la versión 1. Desde una consola de Powershell con permisos de administrador, ejecutamos el siguiente comando:

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

Además tenemos que instalar la característica "Virtual Machine Platform" o su nombre en español "Plataforma de máquina virtual".

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

Reiniciamos el equipo y seguimos con el siguiente paso.

En caso de tener ya instalado WSL 1, estos pasos pueden que nos den error. Para actualizar a la versión 2, tenemos que descargar el siguiente paquete de la [web de Windows][wsl2]. Una vez descargado, ejecutamos el fichero y seguimos los pasos indicados.

## WSL 2 por defecto

Por defecto nuestro sistema utilizará WSL 1, por lo que tenemos que cambiar dicha configuración para que utilice la versión 2. Ejecutamos el siguiente comando en la consola de Powershell.

```powershell
wsl --set-default-version 2
```

Para comprobar las distribuciones que tenemos instaladas, podemos hacerlo con el siguiente comando.

```powershell
wsl -l -v
```

## Instalar y configurar Docker

Ya es hora de instalar Docker después de haber seguido los pasos anteriores. Descargamos *Docker Desktop for Windows* desde la web de [Docker][dockerweb] o de [Docker Hub][dockerhub] y lo instalamos. En la instalación podremos habilitar la compatibilidad con WSL 2 y una vez termine, tendremos que reiniciar el equipo.

Ahora que el equipo haya arrancado e iniciemos Docker Desktop, nos aparecerá una ventana en la aplicación con un tutorial que podemos hacer u omitir.

Para comprobar que todo ha ido bien, abrimos una consola de Powershell y ejecutamos la imagen hello-world como la anterior vez.

```powershell
docker run hello-world
```

Es una herramienta muy potente que yo utilizo para realizar desarrollos y pruebas sin tener que desplegar una máquina virtual, ahorrando mucho tiempo en el proceso, por lo cual la recomiendo.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!

[linuxdocker]: https://www.samurantech.com/instalar-docker-linux/
[wsl2]: https://docs.microsoft.com/es-es/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package
[dockerweb]: https://www.docker.com/products/docker-desktop
[dockerhub]: https://hub.docker.com/editions/community/docker-ce-desktop-windows
