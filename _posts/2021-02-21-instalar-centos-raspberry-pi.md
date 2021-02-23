---
layout: post
title: Instalar CentOS en Raspberry Pi
date: 2021-02-21 21:48:00 +0200
description: Hace tiempo tengo varias Raspberry Pi muertas de risa y quiero darles un algún uso, pero no quiero utilizar Raspberry Pi OS, así que instalaremos CentOS 7 para arquitecturas ARM. # Add post description (optional)
img: centos-logo.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [centos, raspberry pi]
---

Hace tiempo tengo varias Raspberry Pi muertas de risa y quiero darles un algún uso, pero no quiero utilizar Raspberry Pi OS, así que instalaremos CentOS 7 para arquitecturas ARM. Como curiosidad, Raspberry Pi OS, antes Raspbian es el sistema operativo que se suele utilizar en Raspberry Pi basado en Debian.

En caso utilizaré una Raspberry Pi 4 de 4GB de RAM ([Enlace artículo Amazon][amazonraspberry], post **no** esponsorizado por Amazon).

## Descargar CentOS para Raspberry Pi

Primero tendremos que descargarnos la imagen ISO de los [repositorios oficiales de CentOS][centos].  
En esta página tendremos un listado de los mirrors de CentOS, así que elegiremos uno de la lista.

Una vez en el listado tendremos que elegir el fichero que contiene el **número 4** en el nombre, indicando que es para la Raspberry Pi 4. Un ejemplo sería `CentOS-Userland-7-armv7hl-RaspberryPI-Minimal-4-2009-sda.raw.xz`, que contiene `Minimal-4`. Esta es la opción que no incluye una interfaz gráfica, sólo terminal.

El resto son versiones para la Raspberry Pi 3, tanto la versión minimal como con distintos entornos de escritorio.

Yo elegiré la versión Minimal, porque no me interesa tener un entorno gráfico, ya que me conectaré a través de SSH a ella.

Una vez descargada, comprobamos si el hash del fichero descargado corresponde con el publicado en la página. Normalmente es el fichero que se encuentra en el mismo directorio de donde hemos sacado la ISO llamado `sha256sum.txt`. En él saldrán los hashes en SHA256 de cada uno de los ficheros.

Para comprobarlo lo haremos de las siguientes maneras dependiendo del sistema operativo.

* Windows. Desde una consola de powershell, iremos al directorio donde hemos descargado el fichero y ejecutaremos el siguiente comando:
```cmd
Get-FileHash <fichero>
```

* Linux. Desde la terminal, iremos al directorio donde hemos descargado el fichero y ejecutaremos el siguiente comando:
```bash
sha256sum <fichero>
```
En este caso usaremos este comando porque queremos obtener el hash SHA256.

Obtenido el hash con el comando, ahora sólo es compararlo con el de la página. No me seáis cafres y con que comprobéis los primeros 6 dígitos y los 6 últimos valdría.

## Montar CentOS en la tarjeta SD

Cuando hayamos descargado la imagen de CentOS y comprobadp que el hash es correcto, vamos a montar la ISO en nuestra tarjeta SD. Yo en este caso utilizaré [Rufus][rufus], pero podéis usar otros como BalenaEtcher.
**A tener en cuenta:** los datos que tengamos en la tarjeta SD se borrarán porque ésta tiene que formatearse.

En caso de que vuestro equipo no tenga lector de tarjetas SD, como me pasa a mí, podéis comprar un lector SD/Micro SD adaptador USB.

Una vez terminado, pondremos la tarjeta en nuestra Raspberry Pi y la conectaremos a la corriente para encenderlo.

## Trabajando con CentOS

Para poder conectarnos a nuestra Raspberry Pi tenemos que tener un adaptador Micro HDMI a HDMI, yo os recomiendo comprar este pack que viene con una carcasa para darle un mejor aspecto.  ([Enlace artículo Amazon][amazonpack])

Además de un teclado USB para poder escribir en la terminal.

El usuario por defecto es `root`.  
La contraseña por defecto es `centos`.

Es recomendable cambiar la contraseña, para ello ejecutamos el comando:
```bash
passwd
```

Expandimos la partición de root para que coja el tamaño máximo de la tarjeta SD con `rootfs-expand`.

Configuramos la zona horaria que corresponda con `timedatectl set-timezone Europe/Madrid`.

Ahora que hemos hecho esos cambios, vamos a actualizarla e instalar algún paquete. Para manejar los paquetes en CentOS, usamos el comando `yum`.

* Actualizar:
```bash
yum update
```

* Instalar:
```bash
yum install <nombre_paquete>
```

Por ejemplo, podemos instalar el editor de texto `vim`.
```bash
yum install vim
```

* Eliminar:
```bash
yum remove <nombre_paquete>
```

Por ejemplo, podemos eliminar el paquete que acabamos de instalar.
```bash
yum remove vim
```

Si al final de estos comandos ponemos la opción `-y`, no será necesario confirmar que queremos actualizar, instalar o eliminar un paquete.

Con esto podemos dar por finalizado este post, en posteriores posts le daremos uso a la Raspberry y realizarle una configuración más avanzada.

## Aporte extra

Trabajando con CentOS en Raspberry Pi por defecto no vienen disponibles los repositorios _epel_, pero podemos activarlos sin mayor inconveniente.
En la [Wiki de CentOS][wikicentos] te indican cómo activarlo.

Para ello hay que ejecutar lo siguiente:

```text
cat > /etc/yum.repos.d/epel.repo << EOF
[epel]
name=Epel rebuild for armhfp
baseurl=https://armv7.dev.centos.org/repodir/epel-pass-1/
enabled=1
gpgcheck=0

EOF
```

Eso creará un fichero indicando que también busque en los repositorios de la URL indicada.

Una vez hecho, actualizamos con `yum update -y` y ya podremos seguir trabajando.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!

[amazonraspberry]: https://www.amazon.es/gp/product/B07TC2BK1X
[centos]: http://isoredirect.centos.org/altarch/7/isos/armhfp/
[rufus]: https://rufus.ie/
[amazonpack]: https://www.amazon.es/gp/product/B07WN3CHGH
[wikicentos]: https://wiki.centos.org/SpecialInterestGroup/AltArch/armhfp#How_Can_I_Enable_EPEL_7_on_armhfp_.3F
