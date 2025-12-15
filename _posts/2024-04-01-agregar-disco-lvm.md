---
layout: post
title: Agregar disco a LVM
date: 2024-04-01 08:00:00 +0000
description: En posts anteriores (ha pasado tiempo desde entonces, debería darle una vuelta y actualizarlo) vimos cómo ampliar un disco LVM que ya teníamos.
img: /assets/img/linux-logo.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, lvm]
categories: [linux, lvm]
---

En posts [anteriores](https://www.samurantech.com/ampliar-disco-lvm/) (ha pasado tiempo desde entonces, debería darle una vuelta y actualizarlo) vimos cómo ampliar un disco LVM que ya teníamos, así que en este post vamos a añadir un nuevo disco LVM de nuestro servidor Linux.

Para empezar, vamos a añadir un disco en nuestro servidor utilizando nuestra herramienta de virtualización, ya sea VMware, VirtualBox, KVM, etcétera. Damos por hecho que sabéis hacer esta parte, porque cada herramienta es un mundo.

Una vez hecho esto, vamos al servidor en cuestión e iremos ejecutando los comandos que voy indicando, los cuales pondré con la explicación de lo que hace cada uno:

```bash
lsblk # Para listar los discos físicos, en mi caso es el disco /dev/vdb
```

Vamos a usar la herramienta `cfdisk` hacer el particionado del disco, también podemos usar `fdisk`, pero me resulta más cómodo esta herramienta. Cada en el siguiente bloque de código pondré las opciones a elegir en cada línea de comentario.

```bash
sudo cfdisk /dev/vdb 
# Elegimos gpt
# Seleccionamos [New] y el tamaño de la partición, en mi caso 5G
# Seleccionamos [Type] y buscamos "Linux LVM"
# Seleccionamos ahora [Write] y confirmamos los cambios escribiendo "yes"
# Cerramos el programa con [Quit]
```

Una vez creado la partición del disco, vamos a crear la partición física LVM, el grupo y la partición lógica.

```bash
sudo pvcreate /dev/vdb1 # Creamos la partición física
sudo vgcreate vg_test /dev/vdb1 # Creamos el grupo indicando la partición física
sudo lvcreate -n lv_test -l +100%FREE vg_test # Creamos la partición lógica indicando el tamaño del mismo y el grupo al que va asociado
sudo lvchange -ay /dev/vg_test/lv_test # Activamos la partición física. IMPORTANTE: esto sólo se hace la primera vez que creamos la partición, para ampliarla no es necesario
sudo mkfs.xfs /dev/mapper/vg_test-lv_test # Le damos formato, en este XFS
sudo mkdir /data01/ # Creamos una carpeta donde montaremos el disco
```

Lo pongo fuera del código para remarcarlo. **IMPORTANTE**: esto sólo se hace la primera vez que creamos la partición, para ampliarla no es necesario.

Ahora vamos a configurar el fichero `/etc/fstab` para que el disco se monte automáticamente en el servidor cada vez que arranque.

```bash
echo "/dev/mapper/vg_test-lv_test /data01/ xfs defaults 0 0" | sudo tee -a /etc/fstab # Con esto añadiremos directamente la línea en el fichero sin tener que editarlo
```

De momento no se ha montado la partición, si no queremos/tenemos que reiniciar el servidor, podemos ejecutar el comando `sudo mount -a` para que lo haga en caliente.

Una vez hecho, si ejecutamos el comando `df -h`, ya veremos la partición LVM con el tamaño del disco, el uso del mismo, lo que tiene disponible, su porcentaje y sobre qué carpeta está montado:

```bash
[vagrant@freeipa-server01 ~]$ df -h
Filesystem                   Size  Used Avail Use% Mounted on
devtmpfs                     4.0M     0  4.0M   0% /dev
tmpfs                        886M  171M  716M  20% /dev/shm
tmpfs                        355M  9.5M  345M   3% /run
/dev/mapper/rocky-root       125G  3.1G  122G   3% /
/dev/vda1                   1014M  202M  813M  20% /boot
tmpfs                        178M     0  178M   0% /run/user/1000
/dev/mapper/vg_test-lv_test  5.0G   68M  5.0G   2% /data01
[vagrant@freeipa-server01 ~]$
```

Con esto ya tendremos el nuevo disco en el servidor para darle el uso que queramos, separar las BBDD, almacenar los logs, etcétera.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
