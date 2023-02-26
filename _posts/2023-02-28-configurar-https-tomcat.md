---
layout: post
title: Configurar HTTPS en Tomcat
date: 2023-02-28 16:30:00 +0200
description: En el articulo anterior hablé de un error al intentar arrancar Tomcat9 y caí en que podría hablar de cómo configurar HTTPS en este servicio.
img: tomcat-server.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, tomcat, blog]
---

En el articulo anterior hablé de un error al intentar arrancar Tomcat9 y caí en que podría hablar de cómo configurar HTTPS en este servicio. Usaremos certificados PEM, en vez de JKS, ya que pienso que es más comodo al no tener que generar dicho fichero para esto y que la contraseña se tiene que dejar en el fichero de configuración en texto plano.

## Configuración

Para que Tomcat trabaje con HTTPS, en este caso utilizando el puerto 8443, hay que realizar la siguiente configuración, tanto a nivel de los ficheros de Tomcat, como los permisos minimos que hay que configurar en los certificados.

Hay que descomentar y configurar la ruta de los certificados del siguiente bloque de código que se encuentra en `/etc/tomcat/server.xml`. En este caso, hemos predefinido que esa sea la ruta donde se almacenen los certificados. En el propio certificado vienen incluido el CA Root y CA Intermedio.

```conf
<Connector port="8443" protocol="org.apache.coyote.http11.Http11AprProtocol"  
               maxThreads="150" SSLEnabled="true">  
        <UpgradeProtocol className="org.apache.coyote.http2.Http2Protocol" />  
        <SSLHostConfig>  
            <Certificate certificateKeyFile="/etc/pki/tls/private/private_key.key"  
                         certificateFile="/etc/pki/tls/certs/certificate.chained.crt"  
                         type="RSA" />  
        </SSLHostConfig>  
</Connector> 
```

Los certificados tienen que tener ciertos permisos para que Tomcat pueda trabajar con ellos, pero que no sea accesible para cualquiera.
- La clave pública puede tener permisos 644 y que el propietario sea root.
- La clave privada tenemos que ponerle permisos 400 tanto al usuario root como al usuario tomcat. Para configurar que otro usuario tenga permisos sobre un fichero, podemos configurarlo con el comando `sudo setfacl -m u:tomcat:4 private_key.key`

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
