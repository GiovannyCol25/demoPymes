# Inventario PYME — Demo

Aplicación web liviana (Vite + React + TypeScript) para demostrar gestión de inventario: **inventario**, **ventas**, **compras** y **reportes**. Los datos se guardan en `localStorage` del navegador (sin backend).

## Acceso

- **Login**: pantalla inicial con guía de uso. La sesión se guarda en `sessionStorage` (al cerrar la pestaña se pierde).
- **Desarrollo**: sin variables de entorno, usuario `demo` y contraseña `pyme2026`.
- **Producción (Vercel)**: defina `VITE_DEMO_USERNAME` y `VITE_DEMO_PASSWORD` en las variables de entorno del proyecto. Use valores **solo para esta demo**; no reutilice claves de GitHub, Vercel ni otros servicios.

### Seguridad y expectativas

- Esta app **no** incluye tokens ni API keys de terceros: no hay conexión a cuentas de Vercel o GitHub desde el navegador.
- El login en cliente **no** protege frente a alguien que inspeccione el bundle: en sitios estáticos, las variables `VITE_*` se inyectan en el build. Sirve para **orientar** a visitantes y evitar bots casuales, no para datos sensibles reales.

## Desarrollo

```bash
npm install
npm run dev
```

Copie `.env.example` a `.env.local` y ajuste si desea otras credenciales en local.

## Producción

```bash
npm run build
npm run preview
```

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. En [Vercel](https://vercel.com), importa el repo.
3. Framework preset: **Vite**. Directorio de salida: **dist** (por defecto).
4. Añade `VITE_DEMO_USERNAME` y `VITE_DEMO_PASSWORD` en Environment Variables.
5. El archivo `vercel.json` redirige rutas al SPA para que React Router funcione.

## Pie de página

Demo con identificación **GioSoftwareSolutions**.
