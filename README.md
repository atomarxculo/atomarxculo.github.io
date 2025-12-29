# Blog Samuran

Blog donde iré subiendo las cosas que he aprendido e iré aprendiendo en el mundo de sysadmin.

Posibles futuros posts:

- Desplegar Jenkins
- Instalar Haproxy y configuración básica
- Configurar backup Jenkins
- Crear job Jenkins que se le pueda llamar mediante curl y token
- Configurar Webhook GitLab/Jenkins
- Instalar Ansible en Ubuntu y/o usar imagen Docker
- Instalar Active Directory en Windows Server 2019
- ~~Añadir disco LVM en Linux~~
- ~~Ampliar disco LVM en Linux~~
- ~~Instalar FreeIPA Server~~
- ~~Añadir clientes a FreeIPA~~
- ~~Instalación Barman y configuración~~
- Configuración de HTTPS para varios servicios
- Instalación Kafka/Kraft
- Instalación Opensearch (un sólo nodo)
- Instalación Opensearch (cluster 3 nodos)
- Configuración en Opensearch para rotado de indices
- Instalar cluster Kubernetes (1 master y 2 workers)
- Configurar Nginx Ingress Controller
- Configurar MetalLB y que vaya a través de haproxy
- Kubernetes Dashboard a través de Nginx
- Instalar Keycloak
- ~~Instalar Patroni~~
- Despliegue de un cluster de Nomad
- Despliegue de un cluster de Consul
- Integración componentes HashiCorp

Template Web: [Jekyll Theme Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy/tree/master)

## Construcción y desarrollo en local

Para estos pasos, hay que abrir el proyecto con `devcontainer` de Visual Studio Code

```bash
bundle install
JEKYLL_ENV=dev bundle exec jekyll serve --future
```
