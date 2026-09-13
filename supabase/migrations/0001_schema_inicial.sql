-- Esquema inicial CarpetaCiudadana. Refleja src/shared/types/domain.ts.
-- Aplicar con: supabase db push  (o vía MCP apply_migration)
-- Demo: RLS deshabilitado. Antes de producción, habilitar y definir policies.

create extension if not exists "pgcrypto";

create table ciudadanos (
  id uuid primary key default gen_random_uuid(),
  ci text not null unique,
  ci_departamento text not null,
  nombre_completo text not null,
  telefono text,
  creado_en timestamptz not null default now()
);

create table emisores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  certificado_por text not null,
  certificado boolean not null default true,
  tokens_emitidos int not null default 0
);

create table documentos (
  id uuid primary key default gen_random_uuid(),
  ciudadano_id uuid not null references ciudadanos(id) on delete cascade,
  nombre text not null,
  tipo text not null,
  icono text not null,
  estado text not null check (estado in ('vigente','por_vencer','vencido','pendiente')),
  emitido_en date not null,
  vence_en date,
  campos_ocr jsonb not null default '{}',
  creado_en timestamptz not null default now()
);

create table vinculos (
  id uuid primary key default gen_random_uuid(),
  token_id text not null unique,
  ciudadano_id uuid not null references ciudadanos(id) on delete cascade,
  emisor_id uuid not null references emisores(id),
  tipo_documento text not null,
  estado text not null check (estado in ('activo','por_vencer','vencido','revocado')),
  creado_en timestamptz not null default now(),
  vence_en date not null,
  ultima_verificacion_en timestamptz,
  firma text not null
);

create table tramites (
  id uuid primary key default gen_random_uuid(),
  ciudadano_id uuid not null references ciudadanos(id) on delete cascade,
  tipo text not null,
  titulo text not null,
  subtitulo text not null default '',
  estado text not null check (estado in ('en_progreso','completado','disponible','cancelado')),
  costo_estimado_bs numeric(12,2) not null default 0,
  tiempo_estimado text not null default '',
  hecho_imponible_id uuid,
  creado_en timestamptz not null default now(),
  completado_en timestamptz
);

create table pasos_tramite (
  id uuid primary key default gen_random_uuid(),
  tramite_id uuid not null references tramites(id) on delete cascade,
  orden int not null,
  nombre text not null,
  fuente text not null,
  nota text not null default '',
  estado text not null check (estado in ('completado','en_progreso','bloqueado','pendiente')),
  completado_en timestamptz,
  documento_id uuid references documentos(id),
  vinculo_id uuid references vinculos(id),
  monto_bs numeric(12,2),
  unique (tramite_id, orden)
);

-- Diferenciador: el municipio se entera de cada transferencia de bien.
create table hechos_imponibles (
  id uuid primary key default gen_random_uuid(),
  tramite_id uuid not null references tramites(id) on delete cascade,
  tipo_bien text not null check (tipo_bien in ('vehiculo','inmueble')),
  descripcion_bien text not null,
  vendedor_id uuid not null references ciudadanos(id),
  comprador_id uuid not null references ciudadanos(id),
  valor_declarado_usd numeric(12,2) not null,
  valor_base_bs numeric(14,2) not null,
  base_imponible_bs numeric(14,2) not null,
  alicuota numeric(5,4) not null,
  impuesto_bs numeric(14,2) not null,
  arancel_bs numeric(12,2) not null,
  total_bs numeric(14,2) not null,
  estado text not null check (estado in ('pendiente','liquidado','pagado','anulado')),
  municipio text not null,
  generado_en timestamptz not null default now(),
  pagado_en timestamptz
);

alter table tramites
  add constraint tramites_hecho_imponible_fk
  foreign key (hecho_imponible_id) references hechos_imponibles(id);

create table verificaciones (
  id uuid primary key default gen_random_uuid(),
  vinculo_id uuid references vinculos(id),
  token_id text not null,
  ciudadano_ci text not null,
  tipo text not null,
  resultado text not null check (resultado in ('valido','invalido','vencido')),
  motivo text,
  funcionario text not null,
  institucion text not null,
  verificado_en timestamptz not null default now()
);

create table actividades (
  id uuid primary key default gen_random_uuid(),
  ciudadano_id uuid not null references ciudadanos(id) on delete cascade,
  tipo text not null check (tipo in ('documento','vinculo','tramite','verificacion','recaudacion')),
  descripcion text not null,
  ocurrido_en timestamptz not null default now()
);

create index on documentos (ciudadano_id);
create index on vinculos (ciudadano_id);
create index on tramites (ciudadano_id, estado);
create index on hechos_imponibles (municipio, estado);
create index on actividades (ciudadano_id, ocurrido_en desc);

-- Realtime para la demo de dos actores (ciudadano ↔ funcionario)
alter publication supabase_realtime add table vinculos, verificaciones, hechos_imponibles, pasos_tramite;
