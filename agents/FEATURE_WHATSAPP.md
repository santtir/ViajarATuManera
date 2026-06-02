# Feature: Integración WhatsApp

## Archivo principal
`public/js/whatsapp.js`

## Descripción
WhatsApp es el canal de contacto principal de la agencia.
Hay dos comportamientos distintos según el punto de entrada.

---

## Constante global (definida en `main.js`)

```javascript
const WA_NUMERO = '522284322157'; // sin + ni espacios
```

Todas las funciones de WhatsApp usan esta constante.
Para cambiar el número, solo modificar en `main.js`.

---

## Comportamiento 1: Botón flotante — contacto general

**Acción:** Abre WhatsApp con mensaje genérico.
**NO incluye** el itinerario generado.

```javascript
function abrirWhatsAppGeneral() {
  const mensaje = encodeURIComponent(
    'Hola, me interesa conocer más sobre sus paquetes de viaje ✈️'
  );
  window.open(`https://wa.me/${WA_NUMERO}?text=${mensaje}`, '_blank');
}

window.abrirWhatsAppGeneral = abrirWhatsAppGeneral;
```

---

## Comportamiento 2: Botón "Compartir itinerario"

**Ubicación:** dentro del bloque `#result` del planificador.
**Acción:** Abre WhatsApp con el itinerario completo pre-cargado.

```javascript
function compartirItinerarioPorWA(textoItinerario, metaInfo) {
  const LIMITE_CHARS = 3800; // margen de seguridad bajo el límite de 4096

  const encabezado =
    `🌍 *MI ITINERARIO — Viajar A Tu Manera*\n` +
    `${metaInfo}\n` +
    `${'─'.repeat(28)}\n\n`;

  const pie =
    `\n${'─'.repeat(28)}\n` +
    `✈️ Generado por Viajar A Tu Manera\n` +
    `📱 +52 228 432 2157`;

  let cuerpo = textoItinerario;

  // Si supera el límite, truncar el cuerpo elegantemente
  const totalSinTruncar = encabezado.length + cuerpo.length + pie.length;
  if (totalSinTruncar > LIMITE_CHARS) {
    const espacioDisponible = LIMITE_CHARS - encabezado.length - pie.length - 60;
    cuerpo = cuerpo.substring(0, espacioDisponible) +
      '\n\n[...ver itinerario completo en pantalla]';
  }

  const mensajeCompleto = encabezado + cuerpo + pie;
  const mensajeCodificado = encodeURIComponent(mensajeCompleto);

  window.open(`https://wa.me/${WA_NUMERO}?text=${mensajeCodificado}`, '_blank');
}

window.compartirItinerarioPorWA = compartirItinerarioPorWA;
```

---

## Cambios requeridos en el HTML

### 1. ELIMINAR del `<nav>`

Quitar completamente este bloque del navbar:
```html
<!-- ELIMINAR ESTE BLOQUE DEL NAVBAR -->
<a href="https://wa.me/522284322157" target="_blank" style="...">
  <svg>...</svg>
  228 432 2157
</a>
```

El navbar queda solo con el logo y los links de navegación.

### 2. SIMPLIFICAR el botón flotante

Reemplazar todo el bloque `#chat-bubble` por:

```html
<div id="chat-bubble">
  <button
    class="chat-toggle"
    onclick="abrirWhatsAppGeneral()"
    title="Contactar por WhatsApp"
    aria-label="Abrir WhatsApp"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"
      viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </button>
</div>
```

La `.chat-window` (ventana de chat in-page con Claude) se elimina completamente.

### 3. FOOTER — mantener, está correcto

El link de WhatsApp en el footer ya tiene el número correcto.
Solo verificar que usa `WA_NUMERO` o el número literal correcto:
```
+52 228 432 2157 → wa.me/522284322157
```

---

## Acceptance criteria

- [ ] El número de WhatsApp no aparece en el navbar
- [ ] El botón flotante llama a `abrirWhatsAppGeneral()` y abre WA sin itinerario
- [ ] El botón dentro del resultado del planificador llama a `compartirItinerarioPorWA()`
- [ ] El itinerario se incluye en el mensaje de WA del planificador
- [ ] Si el texto supera el límite, se trunca sin romper el link
- [ ] La `.chat-window` fue eliminada del HTML
- [ ] El footer muestra el número correcto y funciona
- [ ] `WA_NUMERO` está definido en `main.js` y es usado por todas las funciones de WA
