# Viajar A Tu Manera — Project Overview

## Descripción

Sitio web institucional y funcional para agencia de asesoría turística personalizada.
Combina presentación de marca, generación de itinerarios con IA y captación
de leads via formulario de cotización.

## Cliente

- **Nombre:** Viajar A Tu Manera
- **Email:** viajaratumanera.asesoria@gmail.com
- **WhatsApp:** +54 9 2284 648973
- **Dominio:** pendiente de compra en NIC.AR (formato: viajaratumanera.tur.ar)

## Developer

- Proyecto de portfolio público en GitHub
- Developer gestiona cuenta Vercel (cliente no necesita acceso)

## Objetivos del sitio

1. Mostrar la marca y propuesta de valor
2. Generar itinerarios personalizados con IA (Claude Sonnet 4.6)
3. Captar leads mediante formulario de cotización por email
4. Canal de contacto directo vía WhatsApp

## Estado del punto de partida

- Base: archivo único `index.html` con HTML + CSS + JS inline (es la base que me dio el cliente que generó, debemos adaptarla a lo nuestro. Se podria decir que es el boceto. Se mantiene asi, creamos un index.html para el sitio.)
- Llamada a Claude API expuesta en cliente → migrar a proxy serverless
- Formsubmit no verificado aún (requiere acción manual)
- Modelo desactualizado: `claude-sonnet-4-20250514` → usar `claude-sonnet-4-6`

## Features en scope (v1)

- [ ] Planificador de itinerario con IA + display en cards + share WhatsApp
- [ ] Formulario de cotización con email a agencia + auto-reply al cliente
- [ ] Sistema de animaciones de entrada y scroll
- [ ] Pack de destinos intercambiable (JSON externo)
- [ ] Proxy serverless para Claude API (seguridad de API key)
- [ ] Limpieza botones WhatsApp (quitar navbar, mantener flotante y footer)

## Features fuera de scope (v1) — cotizar aparte en el futuro

- WhatsApp Business API
- PDF de itinerario
- Chat IA in-page
- Panel de administración de destinos

## Documentos relacionados

- `KICKSTART.md` — setup inicial de estructura (primer archivo a leer)
- `ARCHITECTURE.md` — stack, estructura de archivos, endpoints serverless, deploy
- `SECURITY.md` — protección contra inference theft: page tokens, rate limiting, spending limits
- `FEATURE_PLANNER.md` — planificador IA
- `FEATURE_COTIZACION.md` — formulario de cotización
- `FEATURE_WHATSAPP.md` — integración WhatsApp
- `FEATURE_ANIMATIONS.md` — sistema de animaciones
- `FEATURE_DESTINATIONS.md` — pack de destinos
- `TASKS.md` — plan de implementación ordenado
- `CONVENTIONS.md` — convenciones de código
