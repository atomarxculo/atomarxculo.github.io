---
title: Instalar KVM en Ubuntu
date: 2026-01-13 17:25:00 +0100
description: Hace poco tuve que desplegar un servidor con bastante recursos al que no podíamos instalarle proxmox para sacarle todo su potencial, así que decidimos utilizar KVM y aproveché para documentar varios apartados de cómo utilizarlo.
image: /assets/img/sysadmin.jpg # Add image post (optional)
tags: [linux, kvm, virtualizacion]
categories: [linux, virtualizacion]
---

Hace poco tuve que desplegar un servidor con bastante recursos al que no podíamos instalarle proxmox para sacarle todo su potencial y desplegar varias VMs en él, así que decidimos utilizar KVM y aproveché para documentar varios apartados de cómo utilizarlo.

En este post empezaremos por el principio, instalando KVM y las librerías necesarias en un servidor Ubuntu.

## Pasos previos

Antes de ponernos a instalar, tenemos que comprobar ciertas cosas.

### Comprobar si Ubuntu soporta la virtualización

Ejecutamos el siguiente comando

```bash
egrep -c '(vmx|svm)' /proc/cpuinfo
```

Si el comando devuelve un valor distinto a `0`, nuestro procesador no tiene la capacidad de de virtualizar y no podremos seguir este post.

### Comprobar si Ubuntu puede usar la aceleración KVM

Ejecutamos el siguiente comando

```bash
sudo kvm-ok
```

Si nos devuelve `KVM acceleration can be used`, nuestro Ubuntu podrá usar KVM.

Con esto ya podremos pasar a la instalación.

## Instalar los paquetes de KVM

```bash
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils virtinst -y
```

### Agregar usuarios al grupo de KVM

Para no tener que estar con un usuario con permisos de `sudo`, agregaremos a un usuario al grupo `libvirt` para que tenga los permisos necesarios para ejecutar los comandos.

```bash
sudo adduser $USER libvirt
```

Y al grupo `kvm`

```bash
sudo adduser $USER kvm
```

### Verificar instalación

Para comprobar que todo funciona correctamente, ejecutamos el comando `virsh list --all` y no devuelve ningún error, la instalación se habrá hecho correctamente.

Con esto ya tendremos KVM instalado, en los siguientes posts veremos más comandos y utilidades para desplegar máquinas, configurar redes, almacenamiento y configuración más avanzada.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
