# Feature: Formulario de Cotización

## Archivo principal
`public/js/cotizacion.js`

## Descripción
Formulario de contacto que envía un email a la agencia via Formsubmit
y dispara un auto-reply al cliente confirmando la recepción.

---

## PASO PREVIO OBLIGATORIO — Verificar Formsubmit

Formsubmit requiere verificar el email receptor la primera vez.

1. Con el sitio deployado en Vercel, completar y enviar el formulario
2. Revisar `viajaratumanera.asesoria@gmail.com` — llegará un email de Formsubmit
3. Hacer clic en el link de activación
4. A partir de ese momento los envíos funcionan correctamente

**Sin este paso, los envíos fallan silenciosamente.**

---

## Endpoint

```
POST https://formsubmit.co/ajax/viajaratumanera.asesoria@gmail.com
```

---

## Campos del formulario

| Campo | ID HTML | Tipo | Requerido |
|-------|---------|------|-----------|
| Nombre completo | `cNombre` | text | ✓ |
| Email | `cEmail` | email | ✓ |
| Teléfono / WhatsApp | `cTel` | tel | ✗ |
| Número de viajeros | `cViajeros` | select | ✗ |
| Destino deseado | `cDestino` | text | ✗ |
| Fecha aproximada | `cFecha` | month | ✗ |
| Mensaje / notas | `cNota` | textarea | ✗ |

---

## HTML del formulario (reemplaza el formulario actual en `#cotizacion`)

```html
<form id="cotizFormEl" novalidate>

  <!-- Campos ocultos de configuración Formsubmit -->
  <input type="hidden" name="_subject" value="Nueva cotización — Viajar A Tu Manera">
  <input type="hidden" name="_template" value="box">
  <input type="hidden" name="_captcha" value="false">
  <input type="hidden" name="_autoresponse"
    value="¡Hola! Recibimos tu solicitud de cotización en Viajar A Tu Manera. Un asesor se pondrá en contacto contigo muy pronto para diseñar tu viaje ideal. ¡Gracias por elegirnos! ✈️ — Equipo Viajar A Tu Manera">
  <input type="hidden" name="_replyto" id="hiddenReplyTo">

  <div class="form-grid">
    <div class="form-group">
      <label>Nombre completo</label>
      <input type="text" id="cNombre" name="Nombre" placeholder="Tu nombre">
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" id="cEmail" name="Email" placeholder="correo@ejemplo.com">
    </div>
    <div class="form-group">
      <label>Teléfono / WhatsApp</label>
      <input type="tel" id="cTel" name="Teléfono" placeholder="+52 55 0000 0000">
    </div>
    <div class="form-group">
      <label>Número de viajeros</label>
      <select id="cViajeros" name="Viajeros">
        <option value="">Selecciona</option>
        <option>1 persona</option>
        <option>2 personas</option>
        <option>3–4 personas</option>
        <option>5+ personas</option>
      </select>
    </div>
    <div class="form-group">
      <label>Destino deseado</label>
      <input type="text" id="cDestino" name="Destino" placeholder="¿A dónde querés ir?">
    </div>
    <div class="form-group">
      <label>Fecha aproximada</label>
      <input type="month" id="cFecha" name="Fecha">
    </div>
    <div class="form-group full">
      <label>Contanos sobre tu viaje ideal</label>
      <textarea rows="4" id="cNota" name="Mensaje"
        placeholder="Describí lo que buscás, actividades, presupuesto, preferencias especiales…"></textarea>
    </div>
  </div>

  <p class="form-error" id="cotizError" hidden></p>

  <button type="button" class="cotiz-btn" id="cotizBtn" onclick="enviarCotizacion()">
    Enviar solicitud
  </button>
</form>

<!-- Estado de éxito (oculto inicialmente) -->
<div id="cotiz-success" hidden>
  <div class="success-icon">✅</div>
  <h3>¡Recibimos tu solicitud!</h3>
  <p>
    Te enviamos una confirmación a <strong id="confirmEmail"></strong>.<br>
    Un asesor te contactará en menos de 24 horas para diseñar
    juntos tu viaje perfecto.
  </p>
  <button class="cotiz-btn cotiz-btn--secondary" onclick="resetCotizacion()">
    Enviar otra consulta
  </button>
</div>
```

---

## JavaScript — `cotizacion.js`

```javascript
function enviarCotizacion() {
  const nombre = document.getElementById('cNombre').value.trim();
  const email  = document.getElementById('cEmail').value.trim();

  if (!nombre || !email) {
    mostrarErrorCotiz('Por favor completá nombre y correo electrónico.');
    return;
  }

  // Verificar formato de email básico
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarErrorCotiz('Por favor ingresá un correo electrónico válido.');
    return;
  }

  // Sincronizar campo hidden replyto con email del cliente (para auto-reply)
  document.getElementById('hiddenReplyTo').value = email;

  const btn = document.getElementById('cotizBtn');
  btn.disabled = true;
  btn.textContent = 'Enviando…';
  document.getElementById('cotizError').hidden = true;

  const formData = new FormData(document.getElementById('cotizFormEl'));

  fetch('https://formsubmit.co/ajax/viajaratumanera.asesoria@gmail.com', {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success === 'true' || data.success === true) {
        mostrarExitoCotiz(email);
      } else {
        throw new Error('Formsubmit rechazó el envío');
      }
    })
    .catch(() => {
      mostrarErrorCotiz(
        'Hubo un problema al enviar. ' +
        'Escribinos directamente a viajaratumanera.asesoria@gmail.com'
      );
      btn.disabled = false;
      btn.textContent = 'Enviar solicitud';
    });
}

function mostrarErrorCotiz(mensaje) {
  const el = document.getElementById('cotizError');
  el.textContent = mensaje;
  el.hidden = false;
}

function mostrarExitoCotiz(email) {
  document.getElementById('cotizFormEl').hidden = true;
  document.getElementById('confirmEmail').textContent = email;
  const success = document.getElementById('cotiz-success');
  success.hidden = false;
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetCotizacion() {
  document.getElementById('cotizFormEl').reset();
  document.getElementById('cotizFormEl').hidden = false;
  document.getElementById('cotiz-success').hidden = true;
  document.getElementById('cotizError').hidden = true;
}

window.enviarCotizacion = enviarCotizacion;
window.resetCotizacion  = resetCotizacion;
```

---

## CSS adicional para `styles.css`

```css
.form-error {
  color: #e74c3c;
  font-size: 0.82rem;
  margin-top: 0.75rem;
  line-height: 1.4;
}

#cotiz-success {
  text-align: center;
  padding: 3rem 1rem;
  color: #fff;
  animation: fadeUp 0.5s forwards;
}

#cotiz-success .success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

#cotiz-success h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 300;
  margin-bottom: 0.75rem;
}

#cotiz-success p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.cotiz-btn--secondary {
  background: transparent;
  border: 1px solid rgba(176, 146, 85, 0.5);
  width: auto;
  padding: 0.7rem 2rem;
}

.cotiz-btn--secondary:hover {
  background: rgba(176, 146, 85, 0.15);
}
```

---

## Acceptance criteria

- [ ] Validación de nombre y email antes de enviar (sin `alert()`)
- [ ] Validación de formato de email
- [ ] Campo `_replyto` se sincroniza con el email del cliente antes de enviar
- [ ] Auto-reply llega al email ingresado
- [ ] Notificación de nueva cotización llega a `viajaratumanera.asesoria@gmail.com`
- [ ] Estado de éxito muestra el email al que se envió la confirmación
- [ ] Error inline visible si Formsubmit falla
- [ ] Botón deshabilitado durante el envío
- [ ] Reset limpia el formulario y vuelve al estado inicial
- [ ] Formsubmit verificado manualmente antes del deploy final
