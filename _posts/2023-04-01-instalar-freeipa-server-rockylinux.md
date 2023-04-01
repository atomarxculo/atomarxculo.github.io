---
layout: post
title: Instalar FreeIPA Server en Rocky Linux 9
date: 2023-04-01 08:00:00 +0000
description: Para que nos entendamos con FreeIPA, es como el Active Directory de Windows, pero desde mi punto de vista, mejor porque es en Linux.
img: freeipa-logo.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, rocky]
---

Para que nos entendamos con FreeIPA, es como el Active Directory de Windows, pero desde mi punto de vista, mejor porque es en Linux. Con este servicio podremos centralizar la autenticación y autorización a los servidores de nuestra infraestructura, además de poder gestionar certificados, claves SSH (aunque esté incluido en lo que he comentado en lo de autenticación/autorización), poder hacer que se automonte particiones en los servidores, DNS, etcétera... Vamos que vale para muchas cosas que ya iremos viendo.

He elegido [Rocky Linux 9][rockylinux] por dos motivos, para Ubuntu sólo hay hasta la versión 18.04 y porque este es el sucesor espiritual de CentOS.

## Prerequisitos

Primero que todo vamos a actualizar los repositorios y paquetes del servidor que hayamos desplegado para ello con el siguiente comando:
```bash
sudo dnf update -y
```

Ahora vamos a asegurarnos que la fecha y la hora está bien, además de configurar el nombre del servidor, que tenga una [IP estática][ipestatica]. En el ejemplo he puesto los datos de mi servidor, pero vosotros tendréis que cambiar la IP y el nombre para que corresponda con el vuestro.
```bash
# Cambiar la zona horaria
sudo timedatectl set-timezone Europe/Madrid

# Cambiar el nombre del host añadiendo el nombre del dominio
sudo hostnamectl set-hostname freeipa-server1.samurantech.local
sudo sh -c 'echo "192.168.122.11 freeipa-server1.samurantech.local freeipa-server1" >> /etc/hosts'

# Comprobar que los cambios anteriores se hayan efectuado
timedatectl && hostnamectl
```

Si en el fichero `/etc/hosts` hay alguna referencia al servidor con la IP `127.0.1.1` o con IPv6, yo recomiendo eliminarlo para que no dé problemas.

## Instalación FreeIPA Server

Ahora sí que vamos a empezar con la instalación como tal, por lo que tendremos que ejecutar el siguiente comando para que instale los paquetes necesarios, el servidor, los DNS y el cliente de FreeIPA.

```bash
sudo dnf install freeipa-server freeipa-server-dns freeipa-client -y
```

Una vez terminado, vamos a configurarlo.

## Configuración FreeIPA Server

Para instalarlo podríamos simplemente ejecutar el comando `ipa-server-install` e ir rellenando los datos que nos vayan pidiendo, pero para hacerlo más cómodo vamos a ponerle los siguientes parametros para que lo configure de una sola vez.
```bash
sudo ipa-server-install --ip-address=192.168.122.11 \
--realm SAMURANTECH.LOCAL \
--ds-password=DS_PASS \
--admin-password=ADMIN_PASS \
--setup-dns \
--auto-reverse \
--forwarder 8.8.8.8 \
--unattended
```

Ahora os explicaré que significa cada parametro:
 - `--ip-address` Selecciona la IP por dónde queremos que el servidor levante los servicios, si tienes varias IPs en un mismo servidor como es mi caso, es mejor especificar.
 - `--realm ` Cómo queremos que se llame nuestro dominio de Kerberos, lo recomiendo poner en mayúsculas.
 - `--ds-password` La contraseña del Directory Server para el usuario del Directory Manager. Tiene que tener un mínimo de 8 caracteres.
 - `--admin-password` La contraseña del usuario administrador. Tiene que tener un mínimo de 8 caracteres.
 - `--setup-dns` Para configurar el servidor DNS según hace la configuración.
 - `--auto-reverse` Para que cree automáticamente la zona reversa DNS con sus registros PTR.
 - `--forwarder` Configurar el reenviador DNS.
 - `--unattended` Para que no tenga que pedirnos interactuar con la instalación, que lo haga automáticamente.

Añadir que se puede configurar un CA externo, pero si no se especifica, FreeIPA crea uno propio.

> Si os da un error con IPv6 como fue mi caso, tenemos que añadir/modificar en el fichero `/etc/sysctl.conf` la línea `net.ipv6.conf.all.disable_ipv6 = 0` (si veis un 1, hay que poner un 0) y ejecutar `sudo sysctl -p` para que aplique los cambios sin tener que reiniciar el servidor.

Si tenemos firewalld ejecutándose en nuestro sistema, tendremos que abrir los puertos necesarios para poder acceder:
```bash
sudo firewall-cmd --add-service=freeipa-4 --permanent
sudo firewall-cmd --reload
```

El servicio `freeipa-4` tiene incluido todos los puertos necesarios como HTTPS, LDAP, LDAPS, Kerberos y Kpasswd (Para más información, puedes mirarlo en `/usr/lib/firewalld/services/freeipa-4.xml`)

## Comprobar que el servicio funciona

Verificamos que los servicios de IPA están corriendo:
```bash
[samuel@freeipa-server1 ~]$ sudo ipactl status
Directory Service: RUNNING
krb5kdc Service: RUNNING
kadmin Service: RUNNING
named Service: RUNNING
httpd Service: RUNNING
ipa-custodia Service: RUNNING
pki-tomcatd Service: RUNNING
ipa-otpd Service: RUNNING
ipa-dnskeysyncd Service: RUNNING
ipa: INFO: The ipactl command was successful
```

También podemos conectarnos por https para acceder a su interfaz web, en mi caso <https://freeipa-server1.samurantech.local/ipa/ui/>

En los siguientes posts veremos cómo crear usuarios desde la web, cómo añadir un cliente al nuestro dominio y crear un segundo servidor para que haya replicación maestro-maestro, entre otros.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!

[rockylinux]: https://rockylinux.org/
[ipestatica]: https://samurantech.com/configurar-ip-estatica-centos/
