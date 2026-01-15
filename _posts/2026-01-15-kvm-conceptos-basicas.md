---
title: Conceptos y comandos básicos de KVM
date: 2026-01-15 18:25:00 +0100
description: Siguiendo con la tématica del post anterior, hoy vamos a ver conceptos y comandos básicos que se pueden utilizar en cualquier entorno que utilice KVM y poder hacer una gestión minima de los recursos que nos ofrece este virtualizador.
image: /assets/img/sysadmin.jpg # Add image post (optional)
tags: [linux, kvm, virtualizacion]
categories: [linux, virtualizacion]
---

Siguiendo con la tématica del post anterior, hoy vamos a ver conceptos y comandos básicos que se pueden utilizar en cualquier entorno que utilice KVM y poder hacer una gestión minima de los recursos que nos ofrece este virtualizador.

Empecemos con la creación de una VM.

## Creación de una VM con `virt-install`

```bash
virt-install \
--name=vmtest \
--ram=4096 \
--vcpus=2 \
--disk path=/var/lib/libvirt/images/vmtest/vmtest.qcow2,size=50 \
--cdrom /var/lib/libvirt/images/ubuntu-24.04.3-live-server-amd64.iso \
--network network=default \
--graphics vnc
```

Donde:

> `--name` es el nombre de la VM
>
> `--ram` la RAM en MB de la VM
>
> `--vcpus` las CPUs
>
> `--disk path=` la ruta donde creará el disco de la VM en formato *.qcow2*, `size=` es el tamaño del disco en GB
>
> `--cdrom` ruta y fichero con la ISO para hacer la instalación de la VM
>
> `--network` la red donde estará la VM
>
> `--graphics` si la VM debe tener gráficos, una pantalla antes de poder conectarnos por SSH. Existe la opción de `vnc` y `none`.

El resto del post serán comandos que nos permitirá hacer lo que se indica en el título del mismo.

# Gestión de máquinas virtuales

## Listar VMs

```bash
# VMs en ejecución
virsh list

# Todas las VMs, incluidas las apagadas
virsh list --all
```

## Información de una VM

```bash
virsh dominfo <nombre>
```

## Iniciar/apagar/reiniciar una VM

```bash
virsh start <nombre>
virsh shutdown <nombre>
virsh reboot <nombre>
# Apagado forzado
virsh destroy <nombre>
```

## Autostart de una VM

```bash
# Activar inicio automático
virsh autostart <nombre>
# Desactivar inicio automático
virsh autostart --disable <nombre>
```

## Eliminar una VM

```bash
virsh undefine <nombre>
```

Tener en cuenta que no elimina el disco, para eliminar el disco:

```bash
rm /var/lib/libvirt/images/<nombre>.qcow2
```

# Snapshots

## Crear snapshot

```bash
virsh snapshot-create-as <nombre> snapshot1 "Snapshot inicial"
```

## Ver snapshots

```bash
virsh snapshot-list <nombre>
```

## Revertir snapshot

```bash
virsh snapshot-revert <nombre> snapshot1
```

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
