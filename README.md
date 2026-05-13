# Sensation Brands · Email Editor

Sistema de generación de plantillas HTML para GoHighLevel (GHL).  
Equipo de ventas crea boletines sin conocimientos técnicos.

## 🚀 Deploy rápido en Vercel

1. Subir este repositorio a GitHub
2. Ir a [vercel.com](https://vercel.com) → **Add New Project**
3. Conectar el repo — Vercel detecta Vite automáticamente
4. Click **Deploy** — listo en ~30 segundos

## ⚙️ Variables de entorno (opcional — para Cloudinary)

En Vercel → Settings → Environment Variables:

```
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=sensation_uploads
```

Sin estas variables, las imágenes se guardan en base64 (preview funcional,
pero no compatibles con GHL). Configurar Cloudinary es recomendado para producción.

## 🔧 Desarrollo local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción en /dist
npm run preview  # preview del build
```

## 📁 Estructura del proyecto

```
src/
├── App.jsx            ← Componente principal + toda la lógica
├── LivePreview.jsx    ← Preview email estilo Moderna (Jost)
├── LivePreviewV1.jsx  ← Preview email estilo Editorial (Fraunces)
├── TweaksPanel.jsx    ← Panel de tweaks de UI
├── generateV3.js      ← Generador HTML email Moderna
├── index.css          ← Reset global
├── main.jsx           ← Entry point React
└── assets/
    └── logo.png       ← Logo Sensation Brands
```

## 🔑 Acceso al panel de diseñadores

En la galería → botón **"✎ Área diseñadores"**  
Contraseña por defecto: `sensation2026`  
Cambiar en `src/App.jsx` línea ~557: `const DESIGNER_PASS = '...'`

## 📧 Compatibilidad GHL

- Las imágenes siempre se sirven como URLs (nunca base64 en el HTML generado)
- El footer incluye `{{unsubscribe_url}}` listo para GHL
- HTML compatible con principales clientes de correo (Gmail, Outlook, Apple Mail)
