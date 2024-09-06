---
layout: post
title: Agregar disco a LVM
date: 2024-04-01 08:00:00 +0000
description: En este post añadiremos un nuevo disco LVM de nuestro servidor Linux.
img: linux-logo.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, lvm]
---

En este post añadiremos un nuevo disco LVM de nuestro servidor Linux.

En posts [anteriores](https://www.samurantech.com/ampliar-disco-lvm/) (ha pasado tiempo desde entonces, debería darle una vuelta y actualizarlo) vimos cómo ampliar un disco LVM que ya teníamos.

```bash
cfdisk /dev/sdb
pvcreate /dev/sdb1
vgcreate vg_ddbb /dev/sdb1
lvchange -ay /dev/vg_ddbb/lv_ddbb
mkfs.xfs /dev/mapper/vg_ddbb-lv_ddbb
mkdir -p /data01/pgstorage/
```

En /etc/fstab

```bash
/dev/mapper/vg_ddbb-lv_ddbb /data01/ xfs defaults 0 0
```

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
