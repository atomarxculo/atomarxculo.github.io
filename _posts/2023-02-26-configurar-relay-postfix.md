---
layout: post
title: Configurar relay Postfix
date: 2023-02-26 18:50:00 +0200
description: En ocasiones nos interesa que nuestro servidor de correo Postfix utilice un SMTP relay para mandar los emails por otro lado.
img: sysadmin.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux]
---

En ocasiones nos interesa que nuestro servidor de correo Postfix utilice un [SMTP relay](https://www.ionos.es/digitalguide/correo-electronico/cuestiones-tecnicas/smtp-relay/#c184170) para mandar los emails por otro lado, ya sea por motivos de seguridad o por casos temporales como puede ser en mi caso porque Apple se puso tonto y metían cada dos por tres a mis dominios en sus blacklists.


## Configuración

Esta configuración es para que los correos de ciertos dominios, _icloud.com_ y _me.com_, sean mandados por el relay de gmail.

En el fichero `/etc/postfix/main.cf` hay que agregar la siguiente línea.

```conf
transport_maps = hash:/etc/postfix/bysender
```

En el fichero mencionado, `/etc/postfix/bysender` agregamos los dominios que queremos que se mande por el relay de la siguiente manera:

```conf
icloud.com      smtp:[smtp-relay.gmail.com]:25
me.com          smtp:[smtp-relay.gmail.com]:25
```

Ejecutamos el siguiente comando para que Postfix cree el fichero correspondiente y posteriormente, recargarmos el servicio.

```bash
postmap /etc/postfix/bysender
systemctl reload postfix
```

Con esto, cada vez que un correo de los dominios configurados, se mandarán por el relay definido. En este caso, hay que tener ciertas consideraciones con el relay de Gmail, como el limite de correos que se pueden mandar. [Info](https://support.google.com/a/answer/2956491?hl=es-419#zippy=%2Crevisa-los-l%C3%ADmites-de-env%C3%ADo-del-servicio-de-relay-smtp)

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
