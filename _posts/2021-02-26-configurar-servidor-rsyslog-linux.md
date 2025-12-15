---
layout: post
title: Configurar servidor Rsyslog en Linux
date: 2021-02-22 11:15:00 +0200
description: Los logs es una parte muy importante en el día a día de nuestro trabajo como sysadmin, pero tener que revisar muchos de estos puede llegar a ser una locura. # Add post description (optional)
img: /assets/img/rsyslog-logo.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [linux, rsyslog]
categories: [linux, rsyslog]
---

Los logs, esos ficheros que recogen lo que sucede en nuestro sistema y sus aplicaciones, es una parte muy importante en el día a día de nuestro trabajo como sysadmin, pero tener que revisar muchos de estos puede llegar a ser una locura, más ahora que el número de servidores que tenemos que tener bajo control es cada vez más y más grande.

Algo más que recomendable es tener un servidor central que se encargue de recoger estos logs y poder acceder a ellos de forma más cómoda, que no tener que estar revisando uno a uno los servidores encontrando el dichoso fichero.

Por eso hoy os contaré la forma de configurar una forma centralizada de recogida de logs y que en caso de caída del servidor rsyslog, no perdamos ningún fichero guardándolos en el cliente en una cola que los mantenga hasta que sea necesario y enviarlos de nuevo.

## Instalar y configurar rsyslog server

Rsyslog es un paquete preinstalado en los sistemas Linux, pero en caso de no tenerlo instalado, podemos obtenerlo de la siguiente manera

```bash
yum update -y; yum install rsyslog -y # CentOS 7
apt update -y; apt install rsyslog -y # Ubuntu
```

Editamos el fichero `/etc/rsyslog.conf` para configurar que la máquina actúe como servidor.

Descomentamos las siguientes líneas para activar el protocolo UDP y el puerto 514, este último se puede cambiar por otro de nuestra elección.

```conf
$ModLoad imudp
$UDPServerRun 514
```

Para las conexiones TCP, debemos descomentar las siguientes líneas, e igual que el anterior, podemos poner un puerto a nuestra elección.

```conf
$ModLoad imudp
InputTCPServerRun 514
```

Configuramos una regla para que recoja todos los logs y los guarde en una carpeta con el nombre del host que se lo envía. Para tener una mejor organización y no trabajar sobre el fichero principal, crearemos un fichero `remotelogs.conf`, aunque se puede llamar como queramos siempre que acabe en `.conf` dentro de la carpeta `/etc/rsyslog.d/`

```conf
template(name="TmplLogRemoto" type="list") {
    constant(value="/var/log/rsyslog/")
    property(name="HOSTNAME")
    constant(value="/")
    property(name="programname" SecurePath="replace")
    constant(value=".log")
    }
*.* ?TmplLogRemoto
```

Lo que hemos hecho es definir que los logs se guarden en `/var/log/rsyslog`, después tiene que crear una carpeta con el nombre del host por cada cliente que añadamos posteriormente y luego guarde los registros en ella.

Reiniciamos el servicio.  
`systemctl restart rsyslog`

Comprobamos que el servidor está a la escucha en los puertos indicados anteriormente.  
`ss -tulnp | grep "rsyslog"`

Ahora tenemos que permitir las conexiones a esos puertos en firewalld.

```bash
firewall-cmd --permanent --add-port=514/udp
firewall-cmd --permanent --add-port=514/tcp
firewall-cmd --reload
```

En CentOS, en caso de tener habilitado **SELinux**, hay que permitir el tráfico de esos puertos, por lo que ejecutaremos los siguientes comandos:

```bash
semanage port -a -t syslogd_port_t -p udp 514
semanage port -a -t syslogd_port_t -p tcp 514 
```

Si nos aparece que el comando `semanage` no existe, tenemos que ejecutar el siguiente comando para poder instalarlo.  
`yum install policycoreutils-python -y`

## Configurar rsyslog en el cliente

En caso de no tenerlo instalado, hay que seguir los pasos indicados en la parte del servidor, es el mismo paquete.

Como en el caso anterior, para tener una mejor organización, crearemos un fichero en `/etc/rsyslog.d` llamado como queramos con la extensión `.conf`, en mi caso `clientlogs.conf`, y añadimos las siguientes líneas, sustituyendo por la IP del servidor que hemos configurado en el apartado `Target`.

```conf
action(type="omfwd"
queue.type="LinkedList"
queue.filename="queue_logs"
action.resumeRetryCount="-1"
queue.saveonshutdown="on"
Target="<ip_servidor>" Port="514" Protocol="tcp")
```

Donde:

* `queue.type` habilita que la cola de logs sea del tipo LinkedList, que asigna la memoria sólo cuando es necesaria.
* `queue.filename` define el nombre del disco que almacenará los logs hasta que se envían al servidor. Se guarda en `/var/lib/rsyslog`.
* `action.resumeRetryCount="-1"` evita que rsyslog descarte los mensajes al volver a intentar conectarse si el servidor no responde.
* `queue.saveonshutdown` guarda datos en memoria si rsyslog se apaga.
* La última línea reenvía todos los mensajes recibidos al servidor por TCP. El puerto es opcional.

Para mandar un custom log y realizar una prueba, si ejecutamos `logger <texto>`, mandará un log al servidor y comprobaremos si la comunicación se realiza correctamente.

De esta manera, ya tendremos los logs de todos nuestros servidores en un único sitio y no tendremos que estar conectándonos en mil sitios distintos.

En posteriores posts tengo pensado explicar cómo podemos hacer que la comunicación entre servidor/cliente se haga bajo un certificado que cifre la información que se envía, crear templates en los clientes para aplicaciones como Docker, Tomcat y demás, además de desplegar Logstash, Elasticsearch o Kibana para poder trabajar con los logs de forma más visual.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
