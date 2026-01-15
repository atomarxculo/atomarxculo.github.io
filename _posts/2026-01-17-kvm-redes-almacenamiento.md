---
title: Gestión de redes y almacenamiento en KVM
date: 2026-01-17 18:25:00 +0100
description: Para este post podría haber hecho dos diferentes, pero he pensado que como iban a ser muy cortos, mejor sería juntarlo en uno solo.
image: /assets/img/sysadmin.jpg # Add image post (optional)
tags: [linux, kvm, virtualizacion]
categories: [linux, virtualizacion]
---

Para este post podría haber hecho dos diferentes, pero he pensado que como iban a ser muy cortos, mejor sería juntarlo en uno solo.

Empecemos con la parte de almacenamiento y los comandos para gestionar los discos y los pools.

# Gestionar almacenamiento

## Listar pools

```bash
virsh pool-list --all
```

## Información y contenido

```bash
virsh pool-info <pool>
virsh vol-list <pool>
```

## Creación de un nuevo volumen/disco

```bash
virsh vol-create-as default vm1.qcow2 20G --format qcow2
```

Y para terminar, los comandos relacionados con las redes.

# Gestionar redes

## Listar redes

```bash
virsh net-list --all
```

La carpeta donde se dejan los ficheros de configuración en Ubuntu por defecto es `/etc/libvirt/qemu`

## Información de red

```bash
virsh net-info <nombre>
# Con este comando nos mostrará la info en un XML
virsh net-dumpxml <nombre>
```

## Modificar una red

```bash
virsh net-edit <nombre>
```

Nos abrirá un editor de texto y podremos configurar el XML

## Crear una red

Creamos un fichero XML con el siguiente formato, el fichero para este ejemplo lo voy a llamar `red_nueva.xml`

```xml
<network>
  <name>red_prueba</name>
  <bridge name='virbr2'/>
  <ip address='192.168.100.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='192.168.100.2' end='192.168.100.254'/>
    </dhcp>
  </ip>
</network>
```

Y aplicamos el fichero, donde el nombre es el que hemos definido en la parte de `<name>` del fichero XML:

```xml
virsh net-define red_nueva.xml
virsh net-start red_prueba
virsh net-autostart red_prueba
```

## Destruir y eliminar red

```bash
virsh net-destroy <nombre>
virsh net-undefine <nombre>
```

Aunque estos posts más cortitos y que son un listado de comandos no tengan tanta chicha como otros más elaborados, vienen muy bien para tener una chuleta con todo esto.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
