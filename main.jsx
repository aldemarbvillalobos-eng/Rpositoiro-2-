// generateEmailHTMLV3 — Moderna (Jost)
// This is a separate module to avoid template literal escaping issues
export function generateEmailHTMLV3(data, hiddenSections) {
  const safeUrl = (v) => (v && v.startsWith('http') ? v : '');
  const gold = data.colorAccent || '#C9A24C';
  const plum = data.colorMain || '#5B2E91';
  const plumDeep = '#3A1F6E';
  const plumDark = '#2E1A47';
  const goldLight = '#D4A94F';
  const goldBright = '#E8C86A';
  const white = '#ffffff';
  const offwhite = '#FAF6EE';
  const textLight = '#D9CFE7';
  const textMuted = '#8B7DA8';
  const textBody = data.colorBody || '#4a4254';
  const cEyebrow = data.colorEyebrow || gold;
  const sH1 = data.sizeH1 || 42;
  const sH2 = data.sizeH2 || 32;
  const sBody = data.sizeBody || 15;
  const ff = "'Jost',Arial,Helvetica,sans-serif";
  const gradPlum = `linear-gradient(135deg,${plum} 0%,${plumDeep} 40%,#7B3FAD 70%,#4A1F7A 100%)`;
  const gradGold = `linear-gradient(135deg,${goldLight} 0%,#B8882A 40%,${goldBright} 70%,${gold} 100%)`;
  const hidden = hiddenSections || {};

  const eye = (l, c = gold, mb = 14) =>
    `<p style="margin:0 0 ${mb}px;font-family:${ff};font-size:11px;letter-spacing:4px;color:${c};text-transform:uppercase;font-weight:600;">${l}</p>`;
  const gBtn = (l, h = '#') =>
    `<a href="${h}" style="display:inline-block;background:${gradGold};color:${plumDark};font-family:${ff};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:800;padding:14px 28px;border-radius:50px;text-decoration:none;box-shadow:0 4px 18px rgba(201,162,76,0.45);">${l}</a>`;
  const pBtn = (l, h = '#') =>
    `<a href="${h}" style="display:inline-block;background:${gradPlum};color:#fff;font-family:${ff};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:800;padding:14px 28px;border-radius:50px;text-decoration:none;">${l}</a>`;
  const imgOrPh = (url, alt, h = 220, dark = false) => url
    ? `<img src="${url}" alt="${alt}" style="width:100%;height:auto;display:block;">`
    : `<div style="height:${h}px;background:${dark ? `repeating-linear-gradient(45deg,${gold}22 0 14px,${plumDeep} 14px 28px)` : offwhite};display:flex;align-items:center;justify-content:center;color:${dark ? gold : plum};font-family:monospace;font-size:10px;letter-spacing:3px;">${alt}</div>`;

  const prodsHTML = !hidden.productos && data.productos && data.productos.length > 0 ? `
<tr><td style="padding:32px 40px 8px;"><div style="height:2px;background:linear-gradient(90deg,${goldLight} 0%,${goldBright} 50%,transparent 100%);border-radius:2px;"></div></td></tr>
<tr><td style="padding:24px 32px 8px;background:${white};">${eye(data.prodSecTitle || 'Especial · Belleza', cEyebrow)}<h2 style="margin:0 0 4px;font-family:${ff};font-size:28px;color:${plumDark};font-weight:700;">${data.productos[0].name || ''}</h2>${data.productos[0].sub ? `<p style="margin:0 0 16px;font-family:${ff};font-size:11px;letter-spacing:3px;color:#7a6a8a;text-transform:uppercase;">${data.productos[0].sub}</p>` : ''}</td></tr>
<tr><td style="padding:0 32px 28px;background:${white};">${imgOrPh(safeUrl(data.productos[0].img), data.productos[0].name || 'producto', 300)}
<div style="text-align:center;margin-top:22px;">${gBtn(data.productos[0].cta || 'Adquiérelo ahora', data.productos[0].link || '#')}</div></td></tr>
${data.productos.length > 1 ? `<tr><td style="padding:0 32px 32px;background:${white};"><table width="100%" cellspacing="0" cellpadding="0" border="0"><tr>${data.productos.slice(1).map((p, i) => `<td width="50%" valign="top" style="padding-${i % 2 === 0 ? 'right' : 'left'}:7px;"><div style="background:${offwhite};border-radius:12px;overflow:hidden;border:1px solid #f0ece4;">${imgOrPh(safeUrl(p.img), p.name || '', 130)}<div style="padding:12px 14px;text-align:center;"><div style="font-family:${ff};font-size:13.5px;color:${plum};font-weight:700;">${p.name || ''}</div>${p.price ? `<div style="font-family:${ff};font-size:13px;color:${gold};margin-top:4px;font-weight:700;">${p.price}</div>` : ''}</div></div></td>`).join('')}</tr></table></td></tr>` : ''}
` : '';

  const eventsHTML = !hidden.eventos && data.eventos && data.eventos.length > 0 ? `
<tr><td style="background:${gradPlum};padding:32px 32px 8px;">${eye('Eventos de la Semana', gold)}
${data.eventos.map(ev => `<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:16px;overflow:hidden;margin-bottom:20px;">
<tr><td style="padding:0;">${imgOrPh(safeUrl(ev.img), ev.title || 'evento', 180, true)}</td></tr>
<tr><td style="padding:24px 24px 0;">${eye('Evento · En Línea', '#9B7FD4', 4)}<h3 style="margin:0 0 4px;font-family:${ff};font-size:22px;color:#fff;font-weight:700;">${ev.title || ''}</h3></td></tr>
<tr><td style="padding:16px 24px 0;"><table cellspacing="0" cellpadding="0" border="0"><tr>
<td valign="top" width="80" style="padding-right:16px;"><div style="background:${gradGold};border-radius:12px;padding:14px 10px;text-align:center;"><p style="margin:0;font-family:${ff};font-size:10px;color:${plumDark};font-weight:700;">${(ev.date || '').split('·')[0] || 'Fecha'}</p><p style="margin:4px 0 0;font-family:${ff};font-size:28px;color:${plumDark};font-weight:900;line-height:1;">${(ev.date || '').match(/\d+/) ? ev.date.match(/\d+/)[0] : '—'}</p></div></td>
<td valign="middle">${ev.date ? `<div style="padding:5px 0 5px 12px;border-left:2px solid ${gold};font-family:${ff};font-size:13px;color:#fff;margin-bottom:6px;">${ev.date}</div>` : ''}${ev.desc ? `<p style="margin:0;font-family:${ff};font-size:12.5px;color:${textLight};line-height:1.65;">${ev.desc}</p>` : ''}</td>
</tr></table></td></tr>
<tr><td style="padding:18px 24px 24px;"><div style="background:rgba(201,162,76,0.08);border-radius:10px;padding:12px 14px;margin-bottom:16px;"><p style="margin:0;font-family:${ff};font-size:12.5px;color:${textLight};line-height:1.5;">¿Conoces a alguien que quiera transformar su economía? <strong style="color:${gold};">Comparte esta oportunidad</strong></p></div>${gBtn(ev.cta || 'Reservar lugar →', ev.link || '#')}</td></tr>
</table>`).join('')}
</td></tr>
` : '';

  const capsHTML = !hidden.capacitacion && data.capacitaciones && data.capacitaciones.length > 0 ? `
<tr><td style="background:${offwhite};padding:36px 32px 32px;">${eye('Capacitación', cEyebrow)}
${data.capacitaciones.map(c => `<div style="background:${white};border-radius:16px;overflow:hidden;border:1px solid #f0ece4;margin-bottom:16px;">${imgOrPh(safeUrl(c.img), c.title || 'capacitación', 160)}<div style="padding:22px 24px 24px;"><h3 style="margin:0 0 10px;font-family:${ff};font-size:20px;color:${plumDark};font-weight:700;">${c.title || ''}</h3>${c.desc ? `<p style="margin:0 0 16px;font-family:${ff};font-size:13px;color:${textBody};line-height:1.65;">${c.desc}</p>` : ''}${(c.week || c.dates) ? `<div style="display:inline-flex;background:${plum};border-radius:8px;padding:8px 16px;margin-bottom:16px;">${c.week ? `<span style="font-family:${ff};font-size:11px;font-weight:700;text-transform:uppercase;color:#fff;letter-spacing:2px;">${c.week}</span>` : ''}${c.dates ? `<span style="font-family:${ff};font-size:11px;color:${gold};letter-spacing:1px;margin-left:8px;">${c.dates}</span>` : ''}</div>` : ''}${c.cta ? pBtn(c.cta, c.link || '#') : ''}</div></div>`).join('')}
</td></tr>
` : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${data.brandName || 'Boletín'} · Semana ${data.weekNum || ''}</title>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>body,table,td,a{font-family:'Jost',Arial,Helvetica,sans-serif;}img{border:0;display:block;}body{margin:0;padding:0;background:#FAF6EE;}a{color:${gold};text-decoration:none;}@media(max-width:520px){.container{width:100%!important;border-radius:0!important;}.img-full{width:100%!important;height:auto!important;}}</style>
</head>
<body style="margin:0;padding:0;background:#FAF6EE;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#FAF6EE">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#fff;border-radius:14px;overflow:hidden;">

<tr><td style="padding:22px 32px;background:#fff;border-bottom:1px solid #f0ece4;">
<table width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
<td align="left" valign="middle" width="80">${safeUrl(data.logoImg) ? `<img src="${safeUrl(data.logoImg)}" alt="${data.brandName || ''}" width="64" style="width:64px;height:auto;display:block;">` : `<div style="width:64px;height:64px;background:${plum};border-radius:8px;display:flex;align-items:center;justify-content:center;color:${gold};font-family:serif;font-size:28px;font-weight:700;">S</div>`}</td>
<td align="right" style="font-family:${ff};font-size:11px;letter-spacing:4px;color:${plum};font-weight:600;">${data.weekNum || '14'} · ${(data.weekMonth || 'ABRIL · 2026').split('·')[0].trim()}</td>
</tr></table></td></tr>

<tr><td style="background:${gradPlum};">${safeUrl(data.heroBanner) ? `<img src="${safeUrl(data.heroBanner)}" alt="hero" width="600" style="width:100%;height:auto;display:block;">` : `<div style="height:260px;background:repeating-linear-gradient(45deg,${gold}22 0 14px,${plumDeep} 14px 28px);display:flex;align-items:center;justify-content:center;color:${gold};font-size:10px;letter-spacing:3px;font-family:monospace;">BANNER DEL HERO · 1200×600</div>`}
<div style="padding:36px 32px 44px;">${eye(data.heroLabel || 'Boletín Semanal', gold, 14)}
<h1 style="margin:0 0 14px;font-family:${ff};font-size:${sH1}px;line-height:1.14;color:#fff;font-weight:700;">${data.heroTitle || ''}${data.heroAccent ? ` <span style="color:${gold};font-weight:800;">${data.heroAccent}</span>` : ''}</h1>
${data.heroSub ? `<p style="margin:0;font-family:${ff};font-size:14px;color:${textLight};">${data.heroSub}</p>` : ''}</div></td></tr>

${!hidden.bien ? `<tr><td style="padding:48px 40px 16px;background:#fff;text-align:center;">${eye('Bienvenida', cEyebrow)}<h2 style="margin:0 0 22px;font-family:${ff};font-size:${sH2}px;color:${plumDark};font-weight:700;">${data.wTitle || 'Hola Sensation Family'}</h2><p style="margin:0 0 18px;font-family:${ff};font-size:${sBody}px;line-height:1.6;color:${textBody};">${data.wP1 || ''}</p>${data.wP2 ? `<p style="margin:0 0 18px;font-family:${ff};font-size:${sBody}px;line-height:1.6;color:${textBody};">${data.wP2}</p>` : ''}${data.wMotive ? `<p style="margin:0;font-family:${ff};font-size:13px;letter-spacing:3px;color:${plum};font-weight:700;text-transform:uppercase;">${data.wMotive}</p>` : ''}</td></tr>` : ''}

${prodsHTML}
${eventsHTML}
${capsHTML}

<tr><td style="padding:40px 32px;background:${gradPlum};text-align:center;">
${safeUrl(data.logoImg) ? `<img src="${safeUrl(data.logoImg)}" alt="${data.brandName || ''}" width="72" style="width:72px;height:auto;display:inline-block;margin-bottom:14px;">` : ''}
<p style="margin:0 0 20px;font-family:${ff};font-size:10px;letter-spacing:4px;color:${gold};text-transform:uppercase;font-weight:600;">${(data.brandName || 'SENSATION BRANDS').toUpperCase()} · Boletín Semanal</p>
<p style="margin:0 0 16px;font-family:${ff};font-size:11px;color:${textLight};line-height:1.63;">Recibes este correo porque eres parte de la Sensation Family.<br>¿Ya no quieres recibir nuestros boletines? <a href="{{unsubscribe_url}}" style="color:${gold};text-decoration:underline;">Darme de baja</a></p>
<p style="margin:0;font-family:${ff};font-size:10px;color:${textMuted};">© ${data.footerYear || '2026'} ${data.brandName || 'Sensation Brands'} · Todos los derechos reservados</p>
</td></tr>

</table></td></tr></table>
</body></html>`;
}
