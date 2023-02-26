---
layout: post
title: Tomcat9 no inicia al reiniciar el servidor
date: 2023-02-27 16:30:00 +0200
description: Donde trabajo estamos migrando los servidores con Tomcat 8 a Tomcat 9 y al reiniciar el servidor por completo, nos encontramos con esto.
img: tomcat-server.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [ubuntu, tomcat, blog]
---

Donde trabajo estamos migrando los servidores con Tomcat 8 a Tomcat 9 y al reiniciar el servidor por completo, nos encontramos con esto, que el servicio no se levanta automaticamente, pero si lo inicias mediante un `systemctl restart tomcat9`, levanta sin problemas. Para dar más detalles, esto me ocurrió en Ubuntu, con la versión de Tomcat 9 instalada por repositorio.


## Solución

El fallo da porque hay que configurar en el fichero del servicio `/lib/systemd/system/tomcat9.service` el siguiente parametro: `ReadWritePaths=/usr/libexec/tomcat9`. Recargamos el daemon para que tome los cambios que hemos realizado en el servicio y a la próxima no vuelva a ocurrir. Esto ocurre porque hay que permitir que pueda leer de esa ruta, donde se encuentra varios scripts para arrancar tomcat9 con el sistema.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
