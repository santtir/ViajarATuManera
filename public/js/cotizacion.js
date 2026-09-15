const COTIZ_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutos entre envíos

function enviarCotizacion() {
  const nombre = document.getElementById('cNombre').value.trim();
  const email  = document.getElementById('cEmail').value.trim();

  if (!nombre || !email) {
    mostrarErrorCotiz('Por favor completá nombre y correo electrónico.');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarErrorCotiz('Por favor ingresá un correo electrónico válido.');
    return;
  }

  const lastSent = Number(sessionStorage.getItem('cotiz_last_sent') || 0);
  if (Date.now() - lastSent < COTIZ_COOLDOWN_MS) {
    const restanteSeg = Math.ceil((COTIZ_COOLDOWN_MS - (Date.now() - lastSent)) / 1000);
    mostrarErrorCotiz(`Por favor esperá ${restanteSeg} segundos antes de enviar otra solicitud.`);
    return;
  }

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
        sessionStorage.setItem('cotiz_last_sent', String(Date.now()));
        mostrarExitoCotiz(email);
      } else {
        throw new Error('Formsubmit rechazó el envío');
      }
    })
    .catch(() => {
      mostrarErrorCotiz('Hubo un problema al enviar. Escribinos directamente a viajaratumanera.asesoria@gmail.com');
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

  const success = document.getElementById('cotiz-success');
  success.innerHTML = `
    <div class="success-icon">✅</div>
    <h3>¡Recibimos tu solicitud!</h3>
    <p>
      Te enviamos una confirmación a
      <strong id="confirmEmail"></strong>.<br />
      Un asesor te contactará en menos de 24 horas para diseñar juntos tu
      viaje perfecto.
    </p>
    <button class="cotiz-btn cotiz-btn--secondary" onclick="resetCotizacion()">
      Enviar otra consulta
    </button>
  `;
  document.getElementById('confirmEmail').textContent = email;
  success.hidden = false;
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetCotizacion() {
  document.getElementById('cotizFormEl').reset();
  document.getElementById('cotizFormEl').hidden = false;

  const success = document.getElementById('cotiz-success');
  success.hidden = true;
  success.innerHTML = '';

  const error = document.getElementById('cotizError');
  error.hidden = true;
  error.textContent = '';
}

window.enviarCotizacion = enviarCotizacion;
window.resetCotizacion  = resetCotizacion;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof flatpickr !== 'undefined') {
    flatpickr('#cFechaViaje', {
      mode: 'range',
      minDate: 'today',
      dateFormat: 'd/m/Y',
      locale: 'es',
      disableMobile: false,
      allowInput: false,
      conjunction: ' → ',
    });
  }
});
