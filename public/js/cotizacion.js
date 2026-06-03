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
