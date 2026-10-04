# Resumen de cambios

Este documento explica los archivos del proyecto que se modificaron para completar los flujos faltantes del sistema de hoteles. Se añadieron comentarios en el código cerca de los cambios para facilitar su estudio.

## Configuración general

- [`src/app.module.ts`](./src/app.module.ts): se incorporó el módulo de reservas, se activó la validación global de DTOs y se agregó la serialización global para ocultar propiedades marcadas con `@Exclude`.
- [`package-lock.json`](./package-lock.json): se generó al ejecutar `npm install`, que fue necesario porque inicialmente no estaba disponible Jest para correr el comando `npm test` indicado en el README.

## Usuarios

- [`src/user/dto/create-user.dto.ts`](./src/user/dto/create-user.dto.ts): se añadieron validaciones para correo, contraseña, nombre y teléfono opcional.
- [`src/user/user.service.ts`](./src/user/user.service.ts): se corrigió el error HTTP de correo duplicado, se añadieron respuestas 404 para búsquedas sin resultados y se implementó el borrado.
- [`src/user/user.controller.ts`](./src/user/user.controller.ts): se añadió el endpoint para borrar usuarios y se validan los ids como enteros.
- [`src/user/user.entity.ts`](./src/user/user.entity.ts): se ocultó el hash de contraseña en respuestas serializadas y se configuró cascada ORM para reservas asociadas.

## Hoteles

- [`src/hotel/dto/create-hotel.dto.ts`](./src/hotel/dto/create-hotel.dto.ts): se agregaron validaciones para campos requeridos, rating de 0 a 5 y descripción opcional.
- [`src/hotel/dto/update-hotel.dto.ts`](./src/hotel/dto/update-hotel.dto.ts): se creó un DTO de actualización parcial que conserva las validaciones del DTO de creación.
- [`src/hotel/hotel.service.ts`](./src/hotel/hotel.service.ts): se implementaron búsqueda por ubicación, filtrado de hoteles disponibles, actualización y borrado con detección de ids inexistentes.
- [`src/hotel/hotel.controller.ts`](./src/hotel/hotel.controller.ts): se conectaron los endpoints de búsqueda, disponibilidad, actualización y borrado con el servicio.

## Habitaciones

- [`src/room/dto/create-room.dto.ts`](./src/room/dto/create-room.dto.ts): se añadieron validaciones para número, tipo, precio, capacidad, disponibilidad y descripción opcional.
- [`src/room/dto/update-room.dto.ts`](./src/room/dto/update-room.dto.ts): se creó un DTO para permitir actualizaciones parciales sin exigir todos los campos.
- [`src/room/room.service.ts`](./src/room/room.service.ts): se implementaron búsqueda de habitaciones disponibles, actualización, borrado y comprobación de disponibilidad para un intervalo de fechas.
- [`src/room/room.controller.ts`](./src/room/room.controller.ts): se conectaron las rutas de disponibilidad, actualización y borrado; se valida el formato numérico de los ids recibidos.

## Reservas

- [`src/booking/dto/create-booking.dto.ts`](./src/booking/dto/create-booking.dto.ts): se añadieron validaciones del id de habitación y conversión/verificación de las fechas recibidas.
- [`src/booking/booking.service.ts`](./src/booking/booking.service.ts): se implementaron cálculo de precio, validación de fechas, prevención de solapamientos, cancelación y consultas por rango; también se corrigió la asociación TypeORM de la habitación.
- [`src/booking/booking.controller.ts`](./src/booking/booking.controller.ts): se protegió la creación de reservas mediante JWT, se quitó el usuario predeterminado y se conectó el endpoint de cancelación.
- [`src/booking/booking.module.ts`](./src/booking/booking.module.ts): se importó `RoomModule` para que el servicio de reservas pueda consultar tarifa, estado y reservas de una habitación.
- [`src/booking/booking.entity.ts`](./src/booking/booking.entity.ts): se configuró borrado en cascada de reservas al eliminar la habitación relacionada.
- [`src/booking/booking.service.spec.ts`](./src/booking/booking.service.spec.ts): se agregó un mock de `RoomService` porque el servicio de reservas ahora depende de él para validar habitaciones y calcular precios.

## Autenticación

- [`src/auth/auth.controller.ts`](./src/auth/auth.controller.ts): se creó la ruta `POST /auth/login`.
- [`src/auth/auth.service.ts`](./src/auth/auth.service.ts): se implementó la verificación de contraseñas con bcrypt y la emisión de tokens JWT.
- [`src/auth/dto/login.dto.ts`](./src/auth/dto/login.dto.ts): se definieron y validaron las credenciales de inicio de sesión.
- [`src/auth/jwt-secret.ts`](./src/auth/jwt-secret.ts): se centralizó la clave JWT, priorizando la variable de entorno `JWT_SECRET`.
- [`src/auth/auth.module.ts`](./src/auth/auth.module.ts): se registraron el controlador y servicio de autenticación y se configuró JWT mediante `ConfigService`.
- [`src/auth/jwt.strategy.ts`](./src/auth/jwt.strategy.ts): se alineó la validación de tokens con la misma clave JWT y se tipó el payload.

## Pruebas y validación realizada

Los archivos bajo `test/` se modificaron temporalmente mientras se revisaban los flujos E2E, pero esos cambios se restauraron. No forman parte de las modificaciones que quedaron intencionalmente en las pruebas.

Se ejecutó `npm test` y el resultado fue **4 suites aprobadas y 36 pruebas aprobadas**. No se ejecutaron pruebas E2E.
