---
layout: post
title: Eliminar backups fallidos de Barman
date: 2024-03-14 08:00:00 +0000
description: Por si algún casual fallasen varios backups de seguidos, en vez de eliminarlos uno a uno podemos hacer lo siguiente para eliminar todos.
img: /assets/img/sysadmin.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, ubuntu, postgres, backup]
categories: [linux, ubuntu, postgres, backup]
---

Por si algún casual fallasen varios backups de seguidos, en vez de eliminarlos uno a uno podemos hacer lo siguiente para eliminar todos.

Por si antes de eliminar los backups fallidos quieres saber cuáles hay, tenemos que ejecutar el siguiente comando para que te muestre un listado de lo mismos, donde \<server> es el servidor que queremos consultar.

```bash
barman list-backups <server> | grep FAILED | awk '{print $2;}'
```

Una vez identificados, podemos eliminarlos con el siguiente comando.

```bash
for bad in $(barman list-backups <server> | grep FAILED | awk '{print $2;}'); do \
barman delete <server> $bad \
done
```

Esto eliminará **todos** los backups fallidos de dicho servidor.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
