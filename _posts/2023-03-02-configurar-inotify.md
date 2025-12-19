---
layout: post
title: Configurar inotify
date: 2023-03-02 09:30:00 +0000
description: Inotify es un watcher que vigila un directorio y cuando detecta un evento que nosotros definamos, como que llegue un fichero nuevo (o movido en él) ejecuta una acción.
image: /assets/img/sysadmin.jpg # Add image post (optional)
tags: [linux]
categories: [linux]
---

Inotify es un watcher que vigila un directorio y cuando detecta un evento que nosotros definamos, como que llegue un fichero nuevo (o movido en él) ejecuta una acción. Esto resulta muy útil si queremos que un proceso se ejecute al momento en vez de esperar a cierta hora para que eso se produzca.

## Ejemplo de configuración

```bash
#!/bin/bash
source /etc/scripts/.variables
inotifywait -m /home/test/in -e close_write -e moved_to |
    while read directory action file; do
        if [[ "$file" == *.csv ]]; then
            curl -X POST -u usuario:$TOKEN_EJEC https://jenkins.samurantech.com:8443/job/batch-procesa-ficheros/buildWithParameters?token=$TOKEN_EJEC -F fileInPath=/in/$file
        fi
    done
```

El inotify se queda escuchando en el directorio `home/test/in` a la espera de un nuevo fichero y cuando termina de copiarse uno con la extensión indicada, en este caso .csv, llama al job de Jenkins que hayamos definido (los próximos artículos meteremos mano a Jenkins), pasándole como parámetro la ruta y el nombre del fichero. Se le pasa también como variables el token para la ejecución del job en un fichero externo, el cual se guarda en el fichero `/etc/scripts/.variables`

Vamos a guardar el script anterior en un fichero, darle permisos de ejecución con `chmod +x <fichero_script>.sh` y crearemos un servicio para que se quede ejecutando en segundo plano y arranque junto al sistema.

## Creación fichero servicio

Creamos un fichero en `/etc/systemd/system/` con el nombre que queramos terminado en `.service`, en mi caso `batch-procesa-ficheros.service`.

```conf
[Unit]
Description=Batch procesa ficheros
After=network.target

[Service]
ExecStart=/var/opt/scripts/batch-procesa-ficheros.sh

[Install]
WantedBy=default.target
```

Ejecutamos los siguientes comandos para recargar el daemon de Linux y habilitar el servicio creado, además de arrancarlo en el mismo comando.

```bash
systemctl daemon-reload && systemctl enable batch-procesa-ficheros --now
```

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
