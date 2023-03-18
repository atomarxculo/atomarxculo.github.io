---
layout: post
title: Configurar Catalina.out en Tomcat9
date: 2023-03-11 09:30:00 +0000
description: Por defecto, Tomcat 9 crea dicho fichero con la fecha al final del nombre (catalina.2022-08-30.log)
img: tomcat-server.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, tomcat]
---

Por defecto, Tomcat 9 crea dicho fichero con la fecha al final del nombre (catalina.2022-08-30.log). Para que cree un único fichero catalina.out hay que modificar el fichero /lib/systemd/system/tomcat9.service (si lo hemos instalado por repositorio) añadiendo las siguientes líneas al final del mismo.

```conf
# Logging

StandardOutput=append:/var/log/tomcat9/catalina.out
StandardError=append:/var/log/tomcat9/catalina.out
```

Una vez hecho esto, ejecutamos `systemctl daemon-reload` para que coja los cambios al haber modificado el fichero del servicio y aunque a veces no es necesario porque lo hace automatico, reiniciar el servicio de Tomcat9 con `systemctl restart tomcat9`.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
