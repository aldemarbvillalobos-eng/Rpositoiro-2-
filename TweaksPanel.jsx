import React from 'react';

// ── Design V1 — Editorial Atelier (Fraunces + Plus Jakarta Sans) ──────
function LivePreviewV1({ data, scale = 0.62, hidden = {} }) {
  hidden = hidden || {};
  const gold     = data.colorAccent  || '#C9A24C';
  const plum     = data.colorMain    || '#5B2E91';
  const plumDeep = '#1F0F3D';
  const cream    = '#f4ede0';
  const creamSoft= '#faf5ea';
  const ink      = '#1a0e2e';
  const cTitle   = data.colorTitle   || plumDeep;
  const cBody    = data.colorBody    || '#4a3f54';
  const cEyebrow = data.colorEyebrow || gold;
  const cHeroTx  = data.colorHeroText|| '#ffffff';
  const cHeroBg  = data.colorHeroBg  || plumDeep;
  const sH1  = data.sizeH1   || 36;
  const sH2  = data.sizeH2   || 26;
  const sBody= data.sizeBody || 13;
  const sEye = data.sizeEyebrow || 9;

  const Placeholder = ({ label, h = 220, dark = false }) => (
    <div style={{
      width:'100%', height:h,
      background: dark
        ? `repeating-linear-gradient(45deg,${gold}22 0 14px,${plumDeep} 14px 28px)`
        : `repeating-linear-gradient(45deg,${plum}14 0 14px,${cream} 14px 28px)`,
      display:'flex', alignItems:'center', justifyContent:'center',
      color: dark ? gold : plum, fontFamily:'ui-monospace,monospace',
      fontSize:10, letterSpacing:3, textTransform:'uppercase',
    }}>{label}</div>
  );

  const Eyebrow = ({ children }) => (
    <div style={{ fontSize:sEye, letterSpacing:4, textTransform:'uppercase',
      color:cEyebrow, fontWeight:800, marginBottom:14, textAlign:'center' }}>
      · {children} ·
    </div>
  );

  const GoldButton = ({ children }) => (
    <div style={{ display:'inline-block', padding:'12px 32px', background:gold,
      color:plumDeep, fontSize:10.5, letterSpacing:2.5,
      textTransform:'uppercase', fontWeight:800, fontFamily:'"Inter Tight",sans-serif' }}>
      {children}
    </div>
  );

  return (
    <div style={{
      width:560, background:cream,
      fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif', color:ink,
      transformOrigin:'top center', transform:`scale(${scale})`,
      boxShadow:'0 24px 60px rgba(20,10,40,0.25), 0 2px 10px rgba(20,10,40,0.08)',
      overflow:'hidden',
    }}>
      {/* Header */}
      <div style={{ background:cream, padding:'22px 0 16px',
        textAlign:'center', borderBottom:`1px solid ${plum}15` }}>
        {data.logoImg && data.logoImg.startsWith('http')
          ? <img src={data.logoImg} alt={data.brandName}
              style={{ height:56, maxWidth:200, objectFit:'contain', display:'inline-block' }} />
          : <div style={{ fontFamily:'"Fraunces",Georgia,serif', fontSize:22,
              color:plum, fontWeight:600, display:'inline-block' }}>
              {data.brandName || 'Sensation Brands'}
            </div>
        }
        <div style={{ marginTop:10, fontSize:9.5, letterSpacing:3.5,
          color:plum, fontFamily:'"Fraunces",serif', fontStyle:'italic', opacity:0.7 }}>
          {data.weekNum||'14'} · {data.weekMonth||'ABRIL · 2026'}
        </div>
      </div>

      {/* Hero */}
      <div style={{ background:cHeroBg, color:cHeroTx }}>
        {data.heroBanner && data.heroBanner.startsWith('http')
          ? <img src={data.heroBanner} alt="banner"
              style={{ width:'100%', height:320, objectFit:'cover', display:'block' }} />
          : <Placeholder label="banner del hero · 1200×600" h={280} dark />
        }
        <div style={{ padding:'28px 30px 32px' }}>
          <div style={{ fontSize:sEye, letterSpacing:4, textTransform:'uppercase',
            color:cEyebrow, fontWeight:800, marginBottom:10 }}>
            · {data.heroLabel||'Boletín Semanal'} ·
          </div>
          <h1 style={{ fontFamily:'"Fraunces",Georgia,serif',
            fontSize:sH1, lineHeight:1.1, margin:0, fontWeight:500,
            color:cHeroTx, letterSpacing:'-0.01em' }}>
            {data.heroTitle||'Tu titular va aquí'}{' '}
            {data.heroAccent && (
              <em style={{ color:gold, fontStyle:'italic', fontWeight:500 }}>{data.heroAccent}</em>
            )}
          </h1>
          {data.heroSub && (
            <div style={{ marginTop:14, fontSize:11, letterSpacing:1.5,
              color:'#c8b8e0', textTransform:'uppercase', fontWeight:600 }}>
              {data.heroSub}
            </div>
          )}
        </div>
      </div>

      {/* Bienvenida */}
      {!hidden.bien && (
        <div style={{ background:'#faf5ea', padding:'38px 36px 32px', textAlign:'center' }}>
          <Eyebrow>Bienvenida</Eyebrow>
          <h2 style={{ fontFamily:'"Fraunces",Georgia,serif',
            fontSize:sH2, fontWeight:500, margin:'0 0 16px', color:cTitle }}>
            {data.wTitle||'Hola Sensation Family'}
          </h2>
          <p style={{ fontSize:sBody, lineHeight:1.75, color:cBody,
            margin:'0 auto', maxWidth:440 }}>
            {data.wP1||'Tu primer párrafo de bienvenida aparece aquí…'}
          </p>
          {data.wP2 && (
            <p style={{ fontSize:sBody, lineHeight:1.75, color:cBody,
              margin:'12px auto 0', maxWidth:440 }}>{data.wP2}</p>
          )}
          {data.wMotive && (
            <div style={{ marginTop:22, fontFamily:'"Fraunces",serif',
              fontStyle:'italic', color:gold, fontSize:14 }}>{data.wMotive}</div>
          )}
        </div>
      )}

      {/* Productos */}
      {!hidden.productos && data.productos && data.productos.length > 0 && (
        <>
          <div style={{ background:cream, padding:'24px 36px 8px', textAlign:'center' }}>
            <Eyebrow>{data.prodSecTitle||'Especial · Belleza'}</Eyebrow>
            <h3 style={{ fontFamily:'"Fraunces",serif', fontSize:24,
              color:plum, fontWeight:500, margin:'0 0 4px' }}>
              {data.productos[0].name||'Producto destacado'}
            </h3>
            <div style={{ fontSize:10.5, color:'#7a6e8a', letterSpacing:1.5,
              textTransform:'uppercase', fontWeight:600 }}>
              {data.productos[0].sub||''}
            </div>
          </div>
          <div style={{ background:cream, padding:'12px 36px 28px' }}>
            {data.productos[0].img && data.productos[0].img.startsWith('http')
              ? <img src={data.productos[0].img} alt=""
                  style={{ width:'100%', height:360, objectFit:'cover', display:'block' }} />
              : <Placeholder label="producto · 800×800" h={300} />
            }
            <div style={{ textAlign:'center', marginTop:22 }}>
              <GoldButton>{data.productos[0].cta||'Adquiérelo ahora'}</GoldButton>
            </div>
          </div>
          {data.productos.length > 1 && (
            <div style={{ background:cream, padding:'0 36px 32px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {data.productos.slice(1).map((p, i) => (
                  <div key={i} style={{ background:'#fff', overflow:'hidden' }}>
                    {p.img && p.img.startsWith('http')
                      ? <img src={p.img} alt="" style={{ width:'100%', height:130, objectFit:'cover', display:'block' }} />
                      : <Placeholder label={`prod ${i+2}`} h={130} />
                    }
                    <div style={{ padding:'12px 14px', textAlign:'center' }}>
                      <div style={{ fontFamily:'"Fraunces",serif', fontSize:13.5,
                        color:plum, fontWeight:500, lineHeight:1.2 }}>{p.name||''}</div>
                      <div style={{ fontSize:9.5, color:gold, marginTop:4,
                        letterSpacing:1.5, textTransform:'uppercase', fontWeight:700 }}>{p.price||''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Eventos */}
      {!hidden.eventos && data.eventos && data.eventos.map((ev, i) => (
        <div key={i} style={{ background:plumDeep, color:'#fff' }}>
          <div style={{ padding:'32px 36px 24px', textAlign:'center' }}>
            <div style={{ fontSize:9, letterSpacing:4, color:gold,
              fontWeight:800, textTransform:'uppercase', marginBottom:10 }}>
              · Reclutamiento Semanal ·
            </div>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize:22,
              fontWeight:500, lineHeight:1.25 }}>{ev.title||'Título del evento'}</div>
          </div>
          {ev.img && ev.img.startsWith('http')
            ? <img src={ev.img} alt="" style={{ width:'100%', height:220, objectFit:'cover', display:'block' }} />
            : <Placeholder label="evento · 1200×800" h={200} dark />
          }
          <div style={{ padding:'24px 36px 32px', textAlign:'center' }}>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize:26,
              color:gold, fontWeight:600, fontStyle:'italic', letterSpacing:1, marginBottom:4 }}>
              {(ev.date||'').toUpperCase()}
            </div>
            <p style={{ fontSize:12, lineHeight:1.7, color:'#d6cae8',
              margin:'0 auto 20px', maxWidth:380 }}>{ev.desc||''}</p>
            <GoldButton>{ev.cta||'Reservar lugar'}</GoldButton>
          </div>
        </div>
      ))}

      {/* Capacitación */}
      {!hidden.capacitacion && data.capacitaciones && data.capacitaciones.map((c, i) => (
        <div key={i} style={{ background:'#faf5ea', padding:'36px 36px 32px', textAlign:'center' }}>
          <Eyebrow>Capacitación</Eyebrow>
          <h3 style={{ fontFamily:'"Fraunces",serif', fontSize:22, color:plum,
            fontWeight:500, margin:'0 0 18px', lineHeight:1.25 }}>{c.title||''}</h3>
          <p style={{ fontSize:12.5, lineHeight:1.7, color:'#4a3f54',
            margin:'0 auto 20px', maxWidth:420 }}>{c.desc||''}</p>
          {c.img && c.img.startsWith('http')
            ? <img src={c.img} alt="" style={{ width:'100%', height:240, objectFit:'cover', display:'block' }} />
            : <Placeholder label="capacitación · 1200×600" h={180} />
          }
          {c.cta && <div style={{ marginTop:22 }}><GoldButton>{c.cta}</GoldButton></div>}
        </div>
      ))}

      {/* Footer */}
      <div style={{ padding:'48px 36px 40px', background:plumDeep,
        color:'#a89bb8', textAlign:'center', fontSize:10.5, lineHeight:1.8 }}>
        {data.logoImg && data.logoImg.startsWith('http')
          ? <img src={data.logoImg} alt={data.brandName}
              style={{ height:72, maxWidth:200, objectFit:'contain', display:'inline-block', marginBottom:14 }} />
          : null
        }
        <div style={{ fontSize:10.5, letterSpacing:4, color:gold, fontWeight:700, marginBottom:24 }}>
          {(data.brandName||'SENSATION BRANDS').toUpperCase()} · BOLETÍN SEMANAL
        </div>
        <div style={{ fontSize:11, color:'#c0b5d0', lineHeight:1.7, marginBottom:4 }}>
          Recibes este correo porque eres parte de la Sensation Family.
        </div>
        <div style={{ fontSize:11, color:'#c0b5d0', lineHeight:1.7, marginBottom:24 }}>
          ¿Ya no quieres recibir nuestros boletines?{' '}
          <span style={{ color:gold, textDecoration:'underline' }}>Darme de baja</span>
        </div>
        <div style={{ fontSize:10, color:'#7a6e8a' }}>
          © {data.footerYear||'2026'} {data.brandName||'Sensation Brands'} · Todos los derechos reservados
        </div>
      </div>
    </div>
  );
}

export default LivePreviewV1;
