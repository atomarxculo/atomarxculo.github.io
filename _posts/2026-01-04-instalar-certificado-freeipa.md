---
title: Instalar/renovar certificado en FreeIPA para HTTPS y LDAP
date: 2026-01-04 17:25:00 +0100
description: En este post veremos cómo podemos instalar un certificado externo en nuestro servidor FreeIPA para no utilizar el autofirmado que genera por defecto.
image: /assets/img/freeipa-logo.png # Add image post (optional)
tags: [linux, freeipa]
categories: [linux, freeipa]
---

En este post veremos cómo podemos instalar un certificado externo en nuestro servidor FreeIPA para no utilizar el autofirmado que genera por defecto.

Vamos a instalarlo tanto para que se muestre en la web como para el servicio de LDAP y para ello, tenemos que realizar los siguientes pasos.

**_Disclamer:_** Estoy dando por hecho que ya tenemos un certificado con una CA válida para poder hacer todo esto. El fichero con la clave pública también tiene que tener la CA en ese mismo fichero, no vale tenerlo en un fichero aparte.

## Instalación del certificado

Para poder instalar el certificado tenemos que ejecutar el siguiente comando, indicando que la instalación será para HTTP y el servicio de directorio activo.

```bash
ipa-server-certinstall --http --dirsrv <certificado> <key>
```

Cuando le demos Enter nos pedirá la contraseña del Directory Manager y la clave de la private key en caso de que esta tuviese alguna.

## Aplicamos la configuración

Una vez hecho esto, reiniciamos los servicios.

```bash
ipactl restart
systemctl restart httpd.service
systemctl restart dirsrv@<nombre_dominio>.service
```

Donde `<nombre_dominio>` se puede sacar del directorio `/etc/dirsrv/slapd-*` teniendo el formato **SAMURANTECH-COM**.

## Comprobamos los servicios 

Con los siguientes comandos veremos si los cambios se ha realizado correctamente.

```bash
certutil -L -d /etc/httpd/alias
certutil -L -d /etc/dirsrv/slapd-<nombre_dominio>
```

Nos tendrá que aparecer que el certificado que usa es el que hemos instalado al principio.

Con esto ya tendremos todo instalado y configurado para que nuestro servidor de FreeIPA utilice un certificado externo, haciendo que cuando nos conectemos por HTTPS no aparezca que usa uno autofirmado.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
