import React from 'react';

const T = {
  plum:'#5B2E91',plumDeep:'#3A1F6E',plumDark:'#2E1A47',
  gold:'#C9A24C',goldLight:'#D4A94F',goldBright:'#E8C86A',
  white:'#ffffff',offwhite:'#FAF6EE',
  textDark:'#1A1226',textBody:'#4a4254',textLight:'#D9CFE7',textMuted:'#8B7DA8',
  borderLight:'#f0ece4',
  gradPlum:'linear-gradient(135deg,#5B2E91 0%,#3A1F6E 40%,#7B3FAD 70%,#4A1F7A 100%)',
  gradGold:'linear-gradient(135deg,#D4A94F 0%,#B8882A 40%,#E8C86A 70%,#C9A24C 100%)',
  ff:"'Jost',Arial,Helvetica,sans-serif",
};

function Eyebrow({children,color=T.gold,mb=14}){return(<p style={{margin:`0 0 ${mb}px`,fontFamily:T.ff,fontSize:11,letterSpacing:4,color,textTransform:'uppercase',fontWeight:600}}>{children}</p>);}
function GoldBtn({children,href='#',style={}}){return(<a href={href} style={{display:'inline-block',background:T.gradGold,color:T.plumDark,fontFamily:T.ff,fontSize:11,letterSpacing:3,textTransform:'uppercase',fontWeight:800,padding:'14px 28px',borderRadius:50,textDecoration:'none',boxShadow:'0 4px 18px rgba(201,162,76,0.45)',...style}}>{children}</a>);}
function PurpleBtn({children,href='#',style={}}){return(<a href={href} style={{display:'inline-block',background:T.gradPlum,color:'#fff',fontFamily:T.ff,fontSize:11,letterSpacing:3,textTransform:'uppercase',fontWeight:800,padding:'14px 28px',borderRadius:50,textDecoration:'none',boxShadow:'0 4px 18px rgba(91,46,145,0.4)',...style}}>{children}</a>);}
function ImgPlaceholder({label,height=220,dark=false}){return(<div style={{width:'100%',height,display:'flex',alignItems:'center',justifyContent:'center',background:dark?`repeating-linear-gradient(45deg,${T.gold}22 0 14px,${T.plumDeep} 14px 28px)`:`repeating-linear-gradient(45deg,${T.plum}14 0 14px,${T.offwhite} 14px 28px)`,color:dark?T.gold:T.plum,fontFamily:'ui-monospace,monospace',fontSize:10,letterSpacing:3,textTransform:'uppercase'}}>{label}</div>);}

function LivePreview({data,scale=0.62,hidden={}}){
  hidden=hidden||{};
  const d=data||{};
  const gold=d.colorAccent||T.gold;
  const plum=d.colorMain||T.plum;
  const cEyebrow=d.colorEyebrow||gold;
  const cBody=d.colorBody||T.textBody;
  const sH1=d.sizeH1||42;
  const sH2=d.sizeH2||32;
  const sBody=d.sizeBody||15;

  return (
    <div style={{width:600,fontFamily:T.ff,color:T.textDark,transformOrigin:'top center',transform:`scale(${scale})`,boxShadow:'0 24px 60px rgba(20,10,40,0.25)',borderRadius:14,overflow:'hidden',background:T.white}}>

      {/* HEADER */}
      <div style={{padding:'22px 32px',background:T.white,borderBottom:`1px solid ${T.borderLight}`}}>
        <table width="100%" style={{borderCollapse:'collapse'}}><tbody><tr>
          <td style={{width:80}}>
            {d.logoImg&&d.logoImg.startsWith('http')
              ?<img src={d.logoImg} alt={d.brandName} width="64" style={{width:64,height:'auto',display:'block'}}/>
              :<div style={{width:64,height:64,background:plum,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:gold,fontFamily:'serif',fontSize:28,fontWeight:700}}>S</div>}
          </td>
          <td align="right" style={{fontFamily:T.ff,fontSize:11,letterSpacing:4,color:plum,fontWeight:600}}>
            {d.weekNum||'14'} · {(d.weekMonth||'ABRIL · 2026').split('·')[0].trim()}
          </td>
        </tr></tbody></table>
      </div>

      {/* HERO */}
      <div style={{background:`linear-gradient(135deg,${plum} 0%,${T.plumDeep} 40%,#7B3FAD 70%,#4A1F7A 100%)`}}>
        {d.heroBanner&&d.heroBanner.startsWith('http')
          ?<img src={d.heroBanner} alt="hero" width="600" style={{width:'100%',height:'auto',display:'block'}}/>
          :<ImgPlaceholder label="banner del hero · 1200×600" height={260} dark/>}
        <div style={{padding:'36px 32px 44px'}}>
          <Eyebrow color={gold} mb={14}>{d.heroLabel||'Boletín Semanal'}</Eyebrow>
          <h1 style={{margin:'0 0 14px',fontFamily:T.ff,fontSize:sH1,lineHeight:1.14,color:'#ffffff',fontWeight:700}}>
            {d.heroTitle||'Tu titular principal &'}{' '}
            {d.heroAccent&&<span style={{color:gold,fontWeight:800}}>{d.heroAccent}</span>}
          </h1>
          {d.heroSub&&<p style={{margin:0,fontFamily:T.ff,fontSize:14,color:T.textLight,fontWeight:400}}>{d.heroSub}</p>}
        </div>
      </div>

      {/* BIENVENIDA */}
      {!hidden.bien&&(
        <div style={{padding:'48px 40px 16px',background:T.white,textAlign:'center'}}>
          <Eyebrow color={cEyebrow}>Bienvenida</Eyebrow>
          <h2 style={{margin:'0 0 22px',fontFamily:T.ff,fontSize:sH2,lineHeight:1.19,color:T.plumDark,fontWeight:700}}>
            {d.wTitle||'Hola Sensation Family'}
          </h2>
          <p style={{margin:'0 0 18px',fontFamily:T.ff,fontSize:sBody,lineHeight:1.6,color:cBody,fontWeight:400}}>
            {d.wP1||'Tu primer párrafo aparece aquí…'}
          </p>
          {d.wP2&&<p style={{margin:'0 0 18px',fontFamily:T.ff,fontSize:sBody,lineHeight:1.6,color:cBody,fontWeight:400}}>{d.wP2}</p>}
          {d.wMotive&&<p style={{margin:0,fontFamily:T.ff,fontSize:13,letterSpacing:3,color:plum,fontWeight:700,textTransform:'uppercase'}}>{d.wMotive}</p>}
        </div>
      )}

      {/* PRODUCTOS */}
      {!hidden.productos&&d.productos&&d.productos.length>0&&(<>
        <div style={{padding:'32px 40px 8px'}}>
          <div style={{height:2,background:`linear-gradient(90deg,${T.goldLight} 0%,${T.goldBright} 50%,transparent 100%)`,borderRadius:2}}/>
        </div>
        <div style={{padding:'24px 32px 8px',background:T.white}}>
          <Eyebrow color={cEyebrow}>{d.prodSecTitle||'Especial · Belleza'}</Eyebrow>
          <h2 style={{margin:'0 0 4px',fontFamily:T.ff,fontSize:28,lineHeight:1.2,color:T.plumDark,fontWeight:700}}>{d.productos[0].name||'Producto destacado'}</h2>
          {d.productos[0].sub&&<p style={{margin:'0 0 16px',fontFamily:T.ff,fontSize:11,letterSpacing:3,color:'#7a6a8a',textTransform:'uppercase',fontWeight:600}}>{d.productos[0].sub}</p>}
        </div>
        <div style={{padding:'0 32px 28px',background:T.white}}>
          {d.productos[0].img&&d.productos[0].img.startsWith('http')
            ?<img src={d.productos[0].img} alt={d.productos[0].name} style={{width:'100%',height:320,objectFit:'cover',display:'block',borderRadius:12}}/>
            :<ImgPlaceholder label="imagen producto · 800×800" height={300}/>}
          <div style={{textAlign:'center',marginTop:22}}><GoldBtn>{d.productos[0].cta||'Adquiérelo ahora'}</GoldBtn></div>
        </div>
        {d.productos.length>1&&(
          <div style={{padding:'0 32px 32px',background:T.white}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              {d.productos.slice(1).map((p,i)=>(
                <div key={i} style={{background:T.offwhite,borderRadius:12,overflow:'hidden',border:`1px solid ${T.borderLight}`}}>
                  {p.img&&p.img.startsWith('http')?<img src={p.img} alt={p.name} style={{width:'100%',height:130,objectFit:'cover',display:'block'}}/>:<ImgPlaceholder label={`prod ${i+2}`} height={130}/>}
                  <div style={{padding:'12px 14px',textAlign:'center'}}>
                    <div style={{fontFamily:T.ff,fontSize:13.5,color:plum,fontWeight:700}}>{p.name||`Producto ${i+2}`}</div>
                    {p.price&&<div style={{fontFamily:T.ff,fontSize:13,color:gold,marginTop:4,fontWeight:700}}>{p.price}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>)}

      {/* EVENTOS */}
      {!hidden.eventos&&d.eventos&&d.eventos.length>0&&(
        <div style={{background:`linear-gradient(135deg,${plum} 0%,${T.plumDeep} 40%,#7B3FAD 70%,#4A1F7A 100%)`,padding:'32px 32px 8px'}}>
          <Eyebrow color={gold}>Eventos de la Semana</Eyebrow>
          {d.eventos.map((ev,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:16,overflow:'hidden',marginBottom:20}}>
              {ev.img&&ev.img.startsWith('http')?<img src={ev.img} alt={ev.title} style={{width:'100%',height:'auto',display:'block'}}/>:<ImgPlaceholder label="imagen evento" height={180} dark/>}
              <div style={{padding:'24px 24px 0'}}>
                <Eyebrow color="#9B7FD4" mb={4}>Evento · En Línea</Eyebrow>
                <h3 style={{margin:'0 0 4px',fontFamily:T.ff,fontSize:22,color:'#fff',fontWeight:700,lineHeight:1.25}}>{ev.title||'Título del evento'}</h3>
              </div>
              <div style={{padding:'16px 24px 0',display:'flex',alignItems:'flex-start',gap:16}}>
                <div style={{background:T.gradGold,borderRadius:12,padding:'14px 10px',textAlign:'center',minWidth:70,flexShrink:0}}>
                  <p style={{margin:0,fontFamily:T.ff,fontSize:10,letterSpacing:2,color:T.plumDark,fontWeight:700,textTransform:'uppercase'}}>{(ev.date||'').split('·')[0]||'Fecha'}</p>
                  <p style={{margin:'4px 0 0',fontFamily:T.ff,fontSize:28,color:T.plumDark,fontWeight:900,lineHeight:1}}>{(ev.date||'').match(/\d+/)?ev.date.match(/\d+/)[0]:'—'}</p>
                </div>
                <div>
                  {ev.date&&<div style={{padding:'5px 0 5px 12px',borderLeft:`2px solid ${T.gold}`,fontFamily:T.ff,fontSize:13,color:'#fff',fontWeight:500,marginBottom:6}}>{ev.date}</div>}
                  {ev.desc&&<p style={{margin:0,fontFamily:T.ff,fontSize:12.5,color:T.textLight,lineHeight:1.65}}>{ev.desc}</p>}
                </div>
              </div>
              <div style={{padding:'18px 24px 24px'}}>
                <div style={{background:'rgba(201,162,76,0.08)',borderRadius:10,padding:'12px 14px',marginBottom:16}}>
                  <p style={{margin:0,fontFamily:T.ff,fontSize:12.5,color:T.textLight,lineHeight:1.5}}>¿Conoces a alguien que quiera transformar su economía? <strong style={{color:gold}}>Comparte esta oportunidad</strong></p>
                </div>
                <GoldBtn href={ev.link||'#'}>{ev.cta||'Reservar lugar →'}</GoldBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CAPACITACIÓN */}
      {!hidden.capacitacion&&d.capacitaciones&&d.capacitaciones.length>0&&(
        <div style={{background:T.offwhite,padding:'36px 32px 32px'}}>
          <Eyebrow color={cEyebrow}>Capacitación</Eyebrow>
          {d.capacitaciones.map((c,i)=>(
            <div key={i} style={{background:T.white,borderRadius:16,overflow:'hidden',border:`1px solid ${T.borderLight}`,marginBottom:16}}>
              {c.img&&c.img.startsWith('http')?<img src={c.img} alt={c.title} style={{width:'100%',height:'auto',display:'block'}}/>:<ImgPlaceholder label="imagen capacitación" height={160}/>}
              <div style={{padding:'22px 24px 24px'}}>
                <h3 style={{margin:'0 0 10px',fontFamily:T.ff,fontSize:20,color:T.plumDark,fontWeight:700,lineHeight:1.3}}>{c.title||'¿Qué aprenderás esta semana?'}</h3>
                {c.desc&&<p style={{margin:'0 0 16px',fontFamily:T.ff,fontSize:13,color:cBody,lineHeight:1.65}}>{c.desc}</p>}
                {(c.week||c.dates)&&<div style={{display:'inline-flex',background:plum,borderRadius:8,padding:'8px 16px',marginBottom:16,gap:12}}>
                  {c.week&&<span style={{fontFamily:T.ff,fontSize:11,letterSpacing:2,fontWeight:700,textTransform:'uppercase',color:'#fff'}}>{c.week}</span>}
                  {c.dates&&<span style={{fontFamily:T.ff,fontSize:11,color:gold,letterSpacing:1}}>{c.dates}</span>}
                </div>}
                {c.cta&&<div><PurpleBtn href={c.link||'#'}>{c.cta}</PurpleBtn></div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div style={{padding:'40px 32px',background:`linear-gradient(135deg,${plum} 0%,${T.plumDeep} 40%,#7B3FAD 70%,#4A1F7A 100%)`,textAlign:'center'}}>
        {d.logoImg&&d.logoImg.startsWith('http')&&<img src={d.logoImg} alt={d.brandName} width="72" style={{width:72,height:'auto',display:'inline-block',marginBottom:14}}/>}
        <p style={{margin:'0 0 20px',fontFamily:T.ff,fontSize:10,letterSpacing:4,color:gold,textTransform:'uppercase',fontWeight:600}}>
          {(d.brandName||'Sensation Brands').toUpperCase()} · Boletín Semanal
        </p>
        <p style={{margin:'0 0 16px',fontFamily:T.ff,fontSize:11,color:T.textLight,lineHeight:1.63}}>
          Recibes este correo porque eres parte de la Sensation Family.<br/>
          ¿Ya no quieres recibir nuestros boletines? <a href="#" style={{color:gold,textDecoration:'underline'}}>Darme de baja</a>
        </p>
        <p style={{margin:0,fontFamily:T.ff,fontSize:10,color:T.textMuted}}>
          © {d.footerYear||'2026'} {d.brandName||'Sensation Brands'} · Todos los derechos reservados
        </p>
      </div>

    </div>
  );
}

export default LivePreview;
