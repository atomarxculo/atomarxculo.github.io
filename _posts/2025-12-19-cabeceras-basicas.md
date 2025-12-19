---
title: Cabeceras básicas Nginx
date: 2025-12-19 18:33:00 +0100
description: A la hora de configurar un nuevo dominio/subdominio, es conveniente que tenga la siguiente configuración a nivel de cabeceras para reforzar la seguridad del sitio web.
image: /assets/img/nginx-logo.svg # Add image post (optional)
tags: [nginx]
categories: [nginx]
---

A la hora de configurar un nuevo dominio/subdominio, es conveniente que tenga la siguiente configuración a nivel de cabeceras para reforzar la seguridad del sitio web.

En este post, vamos añadir varias cabeceras a nuestro servidor Nginx para agregar más seguridad, además de una breve explicación de para qué vale cada cabecera.

## Configuración básica

Esta configuración puede ir en los bloques de configuración de nginx de `http`, `server` y `location`.

```bash
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Permissions-Policy "geolocation=self" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

> La opción `always` es para que las cabeceras se envíen incluso en respuestas de error (como 404 o 500).

## Explicación de cada cabecera

- `X-Frame-Options "SAMEORIGIN"`: Evita que la web sea cargada dentro de un `<iframe>` de otro dominio, protegiendonos contra el **clickjacking** (que cliquemos algo que no veamos).
- `X-Content-Type-Options "nosniff"`: Evita que JS se ejecute donde sólo debería haber texto o imágenes.
- `X-XSS-Protection "1; mode=block"`: Este es útil para navegadores antiguos, donde si detecta un ataque XSS (una vulnerabilidad donde el ataque inyecta código malicioso en web légitimas), bloquea la página.
- `Permissions-Policy "geolocation=self"`: Sólo permitimos que nuestro propio sitio pueda pedir la ubicación del usuario, evitando que lo hagan scripts o iframes externos.
- `Strict-Transport-Security "max-age=31536000; includeSubDomains"`: Fuerza que siempre se use **HTTPS**, aunque el usuario escriba http.
- `Referrer-Policy "strict-origin-when-cross-origin"`: Controla información que se envía en la cabecera `Referer`, indicando a otros dominios el dominio de dónde viene la petición, no la URL completa.

## Comprobación del nivel de seguridad

Para comprobar si estas cabeceras se ha aplicado y nos aparezca un puntuaje de lo protegida que tenemos la web,  utilizaremos la web <https://securityheaders.com/>. Aparte te mostrará abajo valores recomendados que debes agregar a tu web (las cuales son las que vienen más arriba)

Esta sería una web que no cuenta con seguridad (es un ejemplo):

![alt text](../assets/img/posts/nginx-cabeceras-inseguras.png)

Esta sería una web que cuenta con seguridad:

![alt text](../assets/img/posts/nginx-cabeceras-seguras.png)

## Cabecera `Content-Security-Policy`

Esta cabecera no está incluida en este post, ya que requiere una configuración específica que hay que adaptar a cada dominio al que hay que agregarlo.

Esta cabecera ofrece una capa de protección adicional contra ataques como *Cross-Site Scripting (XSS)* o *data injection*.
