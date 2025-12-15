---
layout: post
title: Utilizar jekyll en Docker
date: 2023-01-22 20:55:00 +0200
description: Para hacer esta web, utilicé Jekyll, un generador de sitios web estáticos que permite crear cada página web a partir de un fichero Markdown.
img: /assets/img/jekyll-logo.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [docker, jekyll]
categories: [docker, jekyll]
---

Para hacer esta web, utilicé Jekyll, un generador de sitios web estáticos que permite crear cada página web a partir de un fichero Markdown. Para que sea mucho más cómodo utilizarlo, usaremos Docker para que sea sólo usar un contenedor y no tener que instalar más cosas en nuestros equipos.

## Crear sitio web

Ejecutaremos el siguiente comando para que Docker cree el contenedor y ejecute dentro del mismo el comando que utiliza Jekyll para generar lo que vendrá a ser nuestro blog.

```bash
export blog_name="blog-test"
docker run --rm --volume "$PWD:/srv/jekyll" -it jekyll/jekyll jekyll new $blog_name && cd $blog_name
```

> El parámetro `--rm` indica que una vez se ejecuta el contenedor, tiene que eliminarlo. Con `-it` permite generar una pseudo-terminal, lo que posibilita ejecutar comandos mientras el contenedor se ejecuta.

Nos habrá creado la siguiente estructura de directorios.

```bash
blog-test
    ├── 404.html
    ├── about.markdown
    ├── _config.yml
    ├── Gemfile
    ├── index.markdown
    └── _posts
        └── 2023-01-22-welcome-to-jekyll.markdown
```

## Construir sitio web

Con esto ya habremos creado nuestro blog, ahora queda construirlo para que Jekyll genere los ficheros necesarios para una vez levantemos el servidor, podamos ver la página como queremos, con sus imágenes y su CSS.

Para ello, tendremos que ejecutar el siguiente comando.

```bash
docker run --rm --volume "$PWD:/srv/jekyll" -it jekyll/jekyll jekyll build
```

Esto habrá generado una carpeta llamada `_site` dentro de nuestro directorio, por lo que ya podremos levantar nuestro servidor para comprobar que funciona correctamente.

## Levantar servidor web

> Quizás os dé fallo la primera vez que arranque el servidor, para solucionarlo sólo habrá que agregar la siguiente línea en el fichero `Gemfile`: `gem "webrick"`

Así levantaremos el servidor web para ver la página.

```bash
docker run --rm --name blog --volume "$PWD:/srv/jekyll" -p 4000:4000 -it jekyll/jekyll jekyll serve
```

Para mostrarla, tendremos que abrir en el navegador la siguiente dirección, <http://localhost:4000>. Mientras el servidor esté arrancado, cada vez que hagamos un cambio en los ficheros, con actualizar la página del navegador valdrá para ver el cambio.

Para acabar con el contenedor, valdrá con pulsar `ctrl-c` para que termine el proceso. Cada vez que queremos levantar el servidor, con volver a ejecutar el anterior comando, lo tendremos listo.

Con esto acaba el post, he utilizado Docker para trabajar con Jekyll porque probé en su día instalarlo directamente en el equipo y el problema de dependencias o al tener que cambiar de un equipo a otro es horrible, por lo que con estos nos ahorraremos muchos quebraderos de cabeza.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
