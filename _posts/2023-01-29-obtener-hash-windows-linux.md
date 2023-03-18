---
layout: post
title: Obtener hash de un fichero (Windows/Linux)
date: 2023-01-29 19:55:00 +0200
description: Una cosa muy importante a tener en cuenta cuando descargamos un fichero de internet, es asegurar su integridad.
img: sysadmin.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [windows, linux]
---

Una cosa muy importante a tener en cuenta cuando descargamos un fichero de internet, es asegurar su integridad, que los datos no hayan sido modificados sin autorización en dicho proceso. Para ello, lo recomendable es comprobar el [hash](https://cau.sci.uma.es/faq/index.php?solution_id=1181) del mismo de las siguientes formas, ya sea para Windows o Linux. También es recomendable comprobar el hash cuando se copia un fichero de un equipo a otro, ya que si hay algún corte en la comunicación, el fichero se queda corrupto.

## Windows

Para empezar, nos iremos al **Explorador de archivos** en Windows 10 y a la ruta donde se encuentre el fichero que queramos comprobar. En la barra de direcciones, escribiremos **powershell** para abrirlo.

![explorador](..\assets\img\posts\powershell.png)

Ejecutamos el siguiente comando y así obtendremos el hash del fichero, en este caso en _SHA256_, donde <fichero> es el fichero que queremos comprobar.

```powershell
Get-FileHash -Algorithm SHA256 <fichero>
```

Normalmente en las webs te suele venir una sección donde te muestre el hash o un fichero con él.

## Linux

En Linux tenemos que ir al directorio donde se encuentra el fichero y ejecutamos lo siguiente.

```bash
sha256sum <fichero>
```

Aunque sea un proceso sencillo, hay que tomar la costumbre de comprobar el hash de los ficheros para que no nos cuelen un fichero malicioso o nos volvamos locos intentando instalar un componente y no podamos porque el fichero se haya quedado corrupto por quedarse a medio copiar (cosa que me ha pasado en más de una ocasión).

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
