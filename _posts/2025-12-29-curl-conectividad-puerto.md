---
title: Comprobar conectivad contra un puerto usando curl
date: 2025-12-29 18:25:00 +0100
description: Cuando queremos comprobar si hay conectividad contra un puerto, he visto a mucha gente seguir utilizando todavía telnet, llegando a instalarlo si no lo está.
image: /assets/img/linux-logo.png # Add image post (optional)
tags: [linux]
categories: [linux]
---

Cuando queremos comprobar si hay conectividad contra un puerto TCP, he visto a mucha gente seguir utilizando todavía telnet, llegando a instalarlo si no lo está. Esto me parece un poco una chapuza, cuando curl viene ya instalado por defecto en muchos sistemas operativos y cumple el mismo cometido.

Para poder comprobar si hay conectividad contra un puerto, sólo tendremos que ejecutar el siguiente comando:

```bash
curl -v telnet://google.es:80
```

Donde:
- con `-v` indicaremos que el comando sea verbose, que muestre información.
- `telnet` que sólo intente la conexión contra el puerto.
- `google.es` la dirección contra la que queremos comprobar si el puerto está abierto.
- `:80` el puerto en cuestión.

Si hay conexión nos mostrará el siguiente mensaje.

```bash
curl -v telnet://google.es:80   
* Host google.es:80 was resolved.
* IPv6: 2a00:1450:4003:80d::2003
* IPv4: 142.250.200.99
*   Trying 142.250.200.99:80...
* Connected to google.es (142.250.200.99) port 80
```

Para terminar el comando sólo tendremos que pulsar **Ctrl+C**, no como con telnet que te puedes volver loco.

Si el puerto en cuestión no estuviera abierto, el mensaje que nos saldría sería este.

```bash
curl -v telnet://192.168.1.1:81
*   Trying 192.168.1.1:81...
* connect to 192.168.1.1 port 81 from 192.168.1.57 port 33384 failed: Conexión rehusada
* Failed to connect to 192.168.1.1 port 81 after 2 ms: Couldn't connect to server
* Closing connection
curl: (7) Failed to connect to 192.168.1.1 port 81 after 2 ms: Couldn't connect to server
```

Con esto, ya habremos comprobado si tenemos conectividad contra el puerto que queramos. Si no tenemos conexión, sería conveniente revisar si el servidor está encendido, si el servicio que levanta ese puerto está en ejecución o si tenemos un firewall que bloqueé el acceso.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
