---
layout: post
title: Habilitar logs en Rsyslog server
date: 2023-01-22 11:15:00 +0200
description: A veces rsyslog puede dar fallo, pero por defecto, estos logs no vienen habilitados, para ello tendremos que agregar estas líneas en el fichero de configuración `rsyslog.conf`
img: /assets/img/rsyslog-logo.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [rsyslog, linux]
---

A veces rsyslog puede dar fallo, pero por defecto, estos logs no vienen habilitados, para ello tendremos que agregar estas líneas en el fichero de configuración `rsyslog.conf`

```text
$DebugFile <nombre_fichero>
$DebugLevel <0|1|2>
```

Donde `<nombre_fichero>` es donde queremos que se guarden los logs, podemos poner tanto el nombre de un fichero como la ruta completa con el nombre del fichero.
Los niveles de `$DebugLevel` significan que 0 es desactivado, 1 habilitado el modo debug pero bajo demanda y 2 modo debug activado por completo. Este último tenemos que tener cuidado de no dejarlo activado si se reciben muchos logs, ya que llenará el disco duro en poco tiempo de la cantidad de información que escriben.

## Activar modo debug bajo demanda

Si tenemos el nivel 1, para que se escriban logs en el fichero que hemos indicado antes, tenemos que hacer lo siguiente.

* Parar el servicio de rsyslog con `systemctl stop rsyslog`
* En otra terminal en el mismo servidor, ejecutar `kill -USR1 $(cat /var/run/rsyslogd.pid)`

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
