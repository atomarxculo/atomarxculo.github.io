---
layout: post
title: Ampliar disco LVM
date: 2022-06-01 21:50:00 +0200
description: 
img: linux-logo.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [lvm, linux]
---

Para ampliar el espacio en un disco que ya esté en el servidor, sin añadir un disco duro nuevo, hay que seguir los siguientes pasos.

Añadimos espacio en VWMare al disco. El resto de los pasos ya son dentro del servidor.

Para no tener que reiniciar el servidor para que coja los cambios, ejecutamos el siguiente comando, cambiando la parte de sda por el disco que corresponda:
```bash
echo 1 > /sys/class/block/sda/device/rescan`
```

Con `fdisk -l` veremos si se ha ampliado el disco. Ahora crearemos la partición.

Utilizando el comando `cfdisk /dev/<disco>` nos aparecerá un menú para poder hacer la configuración:  
_En este caso lo haremos sobre el disco /dev/sda, que tenía 24GB y le he aumentado en 1GB._

![cfdisk](..\assets\img\cfdisk.png)

1. Seleccionamos _New_, elegimos el tamaño que queremos que tenga dicha partición y si va a ser _primary_ o _logical_, yo recomiendo que si vamos a ampliar varias veces el disco, escojamos _logical_ ya que la otra opción permite crear pocas.
2. Seleccionamos _Type_ y elegimos _Linux LVM_ o escribimos el código _8E_.
3. Guardamos los cambios con Write, aplicamos los cambios escribimos yes y salimos con Quit.

Ejecutamos `partprobe` por si no ha refrescado los cambios.

Ahora creamos el volumen fisico para LVM con `pvcreate /dev/<particion>`, en este caso es _/dev/sda4_.

Añadimos el volumen fisico al grupo, para ver los grupos de discos que existen ejecutamos `vgs`, con el comando `vgextend <vg>/dev/sda4`, donde `<vg>` es el grupo que nos haya mostrado el comando anterior.

Ahora añadimos el espacio al volumen lógico, para ver los volumenes logicos que hay ejecutamos `lvs` y para saber el nombre completo también podemos verlo con `df`. El formato es algo tal que así `/dev/mapper/<vg>-<lv>`, `<lv>` es el resultado del comando `lvs`. Un ejemplo del comando en cuestión sería `lvextend -r -l +100%FREE /dev/mapper/pvg0-lv--root`

1. Es importante tener el `-r` para que aplique los cambios automaticamente.
2. Si queremos seleccionar un porcentaje como en el ejemplo, hemos dicho que coja todo el espacio disponible, es con la opción `-l` (es una L minuscula), en cambio si queremos que sea una cantidad especifica de GB, la opción será `-L <nº de GB>GB`.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
