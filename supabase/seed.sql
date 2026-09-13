-- Seed del escenario de demo. Idempotente: se puede correr las veces que haga falta.
-- Los UUID coinciden con src/mocks/ids.ts — no cambiar uno sin el otro.
-- Las fechas son RELATIVAS a now() para que la demo siempre se vea fresca.

begin;

-- Limpieza (orden inverso a las dependencias)
delete from actividades;
delete from verificaciones;
update tramites set hecho_imponible_id = null;
delete from hechos_imponibles;
delete from pasos_tramite;
delete from tramites;
delete from vinculos;
delete from documentos;
delete from emisores;
delete from ciudadanos;

-- Ciudadanos
insert into ciudadanos (id, ci, ci_departamento, nombre_completo, telefono) values
  ('11111111-1111-4111-8111-111111111111', '8.234.567', 'SC', 'Carlos Mendoza Vargas', '+591 76 432-1098'),
  ('22222222-2222-4222-8222-222222222222', '9.871.234', 'SC', 'María Torres Gutiérrez', '+591 71 205-7744');

-- Emisores certificados
insert into emisores (id, nombre, certificado_por, certificado, tokens_emitidos) values
  ('a1111111-1111-4111-8111-111111111111', 'Consorcio Abogados del Oriente', 'Gobernación Santa Cruz', true, 45),
  ('a2222222-2222-4222-8222-222222222222', 'Notaría Pública N°14 — Dr. Fernando Suárez', 'Alcaldía Santa Cruz', true, 23),
  ('a3333333-3333-4333-8333-333333333333', 'Colegio de Abogados de Santa Cruz', 'Ministerio de Justicia', true, 87),
  ('a4444444-4444-4444-8444-444444444444', 'Estudio Jurídico Morales & Asociados', 'Gobernación Santa Cruz', true, 12);

-- Los 7 documentos del vault de Carlos
insert into documentos (id, ciudadano_id, nombre, tipo, icono, estado, emitido_en, vence_en, campos_ocr) values
  ('d1111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111',
   'Carnet de Identidad', 'Identidad Personal', 'user-circle', 'vigente', '2020-03-15', '2028-03-15',
   '{"CI":"8.234.567","Nombre":"Carlos Mendoza Vargas","Nacimiento":"12/08/1988","Expedido":"Santa Cruz"}'),
  ('d2222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111',
   'Certificado de Nacimiento', 'Estado Civil', 'file-text', 'vigente', '1989-01-10', null,
   '{"Nombre":"Carlos Mendoza Vargas","Padre":"Jorge Mendoza","Madre":"Carmen Vargas","Lugar":"Santa Cruz de la Sierra"}'),
  ('d3333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111',
   'NIT Activo', 'Tributario — SIN', 'building', 'vigente', '2015-06-20', null,
   '{"NIT":"4123456789","Razón Social":"Carlos Mendoza Vargas","Actividad":"Comercio al por menor","Estado":"Activo"}'),
  ('d4444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111',
   'RUAT — Vehículo 2026', 'Municipal — Alcaldía', 'car', 'vigente',
   (now() - interval '250 days')::date, (now() + interval '110 days')::date,
   '{"Placa":"2345-SCC","Marca":"Toyota","Modelo":"Corolla","Año":"2019","Propietario":"Carlos Mendoza","Valor fiscal":"Bs. 78.000"}'),
  ('d5555555-5555-4555-8555-555555555555', '11111111-1111-4111-8111-111111111111',
   'Matrícula de Comercio', 'FUNDEMPRESA', 'briefcase', 'por_vencer', '2022-03-12',
   (now() + interval '25 days')::date,
   '{"Matrícula":"SC-00045821","Empresa":"Comercial Mendoza SRL","Capital":"Bs. 50.000","Estado":"Activa"}'),
  ('d6666666-6666-4666-8666-666666666666', '11111111-1111-4111-8111-111111111111',
   'Licencia de Conducir', 'SEGIP — Tránsito', 'id-card', 'vigente', '2021-07-10', '2027-07-10',
   '{"Categoría":"B","Restricciones":"Ninguna","Sangre":"O+","Órganos":"Sí"}'),
  ('d7777777-7777-4777-8777-777777777777', '11111111-1111-4111-8111-111111111111',
   'Padrón Municipal', 'Alcaldía Santa Cruz', 'map-pin', 'vigente', '2024-02-03', '2027-02-03',
   '{"Inmueble":"Av. Busch 450","Zona":"Plan 3000","Padrón":"SCZ-00234567","Propietario":"Carlos Mendoza"}');

-- Los 4 vínculos tokenizados
insert into vinculos (id, token_id, ciudadano_id, emisor_id, tipo_documento, estado, creado_en, vence_en, ultima_verificacion_en, firma) values
  ('e1111111-1111-4111-8111-111111111111', 'TOK-2026-00341', '11111111-1111-4111-8111-111111111111',
   'a1111111-1111-4111-8111-111111111111', 'Contrato de Compraventa — Toyota Corolla 2019', 'activo',
   now() - interval '3 days', (now() + interval '90 days')::date, now() - interval '2 hours', 'demo.sig.00341'),
  ('e2222222-2222-4222-8222-222222222222', 'TOK-2026-00298', '11111111-1111-4111-8111-111111111111',
   'a2222222-2222-4222-8222-222222222222', 'Poder Notarial Especial — Venta Vehículo', 'activo',
   now() - interval '8 days', (now() + interval '85 days')::date, now() - interval '1 day', 'demo.sig.00298'),
  ('e3333333-3333-4333-8333-333333333333', 'TOK-2026-00412', '11111111-1111-4111-8111-111111111111',
   'a3333333-3333-4333-8333-333333333333', 'Certificado de Libre Gravamen — Placa 2345-SCC', 'por_vencer',
   now() - interval '22 days', (now() + interval '8 days')::date, now() - interval '3 days', 'demo.sig.00412'),
  ('e4444444-4444-4444-8444-444444444444', 'TOK-2026-00189', '11111111-1111-4111-8111-111111111111',
   'a4444444-4444-4444-8444-444444444444', 'Due Diligence Vehicular — Historial completo', 'vencido',
   now() - interval '120 days', (now() - interval '30 days')::date, now() - interval '45 days', 'demo.sig.00189');

-- Trámite activo + los 2 completados
insert into tramites (id, ciudadano_id, tipo, titulo, subtitulo, estado, costo_estimado_bs, tiempo_estimado, creado_en, completado_en) values
  ('b1111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', 'traspaso_vehicular',
   'Traspaso Vehicular', 'Toyota Corolla 2019 — Placa 2345-SCC', 'en_progreso', 850,
   '2–3 días hábiles restantes', now() - interval '3 days', null),
  ('b2222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'licencia_funcionamiento',
   'Licencia de Funcionamiento', 'Comercial Mendoza SRL', 'completado', 200,
   '15 días hábiles', now() - interval '380 days', now() - interval '363 days'),
  ('b3333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', 'renovacion_nit',
   'Renovación NIT', 'Servicio de Impuestos Nacionales', 'completado', 0,
   '5 días hábiles', now() - interval '455 days', now() - interval '450 days');

-- Los 6 pasos del traspaso: 3 completados, 1 en progreso, 2 bloqueados
insert into pasos_tramite (id, tramite_id, orden, nombre, fuente, nota, estado, completado_en, documento_id, vinculo_id, monto_bs) values
  ('f1111111-1111-4111-8111-111111111111', 'b1111111-1111-4111-8111-111111111111', 1,
   'RUAT Municipal vigente', 'Alcaldía Santa Cruz', 'Verificado automáticamente desde tu carpeta',
   'completado', now() - interval '3 days', 'd4444444-4444-4444-8444-444444444444', null, null),
  ('f2222222-2222-4222-8222-222222222222', 'b1111111-1111-4111-8111-111111111111', 2,
   'Certificado de Libre Gravamen', 'Vínculo tokenizado — Colegio de Abogados', 'Token TOK-2026-00412 verificado',
   'completado', now() - interval '3 days', null, 'e3333333-3333-4333-8333-333333333333', null),
  ('f3333333-3333-4333-8333-333333333333', 'b1111111-1111-4111-8111-111111111111', 3,
   'Contrato de Compraventa firmado', 'Consorcio Abogados del Oriente', 'Token TOK-2026-00341 — ambas partes firmaron',
   'completado', now() - interval '2 days', null, 'e1111111-1111-4111-8111-111111111111', null),
  ('f4444444-4444-4444-8444-444444444444', 'b1111111-1111-4111-8111-111111111111', 4,
   'Certificado de Antecedentes del vendedor', 'DIPROVE — Policía Boliviana',
   'Solicitud #34521 enviada hace 6 horas — plazo 24 horas hábiles', 'en_progreso', null, null, null, null),
  ('f5555555-5555-4555-8555-555555555555', 'b1111111-1111-4111-8111-111111111111', 5,
   'Firma digital ante Notaría', 'Notaría certificada por Alcaldía', 'Disponible cuando el paso 4 esté completo',
   'bloqueado', null, null, null, null),
  ('f6666666-6666-4666-8666-666666666666', 'b1111111-1111-4111-8111-111111111111', 6,
   'Pago de arancel de traspaso', 'Alcaldía Santa Cruz', 'El monto se liquida automáticamente al firmar ante notaría',
   'bloqueado', null, null, null, 450);

-- Verificaciones recientes del panel funcionario
insert into verificaciones (id, vinculo_id, token_id, ciudadano_ci, tipo, resultado, motivo, funcionario, institucion, verificado_en) values
  ('c1111111-1111-4111-8111-111111111111', 'e1111111-1111-4111-8111-111111111111', 'TOK-2026-00341', '8.234.567', 'Traspaso vehicular', 'valido', null, 'L. Ribera', 'Alcaldía Santa Cruz', now() - interval '2 hours'),
  ('c2222222-2222-4222-8222-222222222222', 'e2222222-2222-4222-8222-222222222222', 'TOK-2026-00298', '8.234.567', 'Poder notarial', 'valido', null, 'L. Ribera', 'Alcaldía Santa Cruz', now() - interval '1 day'),
  ('c3333333-3333-4333-8333-333333333333', 'e4444444-4444-4444-8444-444444444444', 'TOK-2026-00189', '8.234.567', 'Otro', 'vencido', 'Token vencido', 'M. Áñez', 'Alcaldía Santa Cruz', now() - interval '2 days'),
  ('c4444444-4444-4444-8444-444444444444', null, 'TOK-2026-00777', '7.112.908', 'Contrato', 'invalido', 'Token inexistente', 'M. Áñez', 'Alcaldía Santa Cruz', now() - interval '3 days'),
  ('c5555555-5555-4555-8555-555555555555', 'e3333333-3333-4333-8333-333333333333', 'TOK-2026-00412', '8.234.567', 'Traspaso vehicular', 'valido', null, 'J. Paz', 'Alcaldía Santa Cruz', now() - interval '3 days');

-- Actividad reciente del inicio
insert into actividades (ciudadano_id, tipo, descripcion, ocurrido_en) values
  ('11111111-1111-4111-8111-111111111111', 'verificacion', 'Token verificado — Cert. Libre Gravamen', now() - interval '2 hours'),
  ('11111111-1111-4111-8111-111111111111', 'documento', 'Documento subido — RUAT 2026', now() - interval '1 day'),
  ('11111111-1111-4111-8111-111111111111', 'tramite', 'Trámite iniciado — Traspaso Vehicular', now() - interval '3 days'),
  ('11111111-1111-4111-8111-111111111111', 'vinculo', 'Token generado — Contrato Compraventa', now() - interval '3 days'),
  ('11111111-1111-4111-8111-111111111111', 'documento', 'Documento actualizado — Carnet de Identidad', now() - interval '7 days');

commit;
