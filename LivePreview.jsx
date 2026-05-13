import React, { useState, useRef } from 'react';
import { generateEmailHTMLV3 } from './generateV3.js';
import sensationLogoSrc from './assets/logo.png';
import LivePreview from './LivePreview.jsx';
import LivePreviewV1 from './LivePreviewV1.jsx';
import {
  useTweaks, TweaksPanel, TweakSection,
  TweakToggle, TweakRadio, TweakSelect, TweakColor,
} from './TweaksPanel.jsx';

// Editor Email — Variante B (Minimal Studio) interactivo.
// Estado vive aquí, preview se actualiza en vivo, sidebar colapsable.



// ── Defaults para Tweaks ────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "regular",
  "fontUi": "inter-tight",
  "fontDisplay": "fraunces",
  "dark": false,
  "accent": "#C9A24C"
}/*EDITMODE-END*/;

// ── Tokens según tweaks ─────────────────────────────────────────────────
function tokens(t) {
  const dark = t.dark;
  const fontUiMap = {
    'inter-tight': '"Inter Tight", "Inter", system-ui, sans-serif',
    'inter':       '"Inter", system-ui, sans-serif',
    'jakarta':     '"Plus Jakarta Sans", system-ui, sans-serif',
    'dm-sans':     '"DM Sans", system-ui, sans-serif',
  };
  const fontDisplayMap = {
    'fraunces':   '"Fraunces", Georgia, serif',
    'cormorant':  '"Cormorant Garamond", Georgia, serif',
    'inter-tight':'"Inter Tight", system-ui, sans-serif',
    'dm-serif':   '"DM Serif Display", Georgia, serif',
  };
  const pad = t.density === 'compact' ? { card: 13, row: 11 } :
              t.density === 'comfy'   ? { card: 22, row: 18 } : { card: 17, row: 14 };

  return {
    bg:         dark ? '#0e0d10' : '#f6f5f1',
    panel:      dark ? '#16161a' : '#ffffff',
    panel2:     dark ? '#1c1c22' : '#fafaf7',
    inputBg:    dark ? '#1c1c22' : '#f7f5f0',
    text:       dark ? '#ece8e0' : '#1a1a1a',
    text2:      dark ? '#9a958c' : '#6b665e',
    muted:      dark ? '#6a655c' : '#857f76',
    hairline:   dark ? '1px solid #26262d' : '1px solid #e8e5dc',
    hairline2:  dark ? '1px solid #2e2e36' : '1px solid #ddd9cf',
    cardShadow: dark ? 'none' : '0 1px 0 rgba(40,30,20,0.03)',
    previewBg:  dark ? '#0a0a0d' : '#eeece5',
    gold:       t.accent || '#C9A24C',
    plum:       '#5B2E91',
    plumSoft:   dark ? 'rgba(91,46,145,0.25)' : 'rgba(91,46,145,0.10)',
    danger:     '#c44e2e',
    success:    '#22a35e',
    fontUi:     fontUiMap[t.fontUi] || fontUiMap['inter-tight'],
    fontDisplay:fontDisplayMap[t.fontDisplay] || fontDisplayMap['fraunces'],
    fontMono:   '"JetBrains Mono", "Geist Mono", ui-monospace, monospace',
    pad,
    radius:     9,
    radiusSm:   6,
  };
}

// ── Field primitives ────────────────────────────────────────────────────
function Field({ k, label, required, placeholder, mono, type = 'text', data, set, tk }) {
  const v = data[k] || '';
  return (
    <div style={{ marginBottom: tk.pad.row }}>
      <label style={{
        display: 'block', fontSize: 13, fontWeight: 600, color: tk.text2,
        marginBottom: 5, fontFamily: tk.fontUi, letterSpacing: 0.2,
      }}>
        {label}{required && <span style={{ color: tk.danger, marginLeft: 3 }}>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={v}
          onChange={e => set(k, e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', background: tk.inputBg, border: tk.hairline,
            borderRadius: tk.radiusSm, padding: '10px 12px',
            fontSize: 16, color: tk.text, fontFamily: tk.fontUi,
            outline: 'none', resize: 'vertical', minHeight: 64, lineHeight: 1.55,
          }} />
      ) : (
        <input
          type={type} value={v}
          onChange={e => set(k, e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', background: tk.inputBg, border: tk.hairline,
            borderRadius: tk.radiusSm,
            padding: tk.density === 'compact' ? '8px 11px' : '10px 13px',
            fontSize: 16, color: tk.text,
            fontFamily: mono ? tk.fontMono : tk.fontUi,
            outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = tk.gold}
          onBlur={e => e.target.style.borderColor = ''} />
      )}
    </div>
  );
}

function ColorField({ k, label, data, set, tk }) {
  const v = data[k] || '#000000';
  return (
    <div style={{ flex: 1, marginBottom: tk.pad.row }}>
      <label style={{
        display: 'block', fontSize: 13, fontWeight: 600, color: tk.text2,
        marginBottom: 5, fontFamily: tk.fontUi,
      }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: tk.inputBg, border: tk.hairline, borderRadius: tk.radiusSm,
        padding: '4px 8px 4px 4px',
      }}>
        <input type="color" value={v} onChange={e => set(k, e.target.value)}
          style={{ width: 32, height: 28, border: 'none', background: 'none', padding: 0, cursor: 'pointer' }} />
        <input type="text" value={v.toUpperCase()} maxLength={7}
          onChange={e => set(k, e.target.value)}
          style={{
            flex: 1, background: 'none', border: 'none',
            fontFamily: tk.fontMono, fontSize: 15, color: tk.text, outline: 'none',
          }} />
      </div>
    </div>
  );
}

function SizeField({ k, label, min, max, unit = 'px', data, set, tk }) {
  const v = parseInt(data[k] || min, 10);
  return (
    <div style={{ marginBottom: tk.pad.row }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 5 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: tk.text2,
          fontFamily: tk.fontUi }}>{label}</label>
        <span style={{ fontFamily: tk.fontMono, fontSize: 14,
          color: tk.gold, fontWeight: 700 }}>{v}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={v}
        onChange={e => set(k, parseInt(e.target.value, 10))}
        style={{
          width: '100%', accentColor: tk.gold, cursor: 'pointer',
        }} />
    </div>
  );
}

// ── Section card ────────────────────────────────────────────────────────
function Section({ id, icon, title, badge, openState, setOpenState, hideMap, toggleHide, tk, children }) {
  const open = openState[id];
  const isHidden = hideMap && hideMap[id];
  const canHide = !!toggleHide;
  const badgeColor = badge === 'REQUERIDO' ? tk.danger :
                     badge === 'OPCIONAL' ? tk.text2 : tk.plum;
  return (
    <div style={{
      background: tk.panel, border: tk.hairline, borderRadius: tk.radius,
      marginBottom: 8, overflow: 'hidden', boxShadow: tk.cardShadow,
      opacity: isHidden ? 0.55 : 1,
    }}>
      <div onClick={() => setOpenState(s => ({ ...s, [id]: !s[id] }))}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: `${tk.pad.card}px 16px`, cursor: 'pointer', userSelect: 'none',
        }}>
        <span style={{
          width: 26, height: 26, borderRadius: 5, background: tk.plumSoft,
          color: tk.plum, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 16, fontWeight: 600,
        }}>{icon}</span>
        <span style={{
          flex: 1, fontSize: 16.5, fontWeight: 600, fontFamily: tk.fontUi,
          color: isHidden ? tk.muted : tk.text,
          textDecoration: isHidden ? 'line-through' : 'none',
        }}>{title}</span>
        {canHide && (
          <button
            title={isHidden ? 'Mostrar en email' : 'Ocultar del email'}
            onClick={e => { e.stopPropagation(); toggleHide(id); }}
            style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
              padding: '3px 8px', borderRadius: 3, cursor: 'pointer',
              fontFamily: tk.fontMono,
              color: isHidden ? tk.danger : tk.text2,
              background: isHidden ? `${tk.danger}14` : tk.panel2,
              border: `1px solid ${isHidden ? tk.danger + '55' : tk.text2 + '22'}`,
            }}>{isHidden ? '◌ OCULTO' : '● VISIBLE'}</button>
        )}
        {badge && (
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            padding: '3px 8px', borderRadius: 3,
            color: badgeColor, background: badgeColor + '14',
            fontFamily: tk.fontMono,
          }}>{badge}</span>
        )}
        <span style={{
          fontSize: 17, color: tk.muted,
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s',
        }}>⌄</span>
      </div>
      {open && (
        <div style={{ padding: `4px 16px ${tk.pad.card}px`, borderTop: tk.hairline }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Image upload field ────────────────────────────────────────────────
// Cloudinary (sin firma) → URL corta compatible con GHL.
// Configurar: CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET abajo.
// Si no está configurado, guarda como base64 (funciona en preview,
// pero el usuario verá una advertencia antes de generar el HTML).
// Cloudinary config — set in Vercel env vars:
// VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET
// O editar directamente aquí para desarrollo local:
const CLOUDINARY_CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME    || '';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

const cloudinaryConfigured = () =>
  CLOUDINARY_CLOUD_NAME.trim() !== '' && CLOUDINARY_UPLOAD_PRESET.trim() !== '';

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  fd.append('folder', 'sensation-emails');
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd }
  );
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Cloudinary error ${res.status}${txt ? ': ' + txt.slice(0, 80) : ''}`);
  }
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  // URL corta + formato webp para mejor rendimiento
  return json.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
}

function ImageField({ k, label, hint, aspect = '4 / 3', data, set, tk }) {
  const v = data[k] || '';
  const isUrl    = v.startsWith('http');
  const isBase64 = v.startsWith('data:');

  const [drag, setDrag]         = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]  = useState(0);
  const [err, setErr]            = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErr('Solo se aceptan imágenes (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErr('La imagen es muy grande. Máximo 10 MB.');
      return;
    }
    setErr('');
    setUploading(true);
    setProgress(0);

    if (cloudinaryConfigured()) {
      // ── Cloudinary ──────────────────────────────────────────────────
      const timer = setInterval(() => setProgress(p => Math.min(p + 15, 88)), 250);
      try {
        const url = await uploadToCloudinary(file);
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => { set(k, url); setUploading(false); setProgress(0); }, 300);
      } catch (e) {
        clearInterval(timer);
        setErr(`Error al subir: ${e.message}. Intenta de nuevo.`);
        setUploading(false);
        setProgress(0);
      }
    } else {
      // ── Fallback: base64 local ───────────────────────────────────────
      // Funciona en preview. Al generar HTML se mostrará advertencia.
      const timer = setInterval(() => setProgress(p => Math.min(p + 20, 95)), 100);
      const reader = new FileReader();
      reader.onload = (e) => {
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => { set(k, e.target.result); setUploading(false); setProgress(0); }, 200);
      };
      reader.onerror = () => {
        clearInterval(timer);
        setErr('No se pudo leer el archivo.');
        setUploading(false);
        setProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={{ marginBottom: tk.pad.row }}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: tk.text2, fontFamily: tk.fontUi }}>
          {label}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {hint && <span style={{ fontSize: 11.5, color: tk.muted, fontFamily: tk.fontMono }}>{hint}</span>}
          {!cloudinaryConfigured() && (
            <span style={{ fontSize: 11, color: tk.gold, fontFamily: tk.fontMono, letterSpacing: 0.5,
              padding: '1px 6px', border: `1px solid ${tk.gold}55`, borderRadius: 3 }}>
              modo local
            </span>
          )}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && !isUrl && inputRef.current?.click()}
        style={{
          aspectRatio: aspect,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: tk.radiusSm,
          border: drag
            ? `2px dashed ${tk.gold}`
            : err
              ? `1.5px solid ${tk.danger}`
              : isUrl
                ? `1.5px solid ${tk.success}44`
                : isBase64
                  ? `1.5px solid ${tk.gold}66`
                  : tk.hairline,
          background: isUrl
            ? `center/cover no-repeat url(${v})`
            : isBase64
              ? `center/cover no-repeat url(${v})`
              : uploading
                ? tk.inputBg
                : drag ? `${tk.gold}08` : tk.inputBg,
          cursor: (isUrl || isBase64 || uploading) ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color .15s, background .15s',
        }}
      >
        {/* Estado vacío */}
        {!v && !uploading && (
          <div style={{ textAlign: 'center', padding: 16, pointerEvents: 'none' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: drag ? `${tk.gold}20` : tk.plumSoft,
              color: drag ? tk.gold : tk.plum,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 21, margin: '0 auto 10px', transition: 'all .15s',
            }}>
              {drag ? '↓' : '⬆'}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: tk.text, marginBottom: 4 }}>
              {drag ? 'Suelta aquí' : 'Toca para agregar foto'}
            </div>
            <div style={{ fontSize: 12.5, color: tk.muted, fontFamily: tk.fontMono }}>
              {cloudinaryConfigured()
                ? 'JPG · PNG · WEBP — se sube a Cloudinary'
                : 'JPG · PNG · WEBP — guardado local'}
            </div>
          </div>
        )}

        {/* Subiendo */}
        {uploading && (
          <div style={{ textAlign: 'center', padding: 16, width: '80%' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: tk.plum, fontFamily: tk.fontUi, marginBottom: 14 }}>
              {cloudinaryConfigured() ? 'Subiendo imagen…' : 'Cargando imagen…'}
            </div>
            <div style={{ height: 4, borderRadius: 99, background: tk.inputBg, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: `linear-gradient(90deg, ${tk.plum}, ${tk.gold})`,
                width: `${progress}%`, transition: 'width .25s ease',
              }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 12.5, color: tk.muted, fontFamily: tk.fontMono }}>
              {progress < 100 ? `${progress}%` : '✓ ¡Lista!'}
            </div>
          </div>
        )}

        {/* Imagen cargada */}
        {v && !uploading && (
          <>
            {/* Overlay inferior */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              padding: '0 8px 6px',
            }}>
              <span style={{ color: '#fff', fontFamily: tk.fontMono, fontSize: 11, letterSpacing: 0.8,
                display: 'flex', alignItems: 'center', gap: 4 }}>
                {isUrl ? (
                  <>
                    <span style={{ width: 5, height: 5, borderRadius: 99, background: tk.success,
                      display: 'inline-block', boxShadow: `0 0 0 2px ${tk.success}44` }} />
                    Lista para GHL
                  </>
                ) : (
                  <>
                    <span style={{ width: 5, height: 5, borderRadius: 99, background: tk.gold,
                      display: 'inline-block' }} />
                    Local · configura Cloudinary para GHL
                  </>
                )}
              </span>
              <div style={{ display: 'flex', gap: 5 }}>
                <button
                  onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
                  title="Cambiar imagen"
                  style={{
                    width: 26, height: 26, borderRadius: 5,
                    background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)',
                    color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer', fontSize: 14, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✎</button>
                <button
                  onClick={e => { e.stopPropagation(); set(k, ''); setErr(''); }}
                  title="Quitar imagen"
                  style={{
                    width: 26, height: 26, borderRadius: 5,
                    background: 'rgba(196,78,46,0.75)', backdropFilter: 'blur(4px)',
                    color: '#fff', border: '1px solid rgba(196,78,46,0.5)',
                    cursor: 'pointer', fontSize: 14, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✕</button>
              </div>
            </div>

            {/* Warning base64 */}
            {isBase64 && !cloudinaryConfigured() && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                background: 'rgba(201,162,76,0.92)', padding: '5px 10px',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ fontSize: 12.5, color: '#1a0e2e', fontFamily: tk.fontMono,
                  fontWeight: 700, letterSpacing: 0.5 }}>
                  ⚠ Configura Cloudinary para usar en GHL
                </span>
              </div>
            )}
          </>
        )}

        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden
          onChange={e => { handleFile(e.target.files[0]); e.target.value = ''; }} />
      </div>

      {/* URL directa — siempre visible debajo del drop zone */}
      {!isUrl && (
        <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
          <input
            type="url"
            placeholder="O pega una URL de imagen https://…"
            onBlur={e => {
              const u = e.target.value.trim();
              if (u.startsWith('http')) { set(k, u); setErr(''); e.target.value = ''; }
              else if (u) setErr('La URL debe comenzar con https://');
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const u = e.target.value.trim();
                if (u.startsWith('http')) { set(k, u); setErr(''); e.target.value = ''; }
                else if (u) setErr('La URL debe comenzar con https://');
              }
            }}
            style={{
              flex: 1, padding: '7px 10px', borderRadius: tk.radiusSm,
              border: tk.hairline, background: tk.inputBg,
              fontSize: 14, color: tk.text2, fontFamily: tk.fontMono,
              outline: 'none',
            }}
          />
        </div>
      )}

      {/* Error */}
      {err && (
        <div style={{
          marginTop: 6, padding: '7px 10px',
          background: `${tk.danger}12`, border: `1px solid ${tk.danger}44`,
          borderRadius: tk.radiusSm,
          fontSize: 14, color: tk.danger, fontFamily: tk.fontUi,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>⚠</span>
          <span style={{ flex: 1 }}>{err}</span>
          <button onClick={() => inputRef.current?.click()} style={{
            fontSize: 12.5, fontWeight: 700, color: tk.danger,
            background: 'none', border: 'none', cursor: 'pointer',
            textDecoration: 'underline', fontFamily: tk.fontUi, flexShrink: 0,
          }}>Intentar de nuevo</button>
        </div>
      )}

      {/* Configurar Cloudinary hint */}
      {!cloudinaryConfigured() && !v && (
        <div style={{
          marginTop: 5, fontSize: 11.5, color: tk.muted, fontFamily: tk.fontMono,
          lineHeight: 1.5,
        }}>
          Para URLs cortas compatibles con GHL: configura{' '}
          <span style={{ color: tk.gold }}>CLOUDINARY_CLOUD_NAME</span> y{' '}
          <span style={{ color: tk.gold }}>CLOUDINARY_UPLOAD_PRESET</span> en App.jsx
        </div>
      )}
    </div>
  );
}

// ── Lista dinámica (sin límite de items) ───────────────────────────────
function ItemCard({ idx, total, kind, listKey, item, fields, updateItem, removeItem, moveItem, tk }) {
  const [open, setOpen] = useState(true);
  const label = (item.title || item.name || `${kind} ${idx + 1}`);
  return (
    <div style={{
      background: tk.inputBg, border: tk.hairline,
      borderRadius: tk.radius, marginBottom: 8, overflow: 'hidden',
    }}>
      <div onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px', cursor: 'pointer', userSelect: 'none',
        background: tk.panel,
      }}>
        <span style={{
          fontFamily: tk.fontMono, fontSize: 12.5, fontWeight: 700,
          color: tk.muted, minWidth: 22,
        }}>{String(idx + 1).padStart(2, '0')}</span>
        <span style={{ flex: 1, fontSize: 15.5, fontWeight: 600, color: tk.text,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>
        <button disabled={idx === 0}
          onClick={e => { e.stopPropagation(); moveItem(listKey, idx, -1); }}
          style={{ background: 'none', border: 'none', color: tk.muted,
            cursor: idx === 0 ? 'not-allowed' : 'pointer',
            opacity: idx === 0 ? 0.3 : 1, fontSize: 15, padding: 2 }}>↑</button>
        <button disabled={idx === total - 1}
          onClick={e => { e.stopPropagation(); moveItem(listKey, idx, 1); }}
          style={{ background: 'none', border: 'none', color: tk.muted,
            cursor: idx === total - 1 ? 'not-allowed' : 'pointer',
            opacity: idx === total - 1 ? 0.3 : 1, fontSize: 15, padding: 2 }}>↓</button>
        <button onClick={e => { e.stopPropagation(); removeItem(listKey, idx); }}
          style={{ background: 'none', border: `1px solid ${tk.danger}44`,
            color: tk.danger, borderRadius: 4, padding: '2px 7px',
            fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>✕</button>
        <span style={{ fontSize: 15, color: tk.muted,
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>⌄</span>
      </div>
      {open && (
        <div style={{ padding: '10px 12px 4px', borderTop: tk.hairline }}>
          {fields.map(f => (
            f.type === 'image' ? (
              <ImageField key={f.k} k={f.k} label={f.label} hint={f.hint} aspect={f.aspect}
                data={item} set={(_, v) => updateItem(listKey, idx, f.k, v)} tk={tk} />
            ) : (
              <Field key={f.k} k={f.k} label={f.label} placeholder={f.placeholder}
                type={f.type} mono={f.mono}
                data={item} set={(_, v) => updateItem(listKey, idx, f.k, v)} tk={tk} />
            )
          ))}
        </div>
      )}
    </div>
  );
}

function ItemList({ items, kind, listKey, blank, fields, addItem, updateItem, removeItem, moveItem, tk }) {
  const plural = kind === 'evento' ? 'eventos'
    : kind === 'producto' ? 'productos'
    : 'capacitaciones';
  return (
    <>
      {items.length === 0 && (
        <div style={{
          padding: '18px 12px', textAlign: 'center', color: tk.text2,
          fontSize: 15, background: tk.inputBg, border: tk.hairline,
          borderRadius: tk.radiusSm, marginBottom: 8,
        }}>
          Aún no hay {plural}.<br/>
          <span style={{ fontSize: 13, color: tk.muted }}>
            Agrega cuantos necesites — la plantilla se acomoda sola.
          </span>
        </div>
      )}
      {items.map((it, i) => (
        <ItemCard key={i} idx={i} total={items.length}
          kind={kind} listKey={listKey} item={it} fields={fields}
          updateItem={updateItem} removeItem={removeItem} moveItem={moveItem} tk={tk} />
      ))}
      <button onClick={() => addItem(listKey, blank)} style={{
        width: '100%', padding: 11, background: 'none',
        border: `1.5px dashed ${tk.gold}66`, borderRadius: tk.radiusSm,
        color: tk.gold, fontSize: 15, fontWeight: 700, cursor: 'pointer',
        fontFamily: tk.fontUi, display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 8, letterSpacing: 0.3,
        transition: 'background .15s, border-color .15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = `${tk.gold}10`; e.currentTarget.style.borderColor = tk.gold; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = `${tk.gold}66`; }}
      >
        <span style={{ fontSize: 17, lineHeight: 1 }}>+</span>
        Agregar otro {kind}
        <span style={{
          fontFamily: tk.fontMono, fontSize: 11, color: tk.muted,
          padding: '1px 6px', border: `1px solid ${tk.muted}55`,
          borderRadius: 3, letterSpacing: 1, fontWeight: 600,
        }}>SIN LÍMITE</span>
      </button>
    </>
  );
}

// ── Contraseña de diseñadores (cambia esto) ───────────────────────────
const DESIGNER_PASS = 'sensation2026';

// ── Plantillas de ejemplo precargadas ────────────────────────────────
const PLANTILLAS_DEFAULT = [
  {
    id: 'tpl-boletin-moderna',
    nombre: 'Boletín Semanal — Moderna',
    descripcion: 'Diseño Jost moderno. Hero oscuro, botones dorados redondeados, tarjetas con sombra.',
    categoria: 'Boletín', thumbnail: '', activa: true, templateVersion: 'v3',
    campos: { heroLabel:'Boletín Semanal', heroTitle:'Ventas, retención &', heroAccent:'resultados', heroSub:'Semana — · Mes 2026', wTitle:'Hola Sensation Family', wP1:'Esta semana lanzamos una agenda cargada de oportunidades para llevar tu negocio al siguiente nivel.', wMotive:'¡Vamos por una semana extraordinaria!' },
    secciones: ['marca','hero','bien','eventos','productos','capacitacion','footer'],
  },
  {
    id: 'tpl-producto-moderna',
    nombre: 'Lanzamiento — Moderna',
    descripcion: 'Diseño Jost. Producto editorial grande, CTA dorado con sombra.',
    categoria: 'Producto', thumbnail: '', activa: true, templateVersion: 'v3',
    campos: { heroLabel:'Nuevo Lanzamiento', heroTitle:'Presentamos algo', heroAccent:'extraordinario', heroSub:'Disponible por tiempo limitado', wTitle:'Ya llegó lo que esperabas', wP1:'Hoy presentamos nuestro producto más esperado del año. Diseñado para elevar tu rutina y multiplicar tus resultados.', wMotive:'Sé de las primeras en tenerlo.' },
    secciones: ['marca','hero','bien','productos','footer'],
  },
  {
    id: 'tpl-evento-moderna',
    nombre: 'Evento — Moderna',
    descripcion: 'Diseño Jost. Tarjeta de evento con fecha dorada destacada y botón redondeado.',
    categoria: 'Evento', thumbnail: '', activa: true, templateVersion: 'v3',
    campos: { heroLabel:'Te invitamos', heroTitle:'Un evento que', heroAccent:'no puedes perderte', heroSub:'Fecha · Hora · Lugar', wTitle:'¡Reserva tu lugar ahora!', wP1:'Únete a nuestra comunidad en un evento diseñado para inspirarte, conectarte y llevar tu negocio al siguiente nivel.', wMotive:'Los cupos son limitados.' },
    secciones: ['marca','hero','bien','eventos','footer'],
  },
  {
    id: 'tpl-boletin-editorial',
    nombre: 'Boletín Semanal — Editorial',
    descripcion: 'Diseño Fraunces serif elegante. Fondo crema, estilo revista de lujo.',
    categoria: 'Boletín', thumbnail: '', activa: true, templateVersion: 'v1',
    campos: { heroLabel:'Boletín Semanal', heroTitle:'Ventas, retención &', heroAccent:'resultados', heroSub:'Semana — · Mes 2026', wTitle:'Hola Sensation Family', wP1:'Esta semana lanzamos una agenda cargada de oportunidades para llevar tu negocio al siguiente nivel.', wMotive:'¡Vamos por una semana extraordinaria!' },
    secciones: ['marca','hero','bien','eventos','productos','capacitacion','footer'],
  },
  {
    id: 'tpl-producto-editorial',
    nombre: 'Lanzamiento — Editorial',
    descripcion: 'Diseño Fraunces. Producto con precio en tipografía grande, fondo crema.',
    categoria: 'Producto', thumbnail: '', activa: true, templateVersion: 'v1',
    campos: { heroLabel:'Nuevo Lanzamiento', heroTitle:'Presentamos algo', heroAccent:'extraordinario', heroSub:'Disponible por tiempo limitado', wTitle:'Ya llegó lo que esperabas', wP1:'Hoy presentamos nuestro producto más esperado del año. Diseñado para elevar tu rutina y multiplicar tus resultados.', wMotive:'Sé de las primeras en tenerlo.' },
    secciones: ['marca','hero','bien','productos','footer'],
  },
  {
    id: 'tpl-evento-editorial',
    nombre: 'Evento — Editorial',
    descripcion: 'Diseño Fraunces. Fecha en dorado italic grande, fondo morado profundo.',
    categoria: 'Evento', thumbnail: '', activa: true, templateVersion: 'v1',
    campos: { heroLabel:'Te invitamos', heroTitle:'Un evento que', heroAccent:'no puedes perderte', heroSub:'Fecha · Hora · Lugar', wTitle:'¡Reserva tu lugar ahora!', wP1:'Únete a nuestra comunidad en un evento diseñado para inspirarte, conectarte y llevar tu negocio al siguiente nivel.', wMotive:'Los cupos son limitados.' },
    secciones: ['marca','hero','bien','eventos','footer'],
  },
];

// ── Vista de Plantillas ───────────────────────────────────────────────
function TemplatesView({ tk, onSelectTemplate }) {
  const [plantillas, setPlantillas] = React.useState(PLANTILLAS_DEFAULT);
  const [modo, setModo] = React.useState('galeria'); // 'galeria' | 'designer'
  const [passInput, setPassInput] = React.useState('');
  const [passErr, setPassErr] = React.useState('');
  const [designerOk, setDesignerOk] = React.useState(false);
  const [filtro, setFiltro] = React.useState('Todos');
  const [hoveredId, setHoveredId] = React.useState(null);

  // Nueva plantilla (panel diseñador)
  const [nueva, setNueva] = React.useState({
    nombre: '', descripcion: '', categoria: 'Boletín', thumbnail: '',
    campos: {
      heroLabel: '', heroTitle: '', heroAccent: '', heroSub: '',
      wTitle: '', wP1: '', wMotive: '',
    },
    secciones: ['marca', 'hero', 'bien', 'eventos', 'productos', 'capacitacion', 'footer'],
  });
  const [guardando, setGuardando] = React.useState(false);
  const [guardadoOk, setGuardadoOk] = React.useState(false);
  const thumbRef = React.useRef(null);

  // Cargar plantillas guardadas desde storage persistente
  React.useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get('plantillas');
        if (res?.value) {
          const guardadas = JSON.parse(res.value);
          setPlantillas([...PLANTILLAS_DEFAULT, ...guardadas]);
        }
      } catch (_) { /* primera vez, sin datos */ }
    })();
  }, []);

  const guardarPlantilla = async () => {
    if (!nueva.nombre.trim()) return;
    setGuardando(true);
    const nuevaConId = { ...nueva, id: `tpl-${Date.now()}`, activa: true };
    const todasGuardadas = plantillas.filter(p => !PLANTILLAS_DEFAULT.find(d => d.id === p.id));
    const actualizadas = [...todasGuardadas, nuevaConId];
    try {
      await window.storage.set('plantillas', JSON.stringify(actualizadas));
      setPlantillas([...PLANTILLAS_DEFAULT, ...actualizadas]);
      setNueva({
        nombre: '', descripcion: '', categoria: 'Boletín', thumbnail: '',
        campos: { heroLabel: '', heroTitle: '', heroAccent: '', heroSub: '', wTitle: '', wP1: '', wMotive: '' },
        secciones: ['marca', 'hero', 'bien', 'eventos', 'productos', 'capacitacion', 'footer'],
      });
      setGuardadoOk(true);
      setTimeout(() => setGuardadoOk(false), 3000);
    } catch (e) {
      alert('Error al guardar. Intenta de nuevo.');
    }
    setGuardando(false);
  };

  const eliminarPlantilla = async (id) => {
    if (!window.confirm('¿Eliminar esta plantilla?')) return;
    const guardadas = plantillas.filter(p => !PLANTILLAS_DEFAULT.find(d => d.id === p.id) && p.id !== id);
    await window.storage.set('plantillas', JSON.stringify(guardadas));
    setPlantillas([...PLANTILLAS_DEFAULT, ...guardadas]);
  };

  const handleThumb = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = e => setNueva(n => ({ ...n, thumbnail: e.target.result }));
    r.readAsDataURL(file);
  };

  const categorias = ['Todos', ...Array.from(new Set(plantillas.map(p => p.categoria)))];
  const filtradas = filtro === 'Todos' ? plantillas : plantillas.filter(p => p.categoria === filtro);

  const CATEGORIA_COLOR = {
    'Boletín': tk.plum,
    'Producto': '#1a7a4a',
    'Evento': '#b87020',
  };

  // ── Panel de acceso diseñador ────────────────────────────────────────
  if (modo === 'designer' && !designerOk) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: tk.previewBg,
      }}>
        <div style={{
          width: 340, background: tk.panel, borderRadius: 12, padding: '32px 28px',
          border: tk.hairline, boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: tk.plumSoft,
            color: tk.plum, fontSize: 25, display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
          }}>🔒</div>
          <div style={{ fontFamily: tk.fontDisplay, fontSize: 23, fontWeight: 600, color: tk.text, marginBottom: 6 }}>
            Área de Diseñadores
          </div>
          <div style={{ fontSize: 15, color: tk.text2, marginBottom: 24, lineHeight: 1.5 }}>
            Esta sección es solo para el equipo de diseño.<br />Ingresa la contraseña para continuar.
          </div>
          <input
            type="password"
            value={passInput}
            onChange={e => { setPassInput(e.target.value); setPassErr(''); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (passInput === DESIGNER_PASS) { setDesignerOk(true); setPassErr(''); }
                else setPassErr('Contraseña incorrecta.');
              }
            }}
            placeholder="Contraseña"
            autoFocus
            style={{
              width: '100%', padding: '11px 14px', borderRadius: tk.radiusSm,
              border: passErr ? `1.5px solid ${tk.danger}` : tk.hairline,
              background: tk.inputBg, fontSize: 17, color: tk.text,
              fontFamily: tk.fontUi, outline: 'none', marginBottom: 8,
              boxSizing: 'border-box',
            }}
          />
          {passErr && <div style={{ fontSize: 14, color: tk.danger, marginBottom: 10 }}>{passErr}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => setModo('galeria')} style={{
              flex: 1, padding: '10px', fontSize: 15, fontWeight: 600,
              color: tk.text2, background: tk.panel2, border: tk.hairline,
              borderRadius: tk.radiusSm, cursor: 'pointer', fontFamily: tk.fontUi,
            }}>Cancelar</button>
            <button onClick={() => {
              if (passInput === DESIGNER_PASS) { setDesignerOk(true); setPassErr(''); }
              else setPassErr('Contraseña incorrecta.');
            }} style={{
              flex: 1, padding: '10px', fontSize: 15, fontWeight: 700,
              color: '#fff', background: tk.plum, border: 'none',
              borderRadius: tk.radiusSm, cursor: 'pointer', fontFamily: tk.fontUi,
            }}>Entrar</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Panel diseñador (autenticado) ────────────────────────────────────
  if (modo === 'designer' && designerOk) {
    const SECCIONES_OPT = [
      { id: 'bien', l: 'Bienvenida' }, { id: 'eventos', l: 'Eventos' },
      { id: 'productos', l: 'Productos' }, { id: 'capacitacion', l: 'Capacitación' },
    ];
    const toggleSeccion = (id) => setNueva(n => ({
      ...n,
      secciones: n.secciones.includes(id)
        ? n.secciones.filter(s => s !== id)
        : [...n.secciones, id],
    }));

    return (
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: tk.previewBg }}>
        {/* Lista de plantillas existentes */}
        <div style={{
          width: 280, borderRight: tk.hairline, background: tk.panel,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 18px 12px', borderBottom: tk.hairline }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 2, color: tk.muted, fontFamily: tk.fontMono }}>
              PLANTILLAS GUARDADAS
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {plantillas.map(p => (
              <div key={p.id} style={{
                padding: '10px 12px', borderRadius: tk.radiusSm,
                border: tk.hairline, marginBottom: 6,
                background: tk.panel2, display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: tk.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</div>
                  <div style={{ fontSize: 12.5, color: tk.muted, fontFamily: tk.fontMono, marginTop: 2 }}>{p.categoria}</div>
                </div>
                {!PLANTILLAS_DEFAULT.find(d => d.id === p.id) && (
                  <button onClick={() => eliminarPlantilla(p.id)} style={{
                    width: 22, height: 22, borderRadius: 4,
                    background: `${tk.danger}14`, color: tk.danger,
                    border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>✕</button>
                )}
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 18px', borderTop: tk.hairline }}>
            <button onClick={() => { setDesignerOk(false); setPassInput(''); setModo('galeria'); }} style={{
              width: '100%', padding: '9px', fontSize: 14.5, fontWeight: 600,
              color: tk.text2, background: 'none', border: tk.hairline,
              borderRadius: tk.radiusSm, cursor: 'pointer', fontFamily: tk.fontUi,
            }}>← Volver a galería</button>
          </div>
        </div>

        {/* Form nueva plantilla */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <div style={{
            fontFamily: tk.fontDisplay, fontSize: 25, fontWeight: 600,
            color: tk.text, marginBottom: 4,
          }}>Nueva plantilla</div>
          <div style={{ fontSize: 15, color: tk.text2, marginBottom: 24, lineHeight: 1.5 }}>
            Define los campos y secciones que verán los usuarios de ventas al seleccionar esta plantilla.
          </div>

          {/* Fila info básica */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: tk.text2, marginBottom: 5, fontFamily: tk.fontUi }}>
                Nombre de la plantilla *
              </label>
              <input value={nueva.nombre} onChange={e => setNueva(n => ({ ...n, nombre: e.target.value }))}
                placeholder="Ej: Boletín Premium" style={{
                  width: '100%', padding: '9px 11px', borderRadius: tk.radiusSm,
                  border: tk.hairline, background: tk.inputBg, fontSize: 16,
                  color: tk.text, fontFamily: tk.fontUi, outline: 'none', boxSizing: 'border-box',
                }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: tk.text2, marginBottom: 5, fontFamily: tk.fontUi }}>
                Categoría
              </label>
              <select value={nueva.categoria} onChange={e => setNueva(n => ({ ...n, categoria: e.target.value }))}
                style={{
                  width: '100%', padding: '9px 11px', borderRadius: tk.radiusSm,
                  border: tk.hairline, background: tk.inputBg, fontSize: 16,
                  color: tk.text, fontFamily: tk.fontUi, outline: 'none', boxSizing: 'border-box',
                }}>
                {['Boletín', 'Producto', 'Evento', 'Capacitación', 'Especial'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: tk.text2, marginBottom: 5, fontFamily: tk.fontUi }}>
              Descripción breve
            </label>
            <input value={nueva.descripcion} onChange={e => setNueva(n => ({ ...n, descripcion: e.target.value }))}
              placeholder="¿Para qué sirve esta plantilla?" style={{
                width: '100%', padding: '9px 11px', borderRadius: tk.radiusSm,
                border: tk.hairline, background: tk.inputBg, fontSize: 16,
                color: tk.text, fontFamily: tk.fontUi, outline: 'none', boxSizing: 'border-box',
              }} />
          </div>

          {/* Thumbnail */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: tk.text2, marginBottom: 5, fontFamily: tk.fontUi }}>
              Imagen de vista previa
            </label>
            <div onClick={() => thumbRef.current?.click()} style={{
              height: 120, borderRadius: tk.radiusSm, border: tk.hairline,
              background: nueva.thumbnail ? `center/cover no-repeat url(${nueva.thumbnail})` : tk.inputBg,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {!nueva.thumbnail && (
                <div style={{ textAlign: 'center', color: tk.muted, fontSize: 14 }}>
                  <div style={{ fontSize: 23, marginBottom: 4 }}>🖼</div>
                  Click para subir un screenshot de la plantilla
                </div>
              )}
            </div>
            <input ref={thumbRef} type="file" hidden accept="image/*" onChange={e => handleThumb(e.target.files[0])} />
          </div>

          {/* Secciones */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: tk.text2, marginBottom: 8, fontFamily: tk.fontUi }}>
              Secciones activas en esta plantilla
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SECCIONES_OPT.map(s => {
                const on = nueva.secciones.includes(s.id);
                return (
                  <button key={s.id} onClick={() => toggleSeccion(s.id)} style={{
                    padding: '6px 14px', borderRadius: 99, fontSize: 14.5, fontWeight: 600,
                    cursor: 'pointer', fontFamily: tk.fontUi,
                    color: on ? '#fff' : tk.text2,
                    background: on ? tk.plum : tk.inputBg,
                    border: on ? 'none' : tk.hairline,
                    transition: 'all .12s',
                  }}>{on ? '✓ ' : ''}{s.l}</button>
                );
              })}
            </div>
          </div>

          {/* Campos pre-llenados */}
          <div style={{
            background: tk.inputBg, borderRadius: tk.radius, padding: '16px 18px',
            border: tk.hairline, marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: tk.text, marginBottom: 12, fontFamily: tk.fontUi }}>
              Campos pre-configurados <span style={{ color: tk.muted, fontWeight: 500 }}>(el equipo de ventas puede editar estos valores)</span>
            </div>
            {[
              { k: 'heroLabel', l: 'Etiqueta del hero', ph: 'Boletín Semanal' },
              { k: 'heroTitle', l: 'Título H1', ph: 'Tu titular principal &' },
              { k: 'heroAccent', l: 'Palabra en dorado', ph: 'resultados' },
              { k: 'heroSub', l: 'Subtítulo', ph: 'Semana — · Mes 2026' },
              { k: 'wTitle', l: 'Título bienvenida', ph: 'Hola Sensation Family' },
              { k: 'wP1', l: 'Párrafo bienvenida', ph: 'Esta semana…' },
              { k: 'wMotive', l: 'Frase motivacional', ph: '¡Vamos por una semana extraordinaria!' },
            ].map(f => (
              <div key={f.k} style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: tk.muted, marginBottom: 4, fontFamily: tk.fontUi }}>{f.l}</label>
                <input value={nueva.campos[f.k] || ''} onChange={e => setNueva(n => ({ ...n, campos: { ...n.campos, [f.k]: e.target.value } }))}
                  placeholder={f.ph} style={{
                    width: '100%', padding: '8px 10px', borderRadius: tk.radiusSm,
                    border: tk.hairline, background: tk.panel, fontSize: 15,
                    color: tk.text, fontFamily: tk.fontUi, outline: 'none', boxSizing: 'border-box',
                  }} />
              </div>
            ))}
          </div>

          {/* Guardar */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={guardarPlantilla} disabled={!nueva.nombre.trim() || guardando} style={{
              padding: '12px 28px', fontSize: 15.5, fontWeight: 700, letterSpacing: 1.5,
              textTransform: 'uppercase', color: '#fff',
              background: nueva.nombre.trim() ? tk.plum : tk.muted,
              border: 'none', borderRadius: tk.radiusSm, cursor: nueva.nombre.trim() ? 'pointer' : 'not-allowed',
              fontFamily: tk.fontUi,
            }}>{guardando ? 'Guardando…' : '✦ Publicar plantilla'}</button>
            {guardadoOk && (
              <span style={{ fontSize: 15, color: tk.success, fontWeight: 600, fontFamily: tk.fontUi }}>
                ✓ Plantilla publicada correctamente
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Galería (vista ventas) ────────────────────────────────────────────
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: tk.previewBg }}>
      {/* Header galería */}
      <div style={{
        padding: '20px 32px 16px', background: tk.panel, borderBottom: tk.hairline,
        display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: tk.fontDisplay, fontSize: 23, fontWeight: 600, color: tk.text }}>
            Plantillas
          </div>
          <div style={{ fontSize: 15, color: tk.text2, marginTop: 2 }}>
            Elige una plantilla y el editor se abre listo para llenar.
          </div>
        </div>
        {/* Filtros */}
        <div style={{ display: 'flex', gap: 6 }}>
          {categorias.map(c => (
            <button key={c} onClick={() => setFiltro(c)} style={{
              padding: '6px 14px', borderRadius: 99, fontSize: 14.5, fontWeight: 600,
              cursor: 'pointer', fontFamily: tk.fontUi,
              color: filtro === c ? '#fff' : tk.text2,
              background: filtro === c ? tk.plum : tk.panel2,
              border: filtro === c ? 'none' : tk.hairline,
              transition: 'all .12s',
            }}>{c}</button>
          ))}
        </div>
        {/* Botón diseñador */}
        <button onClick={() => setModo('designer')} style={{
          padding: '7px 14px', fontSize: 14, fontWeight: 600,
          color: tk.muted, background: 'none', border: tk.hairline,
          borderRadius: tk.radiusSm, cursor: 'pointer', fontFamily: tk.fontUi,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>✎</span> Área diseñadores
        </button>
      </div>

      {/* Grid de cards */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '24px 32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 20, alignContent: 'start',
      }}>
        {filtradas.map(p => {
          const catColor = CATEGORIA_COLOR[p.categoria] || tk.plum;
          const isHovered = hoveredId === p.id;
          return (
            <div
              key={p.id}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: tk.panel, borderRadius: 12,
                border: isHovered ? `1.5px solid ${tk.plum}` : tk.hairline,
                overflow: 'hidden', cursor: 'pointer',
                boxShadow: isHovered
                  ? `0 8px 28px rgba(91,46,145,0.15)`
                  : '0 1px 4px rgba(0,0,0,0.05)',
                transform: isHovered ? 'translateY(-2px)' : 'none',
                transition: 'all .18s cubic-bezier(.3,.7,.4,1)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Thumbnail */}
              <div style={{
                height: 160, position: 'relative', overflow: 'hidden',
                background: p.thumbnail
                  ? `center/cover no-repeat url(${p.thumbnail})`
                  : `linear-gradient(135deg, ${catColor}18 0%, ${catColor}08 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {!p.thumbnail && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: 36, marginBottom: 8,
                      filter: 'grayscale(0.3)',
                    }}>
                      {p.categoria === 'Boletín' ? '📰' : p.categoria === 'Producto' ? '🛍' : '🎯'}
                    </div>
                    <div style={{ fontSize: 12.5, color: catColor, fontFamily: tk.fontMono, letterSpacing: 2, fontWeight: 700 }}>
                      {p.categoria.toUpperCase()}
                    </div>
                  </div>
                )}
                {/* Badge categoría */}
                <div style={{
                  position: 'absolute', top: 10, left: 10,
                  padding: '3px 10px', borderRadius: 99,
                  background: catColor, color: '#fff',
                  fontSize: 11.5, fontWeight: 700, letterSpacing: 1.5,
                  fontFamily: tk.fontMono,
                }}>{p.categoria.toUpperCase()}</div>

                {/* Overlay al hover con botón */}
                {isHovered && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(10,5,20,0.55)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <button
                      onClick={() => onSelectTemplate(p)}
                      style={{
                        padding: '11px 28px', fontSize: 15.5, fontWeight: 700,
                        letterSpacing: 1.5, textTransform: 'uppercase',
                        color: '#1a0e2e',
                        background: 'linear-gradient(180deg, #d4b25a 0%, #b8882a 100%)',
                        border: 'none', borderRadius: 8, cursor: 'pointer',
                        fontFamily: tk.fontUi,
                        boxShadow: '0 4px 18px rgba(201,162,76,0.4)',
                      }}
                    >
                      Usar esta plantilla
                    </button>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '14px 16px 16px', flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: tk.text, marginBottom: 4, fontFamily: tk.fontUi }}>
                  {p.nombre}
                </div>
                <div style={{ fontSize: 14.5, color: tk.text2, lineHeight: 1.55 }}>
                  {p.descripcion}
                </div>
                {/* Secciones como pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
                  {p.secciones.filter(s => !['marca', 'footer'].includes(s)).map(s => (
                    <span key={s} style={{
                      padding: '2px 8px', borderRadius: 99,
                      background: tk.inputBg, border: tk.hairline,
                      fontSize: 11.5, color: tk.muted, fontFamily: tk.fontMono,
                    }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Footer card */}
              <div style={{
                padding: '10px 16px', borderTop: tk.hairline,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 12.5, color: tk.muted, fontFamily: tk.fontMono }}>
                  {p.secciones.filter(s => !['marca', 'footer'].includes(s)).length} secciones
                </span>
                <button
                  onClick={() => onSelectTemplate(p)}
                  style={{
                    padding: '5px 14px', fontSize: 14, fontWeight: 700,
                    color: tk.plum, background: tk.plumSoft,
                    border: `1px solid ${tk.plum}33`, borderRadius: 6,
                    cursor: 'pointer', fontFamily: tk.fontUi,
                    transition: 'all .12s',
                  }}
                >Usar →</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────
function EditorApp() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const tk = tokens(tw);

  const [data, setData] = useState({
    brandName: 'Sensation Brands',
    colorMain: '#5B2E91',
    colorAccent: '#C9A24C',
    mainLink: 'https://sensationbrands.com',
    logoImg: '',
    weekNum: '14',
    weekMonth: 'ABRIL · 2026',
    heroLabel: 'Boletín Semanal',
    heroTitle: 'Ventas, retención &',
    heroAccent: 'resultados',
    heroSub: 'Semana 14 · Abril 13 al 19, 2026',
    heroBanner: '',
    wTitle: 'Hola Sensation Family',
    wP1: 'Esta semana lanzamos una agenda cargada de oportunidades para llevar tu negocio al siguiente nivel. Cada lanzamiento, capacitación y promoción está pensado para multiplicar tus resultados.',
    wP2: 'Recuerda que cada acción que tomes hoy se refleja en los números de tu próximo cierre. Aprovecha cada recurso y mantente conectada con tu equipo.',
    wMotive: '¡Vamos por una semana extraordinaria!',
    prodSecTitle: 'Especial · Belleza',
    eventos: [
      { title: 'Webinar · Cierra ventas en 7 minutos', date: 'Mié 16 abril · 7:00 PM CDMX', desc: 'Aprende el guion exacto que usan nuestras top sellers para convertir leads fríos en compras el mismo día.', cta: 'Reservar lugar', link: 'https://eventos.sensationbrands.com/webinar' },
      { title: 'Live de bienvenida nuevas socias', date: 'Vie 18 abril · 6:00 PM CDMX', desc: 'Conoce a tu mentora, recibe tu kit digital y arranca con el pie derecho tus primeros 30 días.', cta: 'Apuntarme', link: 'https://eventos.sensationbrands.com/live' },
    ],
    productos: [
      { name: 'Sérum revitalizante Glow24', sub: 'Edición limitada · 30 ml', price: '$48 USD', img: '', cta: 'Comprar', link: 'https://shop.sensationbrands.com/glow24' },
      { name: 'Mascarilla Vitamina C', sub: 'Pack 3 unidades', price: '$36 USD', img: '', cta: 'Comprar', link: 'https://shop.sensationbrands.com/vitc' },
      { name: 'Labial Lumière Matte', sub: 'Tono Bordeaux · Long lasting', price: '$22 USD', img: '', cta: 'Comprar', link: 'https://shop.sensationbrands.com/lumiere' },
    ],
    capacitaciones: [
      { title: '¿Qué aprenderás esta semana?', desc: 'Las herramientas y estrategias que necesitas para llevar tu marca al siguiente nivel. Tres sesiones en vivo + material descargable.', week: 'Semana 14', dates: 'Abril 13 — 19', img: '', cta: 'Ver agenda', link: 'https://academy.sensationbrands.com/s14' },
    ],
    footerYear: '2026',
    // estilos editables del email
    sizeH1:   36,
    sizeH2:   26,
    sizeBody: 13,
    sizeEyebrow: 9,
    colorTitle:   '#1F0F3D',
    colorBody:    '#4a3f54',
    colorEyebrow: '#C9A24C',
    colorHeroBg:  '#1F0F3D',
    colorHeroText:'#ffffff',
  });

  // helpers para listas dinámicas (sin límite)
  const addItem = (key, blank) => setData(d => ({ ...d, [key]: [...(d[key] || []), blank] }));
  const updateItem = (key, idx, field, value) => setData(d => ({
    ...d,
    [key]: d[key].map((it, i) => i === idx ? { ...it, [field]: value } : it),
  }));
  const removeItem = (key, idx) => setData(d => ({
    ...d,
    [key]: d[key].filter((_, i) => i !== idx),
  }));
  const moveItem = (key, idx, dir) => setData(d => {
    const arr = [...d[key]];
    const ni = idx + dir;
    if (ni < 0 || ni >= arr.length) return d;
    [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
    return { ...d, [key]: arr };
  });

  // sincroniza accent del tweak con preview
  React.useEffect(() => {
    setData(d => ({ ...d, colorAccent: tw.accent }));
  }, [tw.accent]);

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const [openState, setOpenState] = useState({
    marca: true, hero: true, bien: false,
    eventos: false, productos: false, capacitacion: false, footer: false,
  });

  const [hiddenSections, setHiddenSections] = useState({});
  const toggleHide = id => setHiddenSections(h => ({ ...h, [id]: !h[id] }));

  const [tab, setTab] = useState('plantillas');
  const [device, setDevice] = useState('desktop');
  const [activeTemplate, setActiveTemplate] = useState('v3');

  // Cuando ventas elige una plantilla → precarga datos y va al editor
  const handleSelectTemplate = (plantilla) => {
    setData(d => ({ ...d, ...plantilla.campos }));
    // Activar/desactivar secciones según la plantilla
    const seccionesActivas = plantilla.secciones || [];
    setHiddenSections({
      bien:          !seccionesActivas.includes('bien'),
      eventos:       !seccionesActivas.includes('eventos'),
      productos:     !seccionesActivas.includes('productos'),
      capacitacion:  !seccionesActivas.includes('capacitacion'),
    });
    setActiveTemplate(plantilla.templateVersion || 'v3');
    setTab('crear');
    showToast(`✦ Plantilla "${plantilla.nombre}" cargada — completa los datos`);
  };
  // validación
  const required = ['brandName', 'heroTitle', 'wP1'];
  const filledRequired = required.filter(k => data[k]?.trim()).length;
  const valid = filledRequired === required.length;

  // ── Estado notificaciones ────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Estado IA import ─────────────────────────────────────────────────
  const [iaLoading, setIaLoading] = useState(false);

  // ── Generar HTML del email ───────────────────────────────────────────
  const generateEmailHTMLV1 = () => {
    // Nunca incrustar base64 en el HTML — GHL falla con strings largos.
    // Si el valor empieza con "data:", se reemplaza por string vacío.
    const safeUrl = (v) => (v && v.startsWith('http') ? v : '');
    const gold = data.colorAccent || '#C9A24C';
    const plum = data.colorMain || '#5B2E91';
    const plumDeep = '#1F0F3D';
    const cream = '#f4ede0';
    const creamSoft = '#faf5ea';
    const ink = '#1a0e2e';
    const cTitle = data.colorTitle || plumDeep;
    const cBody = data.colorBody || '#4a3f54';
    const cEyebrow = data.colorEyebrow || gold;
    const cHeroTx = data.colorHeroText || '#ffffff';
    const cHeroBg = data.colorHeroBg || plumDeep;
    const sH1 = data.sizeH1 || 36;
    const sH2 = data.sizeH2 || 26;
    const sBody = data.sizeBody || 13;
    const sEye = data.sizeEyebrow || 9;

    const hidden = hiddenSections;

    const eyebrowRow = (label) =>
      `<div style="font-size:${sEye}px;letter-spacing:4px;text-transform:uppercase;color:${cEyebrow};font-weight:800;margin-bottom:14px;text-align:center;">· ${label} ·</div>`;

    const goldBtn = (label) =>
      `<div style="display:inline-block;padding:12px 32px;background:${gold};color:${plumDeep};font-size:10.5px;letter-spacing:2.5px;text-transform:uppercase;font-weight:800;font-family:'Inter Tight',sans-serif;">${label}</div>`;

    const productosHTML = !hidden.productos && data.productos && data.productos.length > 0 ? `
      <div style="background:${cream};padding:24px 36px 8px;text-align:center;">
        ${eyebrowRow(data.prodSecTitle || 'Especial · Belleza')}
        <h3 style="font-family:'Fraunces',serif;font-size:24px;color:${plum};font-weight:500;margin:0 0 4px;">${data.productos[0].name || ''}</h3>
        <div style="font-size:10.5px;color:#7a6e8a;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;">${data.productos[0].sub || ''}</div>
      </div>
      <div style="background:${cream};padding:12px 36px 28px;">
        ${safeUrl(data.productos[0].img)
          ? `<img src="${safeUrl(data.productos[0].img)}" alt="" style="width:100%;height:360px;object-fit:cover;display:block;">`
          : `<div style="width:100%;height:300px;background:#efe0c2;display:flex;align-items:center;justify-content:center;font-size:10px;color:#8a7556;letter-spacing:2px;">IMAGEN DEL PRODUCTO</div>`}
        <div style="text-align:center;margin-top:22px;">${goldBtn(data.productos[0].cta || 'Adquiérelo ahora')}</div>
      </div>
      ${data.productos.length > 1 ? `
      <div style="background:${cream};padding:0 36px 32px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          ${data.productos.slice(1).map(p => `
          <div style="background:#fff;overflow:hidden;">
            ${safeUrl(p.img) ? `<img src="${safeUrl(p.img)}" alt="" style="width:100%;height:130px;object-fit:cover;display:block;">` : `<div style="height:130px;background:#efe0c2;"></div>`}
            <div style="padding:12px 14px;text-align:center;">
              <div style="font-family:'Fraunces',serif;font-size:13.5px;color:${plum};font-weight:500;">${p.name || ''}</div>
              <div style="font-size:9.5px;color:${gold};margin-top:4px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">${p.price || ''}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>` : ''}
    ` : '';

    const eventosHTML = !hidden.eventos && data.eventos && data.eventos.length > 0
      ? data.eventos.map(ev => `
      <div style="background:${plumDeep};color:#fff;">
        <div style="padding:32px 36px 24px;text-align:center;">
          <div style="font-size:9px;letter-spacing:4px;color:${gold};font-weight:800;text-transform:uppercase;margin-bottom:10px;">· Reclutamiento Semanal ·</div>
          <div style="font-family:'Fraunces',serif;font-size:22px;font-weight:500;line-height:1.25;">${ev.title || ''}</div>
        </div>
        ${safeUrl(ev.img) ? `<img src="${safeUrl(ev.img)}" alt="" style="width:100%;height:220px;object-fit:cover;display:block;">` : `<div style="height:200px;background:#2a1a4e;display:flex;align-items:center;justify-content:center;color:${gold};font-size:10px;letter-spacing:3px;">IMAGEN DEL EVENTO</div>`}
        <div style="padding:24px 36px 32px;text-align:center;">
          <div style="font-family:'Fraunces',serif;font-size:26px;color:${gold};font-weight:600;font-style:italic;letter-spacing:1px;margin-bottom:4px;">${(ev.date || '').toUpperCase()}</div>
          <p style="font-size:12px;line-height:1.7;color:#d6cae8;margin:0 auto 20px;max-width:380px;">${ev.desc || ''}</p>
          ${goldBtn(ev.cta || 'Reservar lugar')}
        </div>
      </div>`).join('') : '';

    const capacitacionesHTML = !hidden.capacitacion && data.capacitaciones && data.capacitaciones.length > 0
      ? data.capacitaciones.map(c => `
      <div style="background:${creamSoft};padding:36px 36px 32px;text-align:center;">
        ${eyebrowRow('Capacitación')}
        <h3 style="font-family:'Fraunces',serif;font-size:22px;color:${plum};font-weight:500;margin:0 0 18px;line-height:1.25;">${c.title || ''}</h3>
        <p style="font-size:12.5px;line-height:1.7;color:#4a3f54;margin:0 auto 20px;max-width:420px;">${c.desc || ''}</p>
        ${safeUrl(c.img) ? `<img src="${safeUrl(c.img)}" alt="" style="width:100%;height:240px;object-fit:cover;display:block;">` : `<div style="height:180px;background:#e8e0d0;display:flex;align-items:center;justify-content:center;color:#8a7a6a;font-size:10px;letter-spacing:3px;">IMAGEN CAPACITACIÓN</div>`}
        ${c.cta ? `<div style="margin-top:22px;">${goldBtn(c.cta)}</div>` : ''}
      </div>`).join('') : '';

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.brandName || 'Boletín'} · Semana ${data.weekNum || ''}</title>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#ece4d2;">
<center>
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;background:${cream};font-family:'Plus Jakarta Sans',system-ui,sans-serif;">

  <!-- Header -->
  <tr><td style="background:${cream};padding:22px 0 16px;text-align:center;border-bottom:1px solid ${plum}15;">
    ${safeUrl(data.logoImg) ? `<img src="${safeUrl(data.logoImg)}" alt="${data.brandName}" style="height:56px;max-width:200px;object-fit:contain;display:inline-block;">` : `<div style="display:inline-block;font-family:'Fraunces',serif;font-size:22px;color:${plum};font-weight:600;">${data.brandName || 'Sensation Brands'}</div>`}
    <div style="margin-top:10px;font-size:9.5px;letter-spacing:3.5px;color:${plum};font-family:'Fraunces',serif;font-style:italic;opacity:0.7;">${data.weekNum || ''} · ${data.weekMonth || ''}</div>
  </td></tr>

  <!-- Hero -->
  <tr><td style="background:${cHeroBg};color:${cHeroTx};">
    ${safeUrl(data.heroBanner) ? `<img src="${safeUrl(data.heroBanner)}" alt="banner" style="width:100%;height:320px;object-fit:cover;display:block;">` : `<div style="height:280px;background:${cHeroBg};background-image:repeating-linear-gradient(45deg,${gold}22 0 14px,${plumDeep} 14px 28px);display:flex;align-items:center;justify-content:center;color:${gold};font-size:10px;letter-spacing:3px;font-family:monospace;">BANNER DEL HERO · 1200×600</div>`}
    <div style="padding:28px 30px 32px;">
      <div style="font-size:${sEye}px;letter-spacing:4px;text-transform:uppercase;color:${cEyebrow};font-weight:800;margin-bottom:10px;">· ${data.heroLabel || 'Boletín Semanal'} ·</div>
      <h1 style="font-family:'Fraunces',Georgia,serif;font-size:${sH1}px;line-height:1.1;margin:0;font-weight:500;color:${cHeroTx};letter-spacing:-0.01em;">
        ${data.heroTitle || ''}${data.heroAccent ? ` <em style="color:${gold};font-style:italic;">${data.heroAccent}</em>` : ''}
      </h1>
      ${data.heroSub ? `<div style="margin-top:14px;font-size:11px;letter-spacing:1.5px;color:#c8b8e0;text-transform:uppercase;font-weight:600;">${data.heroSub}</div>` : ''}
    </div>
  </td></tr>

  <!-- Bienvenida -->
  ${!hidden.bien ? `<tr><td style="background:${creamSoft};padding:38px 36px 32px;text-align:center;">
    ${eyebrowRow('Bienvenida')}
    <h2 style="font-family:'Fraunces',Georgia,serif;font-size:${sH2}px;font-weight:500;margin:0 0 16px;color:${cTitle};">${data.wTitle || ''}</h2>
    <p style="font-size:${sBody}px;line-height:1.75;color:${cBody};margin:0 auto;max-width:440px;">${data.wP1 || ''}</p>
    ${data.wP2 ? `<p style="font-size:${sBody}px;line-height:1.75;color:${cBody};margin:12px auto 0;max-width:440px;">${data.wP2}</p>` : ''}
    ${data.wMotive ? `<div style="margin-top:22px;font-family:'Fraunces',serif;font-style:italic;color:${gold};font-size:14px;">${data.wMotive}</div>` : ''}
  </td></tr>` : ''}

  <!-- Productos -->
  ${productosHTML ? `<tr><td>${productosHTML}</td></tr>` : ''}

  <!-- Eventos -->
  ${eventosHTML ? `<tr><td>${eventosHTML}</td></tr>` : ''}

  <!-- Capacitación -->
  ${capacitacionesHTML ? `<tr><td>${capacitacionesHTML}</td></tr>` : ''}

  <!-- Footer -->
  <tr><td style="padding:48px 36px 40px;background:${plumDeep};color:#a89bb8;text-align:center;font-size:10.5px;line-height:1.8;">
    ${safeUrl(data.logoImg) ? `<img src="${safeUrl(data.logoImg)}" alt="${data.brandName}" style="height:72px;max-width:200px;object-fit:contain;display:inline-block;margin-bottom:14px;"><br>` : ''}
    <div style="font-size:10.5px;letter-spacing:4px;color:${gold};font-weight:700;margin-bottom:24px;">${(data.brandName || 'SENSATION BRANDS').toUpperCase()} · BOLETÍN SEMANAL</div>
    <div style="font-size:11px;color:#c0b5d0;line-height:1.7;">Recibes este correo porque eres parte de la ${data.brandName || 'Sensation Family'}.</div>
    <div style="font-size:11px;color:#c0b5d0;line-height:1.7;margin-bottom:24px;">¿Ya no quieres recibir nuestros boletines? <a href="#" style="color:${gold};text-decoration:underline;">Darme de baja</a></div>
    <div style="font-size:10px;color:#7a6e8a;">© ${data.footerYear || '2026'} ${data.brandName || 'Sensation Brands'} · Todos los derechos reservados</div>
  </td></tr>

</table>
</center>
</body>
</html>`;
  };

  // ── Generar HTML V3 — Moderna (Jost) ─────────────────────────────────
  // ── Dispatcher ─────────────────────────────────────────────────────────
  const generateEmailHTML = () =>
    activeTemplate === 'v1' ? generateEmailHTMLV1() : generateEmailHTMLV3(data, hiddenSections);


  // ── Acciones de los botones ──────────────────────────────────────────
  const handleGenerar = () => {
    const html = generateEmailHTML();
    // Abre en nueva pestaña para previsualizar
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    showToast('✦ Email generado — se abrió en una nueva pestaña');
  };

  const handleDescargar = () => {
    const html = generateEmailHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(data.brandName || 'email').replace(/\s+/g, '-').toLowerCase()}-semana${data.weekNum || '00'}.html`;
    a.click();
    showToast('⬇ Archivo descargado correctamente');
  };

  const handleCopiar = () => {
    const html = generateEmailHTML();
    navigator.clipboard.writeText(html).then(() => {
      showToast('📋 HTML copiado al portapapeles');
    }).catch(() => {
      // fallback para entornos sin clipboard API
      const ta = document.createElement('textarea');
      ta.value = html;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('📋 HTML copiado al portapapeles');
    });
  };

  const [showCode, setShowCode] = useState(false);
  const handleVerCodigo = () => setShowCode(v => !v);

  // ── Importar con IA ──────────────────────────────────────────────────
  const iaFileRef = useRef(null);
  const handleIAFile = async (file) => {
    if (!file) return;
    setIaLoading(true);
    showToast('✦ Analizando archivo con IA…', 'loading');

    try {
      let textContent = '';

      if (file.type.startsWith('image/')) {
        // Imagen: leer como base64 y enviar a Claude
        const base64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = e => res(e.target.result.split(',')[1]);
          r.onerror = rej;
          r.readAsDataURL(file);
        });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: [
                { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
                { type: 'text', text: `Analiza esta imagen y extrae información para un boletín de email de marca. 
Responde SOLO con JSON sin markdown, con estos campos (deja vacío si no aplica):
{
  "brandName": "",
  "heroTitle": "",
  "heroAccent": "",
  "heroSub": "",
  "heroLabel": "",
  "wTitle": "",
  "wP1": "",
  "wP2": "",
  "wMotive": ""
}` }
              ]
            }]
          })
        });
        const result = await response.json();
        textContent = result.content?.[0]?.text || '{}';

      } else {
        // Texto/PDF: leer como texto
        textContent = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = e => res(e.target.result);
          r.onerror = rej;
          r.readAsText(file, 'utf-8');
        });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: `Analiza este texto y extrae información para un boletín de email de marca.
Texto: ${textContent.slice(0, 4000)}

Responde SOLO con JSON sin markdown, con estos campos (deja vacío si no aplica):
{
  "brandName": "",
  "heroTitle": "",
  "heroAccent": "",
  "heroSub": "",
  "heroLabel": "",
  "wTitle": "",
  "wP1": "",
  "wP2": "",
  "wMotive": ""
}`
            }]
          })
        });
        const result = await response.json();
        textContent = result.content?.[0]?.text || '{}';
      }

      // Limpiar posibles ```json fences
      const clean = textContent.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      // Solo setear los campos que tienen valor
      setData(d => {
        const updates = {};
        Object.entries(parsed).forEach(([k, v]) => {
          if (v && typeof v === 'string' && v.trim()) updates[k] = v;
        });
        return { ...d, ...updates };
      });
      showToast('✦ Formulario completado con IA');

    } catch (err) {
      console.error('IA import error:', err);
      showToast('⚠ Error al procesar el archivo', 'error');
    } finally {
      setIaLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: tk.bg, color: tk.text, fontFamily: tk.fontUi,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* TOPBAR */}
      <header style={{
        height: 58, flexShrink: 0, background: tk.panel,
        borderBottom: tk.hairline,
        display: 'flex', alignItems: 'center', padding: '0 22px', gap: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <img
            src={sensationLogoSrc}
            alt="Sensation Brands"
            style={{ height: 36, width: 'auto', objectFit: 'contain', display: 'block' }}
          />
          <div style={{
            fontFamily: tk.fontMono, fontSize: 11, color: tk.muted,
            letterSpacing: 2.5,
          }}>GMAIL · MARK · CREATE</div>
        </div>

        <div style={{ display: 'flex', gap: 0, marginLeft: 28, alignItems: 'stretch', height: 64 }}>
          {[{k: 'plantillas', l: '⊞ Plantillas'}, {k: 'crear', l: 'Crear'}, {k: 'hist', l: 'Historial'}].map(t => (
            <div key={t.k} onClick={() => setTab(t.k)}
              style={{
                padding: '0 18px', display: 'flex', alignItems: 'center',
                fontSize: 15.5, fontWeight: 600,
                color: tab === t.k ? tk.text : tk.text2,
                borderBottom: tab === t.k ? `2px solid ${tk.gold}` : '2px solid transparent',
                cursor: 'pointer',
              }}>{t.l}</div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { i: '◎', l: 'Clientes' },
            { i: '✎', l: 'Snippets' },
            { i: '✉', l: 'Asunto' },
          ].map(b => (
            <button key={b.l} style={{
              padding: '7px 12px', fontSize: 14.5, fontWeight: 600,
              color: tk.text2, background: 'none',
              border: tk.hairline, borderRadius: tk.radiusSm,
              display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              fontFamily: tk.fontUi,
            }}>
              <span style={{ color: tk.gold }}>{b.i}</span>{b.l}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '6px 12px', borderRadius: 99, background: tk.panel2,
          border: tk.hairline,
          fontSize: 14, color: tk.text2, fontWeight: 600,
          fontFamily: tk.fontMono,
        }}>
          <span style={{
            width: 6, height: 6, background: tk.success, borderRadius: 99,
            boxShadow: `0 0 0 3px ${tk.success}33`,
          }} />
          Ready
        </div>
      </header>

      {/* BODY */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── TAB: PLANTILLAS ─────────────────────────────────── */}
        {tab === 'plantillas' && (
          <TemplatesView tk={tk} onSelectTemplate={handleSelectTemplate} />
        )}

        {/* ── TAB: CREAR ──────────────────────────────────────── */}
        {tab === 'crear' && (<>
        {/* SIDEBAR */}
        <aside style={{
          width: 430, flexShrink: 0, background: tk.panel,
          borderRight: tk.hairline, display: 'flex', flexDirection: 'column',
        }}>
          {/* Eyebrow */}
          <div style={{
            padding: '20px 22px 14px', borderBottom: tk.hairline,
          }}>
            <div style={{
              fontFamily: tk.fontMono, fontSize: 12.5, letterSpacing: 3,
              color: tk.muted, fontWeight: 700,
            }}>FORMULARIO · SEMANA {data.weekNum || '—'}</div>
            <div style={{
              fontFamily: tk.fontDisplay, fontSize: 25, fontWeight: 600,
              color: tk.text, marginTop: 6, letterSpacing: '-0.02em',
            }}>Editor de boletines</div>
            <div style={{
              fontSize: 15, color: tk.text2, marginTop: 4, lineHeight: 1.55,
            }}>Llena los campos y la maqueta se actualiza en vivo.</div>
          </div>

          {/* Scroll */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 8px' }}>
            {/* IA utility */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', background: tk.panel2,
              border: tk.hairline, borderRadius: tk.radius, marginBottom: 8,
            }}>
              <span style={{
                width: 30, height: 30, borderRadius: 7,
                background: tk.plum, color: tk.gold, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 15,
                fontFamily: tk.fontDisplay, fontWeight: 700,
              }}>✦</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: tk.text }}>Importar con IA</div>
                <div style={{ fontSize: 13, color: tk.text2, marginTop: 1 }}>
                  PDF · Word · Imagen → llena el form solo
                </div>
              </div>
              <button onClick={() => iaFileRef.current?.click()} disabled={iaLoading} style={{
                padding: '6px 12px', fontSize: 13, fontWeight: 700,
                color: iaLoading ? tk.muted : tk.plum, background: 'none',
                border: `1px solid ${iaLoading ? tk.muted : tk.plum}55`, borderRadius: tk.radiusSm,
                letterSpacing: 1, cursor: iaLoading ? 'not-allowed' : 'pointer', fontFamily: tk.fontUi,
              }}>{iaLoading ? '…' : 'SUBIR'}</button>
              <input ref={iaFileRef} type="file" hidden accept=".pdf,.doc,.docx,image/*,.txt"
                onChange={e => handleIAFile(e.target.files[0])} />
            </div>

            <Section id="marca" icon="◆" title="Marca y colores" badge="REQUERIDO" openState={openState} setOpenState={setOpenState} tk={tk}>

              {/* ── Logo ── */}
              <ImageField k="logoImg" label="Logo de la marca" hint="PNG transparente · recomendado" aspect="3 / 1" data={data} set={set} tk={tk} />

              {/* ── Nombre ── */}
              <Field k="brandName" label="Nombre de la marca" required placeholder="Ej: Sensation Brands" data={data} set={set} tk={tk} />

              {/* ── Semana y fecha del header ── */}
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <Field k="weekNum" label="Número de semana" placeholder="14" data={data} set={set} tk={tk} />
                </div>
                <div style={{ flex: 2 }}>
                  <Field k="weekMonth" label="Mes · Año" placeholder="ABRIL · 2026" data={data} set={set} tk={tk} />
                </div>
              </div>

              {/* ── Header: semana + mes inline preview ── */}
              <div style={{
                background: tk.inputBg, borderRadius: tk.radiusSm,
                border: tk.hairline, padding: '10px 14px', marginBottom: tk.pad.row,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: tk.muted,
                  fontFamily: tk.fontMono, letterSpacing: 1.5, marginBottom: 10,
                  textTransform: 'uppercase' }}>
                  Vista previa del header
                </div>
                <div style={{
                  background: tk.panel, borderRadius: 6, padding: '10px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  border: tk.hairline,
                }}>
                  {/* Logo preview */}
                  <div style={{ height: 36, display: 'flex', alignItems: 'center' }}>
                    {data.logoImg && data.logoImg.startsWith('http')
                      ? <img src={data.logoImg} alt="logo"
                          style={{ height: 36, maxWidth: 120, objectFit: 'contain' }} />
                      : <div style={{
                          fontFamily: tk.fontDisplay, fontSize: 16,
                          color: data.colorMain || '#5B2E91', fontWeight: 600,
                        }}>{data.brandName || 'Sensation Brands'}</div>
                    }
                  </div>
                  {/* Semana/Mes preview */}
                  <div style={{
                    fontFamily: tk.fontMono, fontSize: 11,
                    color: data.colorMain || '#5B2E91',
                    letterSpacing: 3, fontWeight: 600,
                  }}>
                    {data.weekNum || '14'} · {(data.weekMonth || 'ABRIL · 2026').split('·')[0].trim()}
                  </div>
                </div>
              </div>

              {/* ── Colores ── */}
              <div style={{ display: 'flex', gap: 10 }}>
                <ColorField k="colorMain" label="Color principal" data={data} set={set} tk={tk} />
                <ColorField k="colorAccent" label="Color acento" data={data} set={set} tk={tk} />
              </div>
              <Field k="mainLink" label="Link principal" type="url" placeholder="https://…" mono data={data} set={set} tk={tk} />
            </Section>

            <Section id="hero" icon="◇" title="Hero" badge="REQUERIDO" openState={openState} setOpenState={setOpenState} tk={tk}>
              <Field k="heroLabel" label="Etiqueta boletín" placeholder="Boletín Semanal" data={data} set={set} tk={tk} />
              <Field k="heroTitle" label="Título H1" required placeholder="Ventas, retención &" data={data} set={set} tk={tk} />
              <Field k="heroAccent" label="Palabra en dorado" placeholder="resultados" data={data} set={set} tk={tk} />
              <Field k="heroSub" label="Subtítulo" placeholder="Semana 14 · Abril 13 al 19" data={data} set={set} tk={tk} />
              <ImageField k="heroBanner" label="Banner del hero" hint="1200×600 ideal · opcional" aspect="2 / 1" data={data} set={set} tk={tk} />
            </Section>

            <Section id="bien" icon="○" title="Bienvenida" badge="REQUERIDO" openState={openState} setOpenState={setOpenState} hideMap={hiddenSections} toggleHide={toggleHide} tk={tk}>
              <Field k="wTitle" label="Título" placeholder="Hola Sensation Family" data={data} set={set} tk={tk} />
              <Field k="wP1" label="Párrafo 1" required type="textarea" placeholder="Esta semana lanzamos…" data={data} set={set} tk={tk} />
              <Field k="wP2" label="Párrafo 2 (opcional)" type="textarea" placeholder="Recuerda que cada acción cuenta…" data={data} set={set} tk={tk} />
              <Field k="wMotive" label="Frase motivacional" placeholder="¡Vamos por una semana extraordinaria!" data={data} set={set} tk={tk} />
            </Section>

            <Section id="eventos" icon="□" title={`Eventos${data.eventos.length ? ` · ${data.eventos.length}` : ''}`} badge="OPCIONAL" openState={openState} setOpenState={setOpenState} hideMap={hiddenSections} toggleHide={toggleHide} tk={tk}>
              <ItemList
                items={data.eventos}
                kind="evento"
                listKey="eventos"
                blank={{ title: '', date: '', desc: '', img: '', cta: 'Reservar lugar', link: '' }}
                fields={[
                  { k: 'title', label: 'Título del evento', placeholder: 'Webinar de Ventas' },
                  { k: 'date',  label: 'Fecha y hora', placeholder: 'Mié 16 abril · 7 pm' },
                  { k: 'desc',  label: 'Descripción', type: 'textarea', placeholder: 'Aprende a duplicar…' },
                  { k: 'img',   label: 'Imagen del evento', type: 'image', hint: '1200×800 ideal', aspect: '3 / 2' },
                  { k: 'cta',   label: 'Texto del botón', placeholder: 'Reservar lugar' },
                  { k: 'link',  label: 'Link', placeholder: 'https://…', mono: true },
                ]}
                {...{ data, set, addItem, updateItem, removeItem, moveItem, tk }}
              />
            </Section>

            <Section id="productos" icon="△" title={`Productos${data.productos.length ? ` · ${data.productos.length}` : ''}`} badge="OPCIONAL" openState={openState} setOpenState={setOpenState} hideMap={hiddenSections} toggleHide={toggleHide} tk={tk}>
              <Field k="prodSecTitle" label="Título de sección" placeholder="Especial · Belleza" data={data} set={set} tk={tk} />
              <ItemList
                items={data.productos}
                kind="producto"
                listKey="productos"
                blank={{ name: '', sub: '', price: '', img: '', cta: 'Comprar', link: '' }}
                fields={[
                  { k: 'name',  label: 'Nombre del producto', placeholder: 'Sérum revitalizante' },
                  { k: 'sub',   label: 'Subtítulo / detalle', placeholder: 'Edición limitada · 30 ml' },
                  { k: 'price', label: 'Precio', placeholder: '$48 USD' },
                  { k: 'img',   label: 'Imagen del producto', type: 'image', hint: 'Fondo limpio · 800×800', aspect: '1 / 1' },
                  { k: 'cta',   label: 'Texto del botón', placeholder: 'Comprar' },
                  { k: 'link',  label: 'Link', placeholder: 'https://…', mono: true },
                ]}
                {...{ data, set, addItem, updateItem, removeItem, moveItem, tk }}
              />
            </Section>

            <Section id="capacitacion" icon="▽" title={`Capacitación${data.capacitaciones.length > 1 ? ` · ${data.capacitaciones.length}` : ''}`} badge="OPCIONAL" openState={openState} setOpenState={setOpenState} hideMap={hiddenSections} toggleHide={toggleHide} tk={tk}>
              <ItemList
                items={data.capacitaciones}
                kind="capacitación"
                listKey="capacitaciones"
                blank={{ title: '', desc: '', week: '', dates: '', img: '', cta: 'Ver agenda', link: '' }}
                fields={[
                  { k: 'title', label: 'Título', placeholder: '¿Qué aprenderás esta semana?' },
                  { k: 'desc',  label: 'Descripción', type: 'textarea', placeholder: 'Las herramientas y estrategias…' },
                  { k: 'week',  label: 'Semana', placeholder: 'Semana 14' },
                  { k: 'dates', label: 'Fechas', placeholder: 'Abril 13 — 19' },
                  { k: 'img',   label: 'Imagen de la capacitación', type: 'image', hint: 'Cover 1200×600', aspect: '2 / 1' },
                  { k: 'cta',   label: 'Texto del botón', placeholder: 'Ver agenda' },
                  { k: 'link',  label: 'Link', placeholder: 'https://…', mono: true },
                ]}
                {...{ data, set, addItem, updateItem, removeItem, moveItem, tk }}
              />
            </Section>

            <Section id="estilos" icon="A" title="Estilos del texto" badge="OPCIONAL" openState={openState} setOpenState={setOpenState} tk={tk}>
              <div style={{ fontSize: 14, color: tk.muted, lineHeight: 1.55,
                marginBottom: 10, padding: '6px 0' }}>
                Tamaños y colores de la tipografía del email. La fuente queda fija
                (Fraunces + Plus Jakarta) para mantener la sinergia visual.
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <ColorField k="colorTitle" label="Color títulos" data={data} set={set} tk={tk} />
                <ColorField k="colorBody" label="Color párrafos" data={data} set={set} tk={tk} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <ColorField k="colorEyebrow" label="Color etiquetas" data={data} set={set} tk={tk} />
                <ColorField k="colorHeroText" label="Texto sobre hero" data={data} set={set} tk={tk} />
              </div>

              <SizeField k="sizeH1" label="Título Hero" min={24} max={56} unit="px" data={data} set={set} tk={tk} />
              <SizeField k="sizeH2" label="Subtítulos de sección" min={18} max={36} unit="px" data={data} set={set} tk={tk} />
              <SizeField k="sizeBody" label="Texto de párrafo" min={11} max={18} unit="px" data={data} set={set} tk={tk} />
              <SizeField k="sizeEyebrow" label="Etiquetas (eyebrow)" min={8} max={14} unit="px" data={data} set={set} tk={tk} />
            </Section>

            <Section id="footer" icon="▭" title="Footer" openState={openState} setOpenState={setOpenState} tk={tk}>
              <div style={{ fontSize: 15, color: tk.muted, lineHeight: 1.6,
                padding: '8px 2px' }}>
                El pie de página es fijo: logo de Sensation Brands, leyenda institucional y copyright. No requiere edición.
              </div>
            </Section>

            <div style={{ height: 12 }} />
          </div>

          {/* Sticky footer */}
          <div style={{ padding: '14px 18px 18px', borderTop: tk.hairline, background: tk.panel }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 9, fontFamily: tk.fontMono, fontSize: 11.5, letterSpacing: 2,
              color: tk.muted,
            }}>
              <span>VALIDACIÓN</span>
              <span style={{ color: valid ? tk.success : tk.danger, fontWeight: 700 }}>
                ● {filledRequired} / {required.length} requeridos
              </span>
            </div>
            <button
              disabled={!valid}
              onClick={handleGenerar}
              style={{
                width: '100%', padding: '14px 18px',
                background: valid
                  ? 'linear-gradient(180deg, #d4b25a 0%, #b8882a 100%)'
                  : tk.panel2,
                color: valid ? '#1a0e2e' : tk.muted,
                fontSize: 15.5, fontWeight: 700, letterSpacing: 2.5,
                textTransform: 'uppercase', fontFamily: tk.fontUi,
                border: 'none', borderRadius: tk.radius,
                boxShadow: valid
                  ? '0 1px 0 rgba(255,255,255,0.4) inset, 0 6px 18px rgba(201,162,76,0.35)'
                  : 'none',
                cursor: valid ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                transition: 'transform .12s, box-shadow .12s',
              }}
              onMouseEnter={e => { if (valid) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            >
              <span>✦</span>
              GENERAR EMAIL HTML
              <span style={{
                fontSize: 12.5, opacity: 0.75, padding: '2px 7px',
                border: '1px solid currentColor', borderRadius: 3,
                letterSpacing: 1, fontFamily: tk.fontMono,
              }}>⌘ ↵</span>
            </button>
            <div style={{
              marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6,
            }}>
              {[
                { l: '⬇ Descargar', fn: handleDescargar },
                { l: '📋 Copiar', fn: handleCopiar },
                { l: '🖊 Código', fn: handleVerCodigo },
              ].map(b => (
                <button key={b.l} onClick={b.fn} style={{
                  padding: '8px 6px', fontSize: 13, fontWeight: 600, textAlign: 'center',
                  color: tk.text2, background: tk.panel2,
                  border: tk.hairline, borderRadius: tk.radiusSm,
                  fontFamily: tk.fontUi, cursor: 'pointer',
                }}>{b.l}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* PREVIEW */}
        <main style={{
          flex: 1, background: tk.previewBg,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 24px', borderBottom: tk.hairline,
            display: 'flex', alignItems: 'center', gap: 14,
            background: tw.dark ? 'rgba(20,20,24,0.85)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{
              fontFamily: tk.fontMono, fontSize: 12.5, letterSpacing: 3,
              color: tk.text, fontWeight: 700,
            }}>VISTA PREVIA</div>
            <div style={{ width: 1, height: 12, background: tk.muted, opacity: 0.4 }} />
            <div style={{ fontSize: 14, color: tk.text2 }}>
              HTML · GoHighLevel Ready ·{' '}
              <span style={{ color: tk.success, fontWeight: 600 }}>● en vivo</span>
            </div>
            <div style={{ flex: 1 }} />

            {/* Template switcher */}
            <div style={{ display: 'flex', background: tk.panel2, padding: 3,
              borderRadius: tk.radiusSm, border: tk.hairline, marginRight: 6 }}>
              {[{k:'v1',l:'✦ Editorial'},{k:'v3',l:'◆ Moderna'}].map(t => (
                <button key={t.k} onClick={() => setActiveTemplate(t.k)} style={{
                  padding: '5px 12px', fontSize: 13, fontWeight: 600,
                  color: activeTemplate === t.k ? tk.text : tk.text2,
                  background: activeTemplate === t.k ? tk.panel : 'transparent',
                  borderRadius: tk.radiusSm - 2, border: 'none', cursor: 'pointer',
                  boxShadow: activeTemplate === t.k ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  fontFamily: tk.fontUi,
                }}>{t.l}</button>
              ))}
            </div>

            <div style={{
              display: 'flex', background: tk.panel2, padding: 3,
              borderRadius: tk.radiusSm, border: tk.hairline,
            }}>
              {[{k: 'desktop', l: 'Desktop'}, {k: 'mobile', l: 'Móvil'}].map(d => (
                <button key={d.k} onClick={() => setDevice(d.k)} style={{
                  padding: '5px 14px', fontSize: 14, fontWeight: 600,
                  color: device === d.k ? tk.text : tk.text2,
                  background: device === d.k ? tk.panel : 'transparent',
                  borderRadius: tk.radiusSm - 2, border: 'none', cursor: 'pointer',
                  boxShadow: device === d.k ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  fontFamily: tk.fontUi,
                }}>{d.l}</button>
              ))}
            </div>

            <button onClick={() => showToast(valid ? '✅ Todo válido — listo para generar' : `⚠ Faltan ${required.length - filledRequired} campos requeridos`, valid ? 'ok' : 'error')} style={{
              padding: '6px 14px', fontSize: 13, fontWeight: 700,
              letterSpacing: 1.5, textTransform: 'uppercase', color: tk.gold,
              background: 'transparent', border: `1px solid ${tk.gold}55`,
              borderRadius: tk.radiusSm, cursor: 'pointer', fontFamily: tk.fontUi,
            }}>Validar</button>
            <button onClick={handleCopiar} style={{
              padding: '6px 14px', fontSize: 13, fontWeight: 700,
              letterSpacing: 1.5, textTransform: 'uppercase', color: '#fff',
              background: tk.plum, border: 'none',
              borderRadius: tk.radiusSm, cursor: 'pointer', fontFamily: tk.fontUi,
            }}>Copiar HTML</button>
          </div>

          <div style={{
            flex: 1, overflow: 'auto', display: 'flex',
            justifyContent: 'center', alignItems: 'flex-start',
            padding: device === 'mobile' ? '28px 12px' : '28px 24px',
          }}>
            {activeTemplate === 'v1'
              ? <LivePreviewV1 data={data} hidden={hiddenSections} scale={device === 'mobile' ? 0.45 : 0.62} />
              : <LivePreview   data={data} hidden={hiddenSections} scale={device === 'mobile' ? 0.5  : 0.66} />}
          </div>
        </main>
        </>)}{/* end tab crear */}

        {/* ── TAB: HISTORIAL (placeholder) ──────────────────────── */}
        {tab === 'hist' && (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: tk.previewBg, color: tk.muted,
            fontFamily: tk.fontUi, fontSize: 17,
          }}>
            Historial próximamente…
          </div>
        )}

      </div>{/* end BODY */}

      {/* TWEAKS PANEL */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Apariencia" />
        <TweakToggle label="Modo oscuro" value={tw.dark}
          onChange={v => setTweak('dark', v)} />
        <TweakRadio label="Densidad" value={tw.density}
          options={['compact', 'regular', 'comfy']}
          onChange={v => setTweak('density', v)} />

        <TweakSection label="Tipografía" />
        <TweakSelect label="UI font" value={tw.fontUi}
          options={['inter-tight', 'inter', 'jakarta', 'dm-sans']}
          onChange={v => setTweak('fontUi', v)} />
        <TweakSelect label="Display font" value={tw.fontDisplay}
          options={['fraunces', 'cormorant', 'inter-tight', 'dm-serif']}
          onChange={v => setTweak('fontDisplay', v)} />

        <TweakSection label="Color" />
        <TweakColor label="Acento" value={tw.accent}
          options={['#C9A24C', '#B88A2C', '#D4A94F', '#8a6e1f']}
          onChange={v => setTweak('accent', v)} />
      </TweaksPanel>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: toast.type === 'error' ? '#c44e2e' : tk.plum,
          color: '#fff', padding: '10px 20px', borderRadius: 8,
          fontFamily: tk.fontUi, fontSize: 15.5, fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          zIndex: 9999, whiteSpace: 'nowrap',
          animation: 'fadeInUp .2s ease',
        }}>
          {toast.msg}
        </div>
      )}

      {/* MODAL CÓDIGO */}
      {showCode && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(10,5,20,0.72)',
          zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }} onClick={() => setShowCode(false)}>
          <div style={{
            background: tw.dark ? '#16161a' : '#fff',
            borderRadius: 10, width: '100%', maxWidth: 760,
            maxHeight: '80vh', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              padding: '14px 18px', borderBottom: tk.hairline,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ fontFamily: tk.fontMono, fontSize: 14, letterSpacing: 2, color: tk.muted, fontWeight: 700 }}>
                HTML · CÓDIGO FUENTE
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleCopiar} style={{
                  padding: '5px 12px', fontSize: 13, fontWeight: 700,
                  color: tk.gold, background: 'none',
                  border: `1px solid ${tk.gold}55`, borderRadius: tk.radiusSm,
                  cursor: 'pointer', fontFamily: tk.fontUi, letterSpacing: 1,
                }}>📋 Copiar</button>
                <button onClick={handleDescargar} style={{
                  padding: '5px 12px', fontSize: 13, fontWeight: 700,
                  color: '#fff', background: tk.plum, border: 'none',
                  borderRadius: tk.radiusSm, cursor: 'pointer', fontFamily: tk.fontUi, letterSpacing: 1,
                }}>⬇ Descargar</button>
                <button onClick={() => setShowCode(false)} style={{
                  padding: '5px 10px', fontSize: 15, color: tk.muted,
                  background: 'none', border: 'none', cursor: 'pointer',
                }}>✕</button>
              </div>
            </div>
            <textarea
              readOnly
              value={generateEmailHTML()}
              style={{
                flex: 1, padding: 16, fontFamily: tk.fontMono, fontSize: 14.5,
                lineHeight: 1.6, color: tk.text, background: tw.dark ? '#0e0d10' : '#f7f5f0',
                border: 'none', outline: 'none', resize: 'none',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default EditorApp;