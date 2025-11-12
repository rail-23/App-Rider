# Estructura DDD propuesta

He añadido una estructura inicial orientada a Domain-Driven Design (DDD) sin modificar los archivos existentes para mantener compatibilidad inmediata.

Carpetas nuevas relevantes:

- `src/domain` - Entidades y lógica de negocio (ej.: `Cupo`).
- `src/presentation` - Componentes y páginas para la UI (barrels que re-exportan los componentes existentes).
- `src/shared` - Re-exports para utilidades compartidas (firebase, repositorio).

Qué hice ahora:

- Añadí la entidad de dominio `src/domain/Cupo.js` y su barrel `src/domain/index.js`.
- Añadí barrels en `src/presentation/components` y `src/presentation/pages` que re-exportan los componentes y páginas existentes.
- Añadí `src/shared/index.js` para exponer `firebase` y `firestoreRepository` desde un punto común.

Siguientes pasos recomendados (manual/gradual):

1. Migrar la lógica de validación y reglas de negocio desde `src/application/*` a `src/domain` cuando corresponda.
2. Reescribir los servicios en `src/application` para usar entidades del dominio (`Cupo`) y port/repository interfaces.
3. Crear adaptadores concretos en `src/infrastructure` que implementen las interfaces de repositorio.
4. Actualizar imports en componentes/páginas para consumir desde `src/presentation` y `src/domain` según convenga.

Si quieres, puedo realizar la migración de uno o dos servicios (por ejemplo `cupoService`) para mostrar cómo queda la separación completa.
