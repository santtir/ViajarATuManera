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

function compartirItinerarioPorWA(textoItinerario, metaInfo) {
  const LIMITE_CHARS = 3800;

  const encabezado =
    `🌍 *MI ITINERARIO — Viajar A Tu Manera*\n` +
    `${metaInfo}\n` +
    `${"─".repeat(28)}\n\n`;

  const pie =
    `\n${"─".repeat(28)}\n` +
    `✈️ Generado por Viajar A Tu Manera\n` +
    `📱 +54 9 2284 322157`;

  let cuerpo = textoItinerario;

  const totalSinTruncar = encabezado.length + cuerpo.length + pie.length;
  if (totalSinTruncar > LIMITE_CHARS) {
    const espacioDisponible =
      LIMITE_CHARS - encabezado.length - pie.length - 60;
    cuerpo =
      cuerpo.substring(0, espacioDisponible) +
      "\n\n[...ver itinerario completo en pantalla]";
  }

  const mensajeCompleto = encabezado + cuerpo + pie;
  _abrirEnlace(`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensajeCompleto)}`);
}

window.abrirWhatsAppGeneral = abrirWhatsAppGeneral;
window.compartirItinerarioPorWA = compartirItinerarioPorWA;
