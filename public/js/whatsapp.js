function _abrirEnlace(url) {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function abrirWhatsAppGeneral() {
  const mensaje = encodeURIComponent(
    "Hola, me interesa conocer sobre sus paquetes de viaje ✈️",
  );
  _abrirEnlace(`https://wa.me/${WA_NUMERO}?text=${mensaje}`);
}

function compartirItinerarioPorWA(_textoItinerario, metaInfo) {
  const dest    = window._itinerarioDest    || '';
  const resumen = window._itinerarioResumen || '';

  const resumenCorto = resumen.length > 350
    ? resumen.substring(0, 347) + '...'
    : resumen;

  const mensaje =
    `Hola! Acabo de generar mi itinerario en *Viajar A Tu Manera* y quiero cotizarlo.\n\n` +
    `*Destino:* ${dest}\n` +
    `*Detalles:* ${metaInfo}\n\n` +
    (resumenCorto ? `${resumenCorto}\n\n` : '') +
    `Pueden prepararme una propuesta?`;

  _abrirEnlace(`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensaje)}`);
}

window.abrirWhatsAppGeneral = abrirWhatsAppGeneral;
window.compartirItinerarioPorWA = compartirItinerarioPorWA;
