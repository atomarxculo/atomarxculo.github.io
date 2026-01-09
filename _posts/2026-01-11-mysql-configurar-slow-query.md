---
title: Configurar el log Slow Query en MySQL o MariaDB
date: 2026-01-11 17:25:00 +0100
description: En este post veremos cómo activar y configurar el log de Slow Query de MySQL/MariaDB, una herramienta que nos dirá que consultas hacen que nuestra BDD lo pase mal.
image: /assets/img/sysadmin.jpg # Add image post (optional)
tags: [linux, mysql, mariadb]
categories: [linux, mysql]
---

En este post veremos cómo activar y configurar el log de Slow Query de MySQL/MariaDB, una herramienta que nos dirá que consultas hacen que nuestra BDD lo pase mal.

Para poder activarlo, tenemos dos opciones:

1. Configurarlo de forma temporal, cuando se reinicie el servicio volverá a su estado por defecto.
2. Configurarlo de forma permanente.

## Configuración temporal

Para realizar la configuración de manera temporal, tenemos que acceder a la BDD y ejecutar las siguientes queries, las cuales indicaré que hace cada una.

- Activa (si ponemos 0 se desactiva) el log de slow query.

```sql
SET GLOBAL slow_query_log = 1;
```

- Definimos el tiempo en segundos para considerar una consulta como "lenta".

```sql
SET GLOBAL long_query_time = 10;
```

- Activamos para que registre consultas que no usan índices, incluso si son rápidas. Si ponemos 0, sólo registrará las queries que excedan el tiempo definido en `long_query_time`. Este parámetro viene bien si queremos hacer auditorias, pero habría que tener cuidado con el tamaño del log.

```sql
SET GLOBAL log_queries_not_using_indexes = 0;
```

## Configuración permanente

En este paso tenemos que tener localizado el fichero `my.cnf`, que normalmente se encuentra en `/etc/mysql`.

Editamos el fichero y añadimos la siguietne configuración:

```conf
[mysqld]   
slow_query_log = 1  
long_query_time = 1  
slow_query_log_file = /var/log/mysql/slow.log  
log_error = /var/log/mysql/mariadb-error.log  
general_log = 0
```

`general_log` captura todo los registros en el servidor. Aquí lo pongo en 0 porque en producción afectaría mucho a nivel de I/O, tamaño del log y al rendimiento en general.

Una vez terminado, reiniciamos el servicio de MySQL/MariaDB para aplicar los cambios.

## Comprobar configuración

Para comprobar que la configuración que hemos realizado se ha aplicado correctamente accedemos a la BDD y ejecutamos las siguientes queries.

```sql
MariaDB [(none)]> SHOW VARIABLES LIKE 'slow_query_log'; 
+----------------+-------+ 
| Variable_name | Value | 
+----------------+-------+ 
| slow_query_log | ON | 
+----------------+-------+ 
1 row in set (0.001 sec)


MariaDB [(none)]> SHOW VARIABLES LIKE 'slow_query_log_file'; 
+---------------------+-------------------------+ 
| Variable_name | Value | 
+---------------------+-------------------------+ 
| slow_query_log_file | /var/lib/mysql/slow.log | 
+---------------------+-------------------------+ 
1 row in set (0.000 sec)


MariaDB [(none)]> SHOW VARIABLES LIKE 'long_query_time'; 
+-----------------+----------+ 
| Variable_name | Value | 
+-----------------+----------+ 
| long_query_time | 10.000000 | 
+-----------------+----------+ 
1 row in set (0.001 sec)
```

Y con esto ya tendremos lista la configuración para ver qué queries son las que están afectando a nuestra BDD.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
