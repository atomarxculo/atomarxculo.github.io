---
title: Instalar y configurar un clúster básico de Kubernetes con Kind
date: 2026-01-07 17:25:00 +0100
description: Empezar con Kubernetes siempre es una odisea, más si no tienes la mínima idea de por dónde empezar, lo cual a todos nos ha pasado alguna vez.
image: /assets/img/kubernetes-logo.png # Add image post (optional)
tags: [kubernetes]
categories: [kubernetes]
---

Empezar con Kubernetes siempre es una odisea, más si no tienes la mínima idea de por dónde dar el primer paso, lo cual a todos nos ha pasado alguna vez. Por suerte, para eso está este post, el cual nos dará una buena base para poder empezar y poder trastear con Kubernetes.

Para ello, usaremos [Kind](https://kind.sigs.k8s.io/), la cual es una herramienta para levantar clústeres locales de Kubernetes mediante contenedores de Docker. Antes que nada tendremos que tener instalado **Docker** (en el blog hay posts indicando cómo instalarlo) en el equipo donde vayamos a utilizar Kind.

## Instalación

Para instalarlo en un Linux tendremos que ejecutar el siguiente comando, dando por hecho que se va a instalar en un equipo x86_64:

```bash
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.30.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

Para instarlalo en un Windows, desde Powershell ejecutamos el comando:

```powershell
curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/v0.30.0/kind-windows-amd64
Move-Item .\kind-windows-amd64.exe c:\some-dir-in-your-PATH\kind.exe
```

Si ejecutamos `kind`, nos aparecerá lo siguiente:

```shell
$ kind
kind creates and manages local Kubernetes clusters using Docker container 'nodes'

Usage:
  kind [command]

Available Commands:
  build       Build one of [node-image]
  completion  Output shell completion code for the specified shell (bash, zsh or fish)
  create      Creates one of [cluster]
  delete      Deletes one of [cluster]
  export      Exports one of [kubeconfig, logs]
  get         Gets one of [clusters, nodes, kubeconfig]
  help        Help about any command
  load        Loads images into nodes
  version     Prints the kind CLI version

Flags:
  -h, --help              help for kind
  -q, --quiet             silence all stderr output
  -v, --verbosity int32   info log verbosity, higher value produces more output
      --version           version for kind

Use "kind [command] --help" for more information about a command.
```

Con esto ya podremos usarlo.

## Configuración básica

A continuación adjunto un fichero yaml básico para desplegar un clúster con un control-plane y dos workers.

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: cluster-local
networking:
  apiServerAddress: "127.0.0.1"
  apiServerPort: 6443
nodes:
- role: control-plane
  image: kindest/node:v1.34.0@sha256:7416a61b42b1662ca6ca89f02028ac133a309a2a30ba309614e8ec94d976dc5a
  extraPortMappings:
  - containerPort: 30000
    hostPort: 30000
    protocol: TCP
- role: worker
  image: kindest/node:v1.34.0@sha256:7416a61b42b1662ca6ca89f02028ac133a309a2a30ba309614e8ec94d976dc5a
  extraPortMappings:
  - containerPort: 30000
    hostPort: 30001
    protocol: TCP
- role: worker
  image: kindest/node:v1.34.0@sha256:7416a61b42b1662ca6ca89f02028ac133a309a2a30ba309614e8ec94d976dc5a
  extraPortMappings:
  - containerPort: 30000
    hostPort: 30002
    protocol: TCP
```

Donde `name` es el nombre del cluster. Para este ejemplo estamos usando la versión 1.34.0 (Podemos ver las versiones que tienen disponibles en <https://github.com/kubernetes-sigs/kind/releases>).

## Desplegar clúster

Para desplegarlo tendremos que ejecutar el comando y nos devolverá lo siguiente:

```yaml
└─$ kind create cluster --config=kind-config.yml
Creating cluster "cluster-local" ...
 ✓ Ensuring node image (kindest/node:v1.34.0) 🖼
 ✓ Preparing nodes 📦 📦 📦  
 ✓ Writing configuration 📜 
 ✓ Starting control-plane 🕹️ 
 ✓ Installing CNI 🔌 
 ✓ Installing StorageClass 💾 
 ✓ Joining worker nodes 🚜 
Set kubectl context to "kind-cluster-local"
You can now use your cluster with:

kubectl cluster-info --context kind-cluster-local

Have a nice day! 👋
```

Si ejecutamos cualquier comando de `kubectl`, nos devolverá los datos del clúster que acabamos que desplegar.

```bash
└─$ kubectl get nodes
NAME                         STATUS   ROLES           AGE   VERSION
cluster-local-control-plane   Ready    control-plane   48s   v1.34.0
cluster-local-worker          Ready    <none>          36s   v1.34.0
cluster-local-worker2         Ready    <none>          36s   v1.34.0
```

## Eliminar clúster

Si queremos eliminarlo, tendremos que ejecutar el siguiente comando, indicando en `name` el nombre del clúster que hemos definido en el fichero:

```bash
kind delete cluster --name=cluster-local
```

Con todo esto, tendremos un cluster de Kubernetes totalmente funcional listo para que hagamos cosas en él, que iremos viendo en futuros posts.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
