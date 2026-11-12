## Qué cambia

<!-- Describe el cambio y enlaza la issue: "Cierra #N" -->

## Cómo probarlo

1. `npm run dev` y abrir la app en la tienda de desarrollo
2.

## Checklist

- [ ] Probado en la tienda de desarrollo
- [ ] `npm run check` pasa en local (lint, tipos, tests y build)
- [ ] Si cambia `prisma/schema.prisma`: incluye la migración (`npx prisma migrate dev`)
- [ ] Si cambian los `scopes`: indicado aquí (el comerciante tendrá que volver a aceptar permisos)
- [ ] Si cambia una consulta GraphQL: ejecutado `npm run graphql-codegen`
- [ ] Textos de cara al cliente revisados (sin declaraciones de salud no autorizadas)
