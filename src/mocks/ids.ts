/**
 * IDs fijos del escenario de demo. Los MISMOS valores están en el seed de Supabase
 * (supabase/seed.sql), así el modo mocks y el modo Supabase son intercambiables.
 * No cambiar sin actualizar el seed.
 */
export const ID = {
  carlos: '11111111-1111-4111-8111-111111111111',
  maria: '22222222-2222-4222-8222-222222222222',

  emisorConsorcio: 'a1111111-1111-4111-8111-111111111111',
  emisorNotaria14: 'a2222222-2222-4222-8222-222222222222',
  emisorColegio: 'a3333333-3333-4333-8333-333333333333',
  emisorMorales: 'a4444444-4444-4444-8444-444444444444',

  tramiteTraspaso: 'b1111111-1111-4111-8111-111111111111',
  tramiteLicencia: 'b2222222-2222-4222-8222-222222222222',
  tramiteNit: 'b3333333-3333-4333-8333-333333333333',
} as const
