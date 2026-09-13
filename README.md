# CarpetaCiudadana

Billetera ciudadana digital para Bolivia. Centraliza los documentos del ciudadano, tokeniza los
vínculos con emisores certificados, guía los trámites paso a paso y **notifica automáticamente al
municipio cada transferencia de bienes** para que liquide la tarifa correspondiente.

Demo/pitch para la Gobernación de Santa Cruz. Prometeo © 2026.

## Arrancar

```bash
npm install
cp .env.example .env.local   # VITE_USE_MOCKS=true funciona sin credenciales
npm run dev
```

## Documentación

| Doc | Para qué |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Reglas del proyecto (las lee Claude Code y el equipo) |
| [docs/SPEC.md](docs/SPEC.md) | Qué hace cada vista |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Capas y reglas de dependencia |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | Nombres, estilos, formatos |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Entidades y tablas |
| [docs/RECAUDACION.md](docs/RECAUDACION.md) | Módulo diferenciador + guion del pitch |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Cómo trabajamos en equipo |
| [docs/adr/](docs/adr/) | Decisiones de arquitectura |

## Stack

Vite · React 19 · TypeScript · Tailwind 4 · react-router · lucide-react · Supabase
