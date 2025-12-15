---
layout: post
title: Configurar IP estática en CentOS
date: 2021-02-22 11:15:00 +0200
description: En el post anterior instalamos CentOS en nuestra Raspberry, hoy la configuraremos para poder darle uso. # Add post description (optional)
img: /assets/img/centos-logo.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [centos, raspberry pi]
categories: [centos, raspberry pi]
---

En el [post anterior][centosraspberry] instalamos CentOS en nuestra Raspberry, hoy la configuraremos para poder darle uso.

Normalmente los equipos obtienen su dirección IP a través del protocolo [DHCP (Dynamic Network Configuration Protocol)][dhcplink], un servicio que proporciona una IP dinámica, además de la máscara de subred, la puerta de enlace y los DNS a los equipos de la red. En redes domésticas quien cumple esta función suele ser el router que nos proporciona nuestro proveedor de internet.

Pero en entornos profesionales, o como es en nuestro caso, no queremos que nuestro servidor tenga un IP que le haya proporcionado el DHCP y que pueda cambiar. Para ello se configura un IP estática o manual y tener bajo control la IP de ese servidor.

## Conectarnos al servidor

Podemos acceder al servidor conectando una pantalla y un teclado directamente a la Raspberry Pi y trabajar directamente ahí o podemos conectarnos por SSH.

Para poder conectarnos por SSH, tendremos que averiguar su IP. Podemos saber esto yendo al DHCP del router o hacer un escaneo de red con herramientas como [Advanced IP Scanner][ipscanner].

Una vez averiguada la IP, podemos conectarnos por SSH utilizando [Putty][puttylink] o [MobaXterm][mobalink], eso os lo dejo al gusto de cada uno. Ponemos la IP del servidor y le ponemos las credenciales, que será el usuario `root` y la contraseña que hayamos definido.

## Configurar la IP estática

Está va a ser la configuración que yo voy a hacer en mi servidor.

> Dirección IP: 192.168.0.150  
> Subred: 255.255.255.0  
> Puerta de enlace (Router): 192.168.0.1  
> Servidor DNS 1: 192.168.0.1  
> Servidor DNS 2: 1.1.1.1

### Averiguar interfaces de red en nuestro servidor

Puedes saber las interfaces que tiene el servidor ejecutando el comando:

```bash
ifconfig -a
```

O

```bash
ip a
```

El resultado del comando será parecido a lo que muestro a continuación. En mi caso quiero cambiar la IP a la interfaz `eth0`, que es la interfaz cableada.  
`lo` es la interfaz de *loopback*, donde está configurado la IP *127.0.0.1* o localhost.  
`wlan0` es la interfaz de conexión inalámbrica, para ir por Wi-FI.

```conf
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether dc:a6:32:a3:a8:b4 brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.24/24 brd 192.168.0.255 scope global noprefixroute dynamic eth0
       valid_lft 2733sec preferred_lft 2733sec
    inet6 fe80::806d:e80d:c6fb:69d6/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
3: wlan0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc pfifo_fast state DOWN group default qlen 1000
    link/ether 62:c3:19:db:2a:2c brd ff:ff:ff:ff:ff:ff
```

### Configuración IP estática

* Método 1

Para este método, editaremos el fichero de la interfaz de red que se encuentra en el directorio `/etc/sysconfig/network-scripts`. Para la interfaz `eth0`, crearemos el fichero `ifcfg-eth0`.

```bash
vi /etc/sysconfig/network-scripts/ifcfg-eth0
```

El contenido que tenemos que poner en el fichero.

```conf
# MAC de la interfaz #
HWADDR=dc:a6:32:a3:a8:b4
TYPE=Ethernet
BOOTPROTO=none
# IP estática #
IPADDR=192.168.0.150
# Subred #
NETMASK=255.255.255.0
# Puerta de enlace #
GATEWAY=192.168.0.1
# Servidores DNS #
DNS1=192.168.0.1
DNS2=1.1.1.1
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
# Deshabilitar ipv6 #
IPV6INIT=no
# Nombre de la interfaz #
NAME=eth0
DEVICE=eth0
# Activar la interfaz en el arranque #
ONBOOT=yes
```

* Método 2

También podemos usar `nmtui`, una interfaz de usuario en texto para configurar interfaces de red.

> En caso de no tenerlo instalado, podemos obtenerlo con el comando `yum install NetworkManager-tui`

```bash
nmtui
```

Seleccionamos **Edit a connection** y presionamos **Enter**.

![Edit a connection][nmtui01]  

**Elegimos la interfaz de red** y **Edit**

![Elegir una interfaz de red][nmtui02]

**Configuramos la IP** y le damos a **OK**

![Configurar IP][nmtui03]

### Reiniciamos la red

Finalmente, reiniciamos el servicio de red para que se hagan efectivo los cambios que hemos hecho. Cuando hagamos esto no echará de la sesión porque se ha cambiado de IP.

```bash
systemctl restart network
```

Volvemos a ejecutar el comando `ip a` para comprobar que el cambio se ha hecho efectivo.

### Tip final. Cambiar hostname

Ya que hemos configurado la IP del servidor, vamos a cambiar también el nombre del mismo por alguno más descriptivo y porque personalmente no me gusta que los servidores se llamen *localhost*.

Aprovechando que hemos trabajado con `nmtui`, haremos el cambio desde ahí.

Seleccionamos **Set system hostname** y presionamos **Enter**.

![Cambiar hostname][nmtui04]

Ahí ponemos el nombre que queramos que tenga el servidor y presionamos **OK**.

La gente que quiera hacerlo por comando, tiene a su disposición `hostnamectl`.

Para cambiar el nombre sería de la siguiente manera:

```bash
hostnamectl set-hostname "<nombre_servidor>"
```

Para que se efectúen los cambios podemos bien reiniciar el servidor o el servicio `systemctl restart systemd-hostnamed`. Para comprobar que el cambio se ha hecho con `hostname` podremos confirmar que es así.  
Para el nombre que aparece en la terminal `[root@localhost ~]#`, con salir de la sesión SSH y volver a conectarnos ya nos aparecerá.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!

[centosraspberry]: https://www.samurantech.com/instalar-centos-raspberry-pi/
[dhcplink]: https://es.wikipedia.org/wiki/Protocolo_de_configuraci%C3%B3n_din%C3%A1mica_de_host
[ipscanner]: https://www.advanced-ip-scanner.com/es/
[puttylink]: https://www.putty.org/
[mobalink]: https://mobaxterm.mobatek.net/download.html
[nmtui01]: {{site.baseurl}}/assets/img/posts/nmtui-01.png "Edit a connection"
[nmtui02]: {{site.baseurl}}/assets/img/posts/nmtui-02.png "Elegir una interfaz de red"
[nmtui03]: {{site.baseurl}}/assets/img/posts/nmtui-03.png "Configurar IP"
[nmtui04]: {{site.baseurl}}/assets/img/posts/nmtui-04.png "Cambiar hostname"
