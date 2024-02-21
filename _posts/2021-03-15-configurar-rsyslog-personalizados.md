---
layout: post
title: Recolectar cualquier logs con Rsyslog
date: 2021-03-15 20:35:00 +0200
description: En esta ocasión, vamos a configurar Rsyslog para que recolecte cualquier log que le indiquemos. # Add post description (optional)
img: rsyslog-logo.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [rsyslog, linux]
---

En esta ocasión, vamos a configurar Rsyslog para que recolecte cualquier log que le indiquemos. Esto es muy útil si tenemos un aplicación propia que genere logs o cualquier otra aplicación como puede ser Tomcat, por ejemplo, además de ser fácil de implementar (una vez te has peleado con ello).

## Fichero configuración

Vamos a crear el fichero de configuración necesario en el cliente para que mande los logs al servidor central. El servidor central debe estar configurado como indicamos en [este post][rsyslog].  
Una vez hecho eso, vamos al grano.

Antes de crear el fichero, tenemos que crear el directorio de trabajo para rsyslog, en este caso `/var/spool/rsyslog`. El comando para ello es:  
`mkdir /var/spool/rsyslog`

Creamos un fichero llamado `<aplicación>.conf`, podéis ponerle el nombre que queráis, dentro de `/etc/rsyslog.d/` con el siguiente contenido:

```conf
$ModLoad imfile
$InputFilePollInterval 10
$WorkDirectory /var/spool/rsyslog

$template Rfc5424Format,"<%PRI%>1 %TIMESTAMP:::date-rfc3339% %HOSTNAME% %APP-NAME% %PROCID% %MSGID% %STRUCTURED-DATA% %msg%"

$InputFileName </ruta/fichero>
$InputFileTag <aplicación>-log
$InputFileStateFile stat-<aplicación>-log
$InputFileSeverity info
$InputFilePersistStateInterval 20000
$InputRunFileMonitor
if $programname == '<aplicación>-log' then @@<ip_servidor>:514;Rfc5424Format
if $programname == '<aplicación>-log' then stop
```

A primera vista esto asusta un poco, pero vamos a ir desglosando que función tiene cada línea del fichero.

Los siguientes parámetros son globales.

* `$ModLoad imfile` carga el módulo de rsyslog. Lee línea a línea el fichero que le pasemos como parámetro.
* `$InputFilePollInterval` especifica la frecuencia con la que comprueba los archivos para obtener nuevos datos.
* `$WorkDirectory` el directorio de trabajo de rsyslog. Aquí se guardan los llamados _state file_, que contienen temporalmente los nuevos datos que se recogen para ser enviados.

* `$template` el formato en el que se van a mandar los logs al servidor. Esta parte es muy importante, porque probando distintos formatos, me ha llegado a crear un fichero por cada línea que se recogía en el fichero.

Estos parámetros son específicos para el archivo con que vamos a trabajar.

* `$InputFileName` el fichero que queremos que recolecte la información y envíe.
* `$InputFileTag` el nombre del fichero que se creará en el servidor y donde se mandará la información.
* `$InputFileStateFile` el nombre de los _state files_ mencionados antes.
* `$InputFileSeverity` la severidad que se le asigna a las líneas que lee.
* `$InputFilePersistStateInterval` especifica la frecuencia con la que se escribirá el archivo de estado al procesar el archivo de entrada. Esta configuración se puede utilizar para evitar duplicidad de mensajes por errores como un corte de energía.
* `$InputRunFileMonitor` activa que se monitorice el fichero.

Las dos últimas 2 líneas indican que si les llega una petición de tratar el fichero con el tag indicado, lo manden a un servidor por TCP (2 @ indica TCP, 1 @ por UDP) aplicando el formato que hemos definido.

**IMPORTANTE.** Si estáis trabajando con CentOS y tenéis el SELinux activado, tenéis que cambiar el tipo del fichero por `var_log_t` con el comando:  

`chcon -t var_log_t <fichero>`

Tenéis que tener en cuenta que si la carpeta se encuentra fuera de `/var/log` también tenéis que cambiarle el tipo a dicha carpeta, porque si no rsyslog no podrá acceder a ella.

Puedes jugar bastante con Rsyslog y todas las posibilidades que te ofrece, facilitando mucho el trabajo cuando tienes que revisar muchos logs de distintos servidores.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!

[rsyslog]: https://www.samurantech.com/configurar-rsyslog-central-linux/
