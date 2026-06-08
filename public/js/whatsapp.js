function _abrirEnlace(url) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function abrirWhatsAppGeneral() {
  const mensaje = encodeURIComponent(
    "Hola, me interesa conocer sobre sus paquetes de viaje",
  );
  _abrirEnlace(`https://wa.me/${WA_NUMERO}?text=${mensaje}`);
}

function _extraerDias(resumen) {
  if (!resumen) return '';
  const lineas = resumen.split('\n');
  const dias = [];

  for (const linea of lineas) {
    const limpia = linea.trim().replace(/\*\*/g, '').replace(/\*/g, '');

    // Formato esperado: "Día N — Ciudad: ..."  o  "Día N – Ciudad: ..."
    const mFormato = limpia.match(/^(D[ií]a\s+\d+)\s*[—–-]+\s*([^:]+):/i);
    if (mFormato) {
      dias.push(`${mFormato[1].trim()}: ${mFormato[2].trim()}`);
      continue;
    }

    // Fallback: "Día N: texto..." → extraer primer lugar mencionado
    const mFallback = limpia.match(/^(D[ií]a\s+\d+[^:]*):?\s*(.+)/i);
    if (!mFallback) continue;

    let contenido = mFallback[2].trim();
    // Tomar hasta el primer punto, punto y coma, o guion separador
    const titulo = contenido.split(/[.;]|\s+[-–—]\s+|\s+\(/)[0].trim();
    // Quitar verbos de actividad comunes al inicio
    const lugar = titulo
      .replace(/^(llegada|vuelo|traslado|visita|excursión|excursion|recorrida|city tour|exploración|exploracion|día libre|dia libre|descanso|partida|regreso|salida)\s+(a |en |por |al |del |de |hacia )?/i, '')
      .trim();
    const textoFinal = lugar || titulo;
    if (textoFinal) dias.push(`${mFallback[1].trim()}: ${textoFinal}`);
  }

  return dias.join('\n');
}

function compartirItinerarioPorWA(_textoItinerario, metaInfo) {
  const dest  = window._itinerarioDest    || '';
  const pax   = window._itinerarioPax     || '';
  const pres  = window._itinerarioPres    || '';
  const tipo  = (window._itinerarioTipo  || []).join(', ');
  const resumen = window._itinerarioResumen || '';

  const durMatch = metaInfo.match(/(\d+)\s*d[ií]as?/i);
  const dur = durMatch ? durMatch[0] : metaInfo;

  const diasTexto = _extraerDias(resumen);

  const mensaje =
    `Hola! Generé mi itinerario en *Viajar A Tu Manera* y me gustaría cotizarlo 🌍\n\n` +
    `📍 *Destino:* ${dest}\n` +
    `📅 *Duración:* ${dur}\n` +
    (pax  ? `👥 *Personas:* ${pax}\n`       : '') +
    (pres ? `💰 *Presupuesto:* ${pres}\n`   : '') +
    (tipo ? `🌟 *Estilo:* ${tipo}\n`         : '') +
    (diasTexto ? `\n📋 *Itinerario:*\n${diasTexto}\n` : '') +
    `\n¿Me pueden enviar una propuesta con precios?`;

  _abrirEnlace(
    `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensaje)}`,
  );
}

window.abrirWhatsAppGeneral = abrirWhatsAppGeneral;
window.compartirItinerarioPorWA = compartirItinerarioPorWA;
