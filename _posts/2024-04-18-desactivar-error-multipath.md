---
layout: post
title: Desactivar error multipath Ubuntu
date: 2024-04-18 08:00:00 +0000
description: Trabajando con algún servidor Ubuntu, ya sea la versión 20.04 o 22.04, me he fijado que en los logs suele dar un error relacionado con multipath.
img: /assets/img/linux-logo.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, ubuntu]
categories: [linux, ubuntu]
---

Trabajando con algún servidor Ubuntu, ya sea la versión 20.04 o 22.04, me he fijado que en los logs suele dar un error relacionado con multipath.

A mi por lo menos me molesta mucho a la hora de tratar con el fichero `/var/log/syslog`, porque llena el log de líneas que te distraen, por lo que en este post veremos cómo quitar dichos mensajes.

Lo primero que haremos es editar el fichero `/etc/multipath.conf` y dejaremos el fichero de la siguiente forma:

```conf
defaults {
    user_friendly_names yes
}

blacklist {
    devnode "^(ram|raw|loop|fd|md|dm-|sr|scd|st)[0-9]*"
    devnode "^sd[a-z]?[0-9]*"
}
```

Donde en el segundo `devnode` pondremos `sd[...]` si corresponde con el nombre de nuestro disco, si tenemos otro, ponemos el que nos muestre el comando `lsblk`.

Después de esto reiniciamos el servicio de multipath con `sudo systemctl restart multipath-tools` para aplicar los cambios que hemos hecho.

Con todo esto, ya dejarán de salir esos dichosos mensajes.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
