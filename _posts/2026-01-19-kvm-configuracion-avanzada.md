---
title: Configuración avanzada en KVM
date: 2026-01-19 18:25:00 +0100
description: Con este post terminaremos (de momento) la miniserie relacionada con KVM, donde veremos comandos más avanzados, que nos permitirán gestionar KVM al siguiente nivel.
image: /assets/img/sysadmin.jpg # Add image post (optional)
tags: [linux, kvm, virtualizacion]
categories: [linux, virtualizacion]
---

Con este post terminaremos (de momento) la miniserie relacionada con KVM, donde veremos comandos más avanzados, que nos permitirán gestionar KVM al siguiente nivel.

# Ver o editar XML de una VM

```bash
virsh dumpxml <nombre>
virsh edit <nombre>
```


# Monitorización

## Ver uso de CPU, RAM y red de todas las VMs

```bash
virsh domstats --state --cpu-total --balloon --interface
```

## Ver interfaces de red activas

```bash
ip link show | grep virbr
```

## Ver interfaces de una VM

```bash
virsh domiflist <nombre>
```

De momento he planteado estos 4 posts para manejar KVM, pero según vaya trabajando más con ello, iré actualizando o agregando más posts al respecto.

Espero que os haya gustado y os haya servido de ayuda. ¡Hasta la próxima!
