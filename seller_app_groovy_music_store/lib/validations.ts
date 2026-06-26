import { z } from "zod";

export const GENEROS = [
  "Blues",
  "Clásica",
  "Country",
  "Cumbia",
  "Electrónica",
  "Folklore",
  "Funk",
  "Hip Hop",
  "Jazz",
  "Metal",
  "Pop",
  "Punk",
  "Reggae",
  "Reggaetón",
  "Rock",
  "Rock Nacional",
  "Salsa",
  "Soul",
  "Tango",
  "Trap",
] as const;

export const productoSchema = z.object({
  titulo: z.string().trim().min(1, "El título es obligatorio"),
  artista: z.string().trim().min(1, "El artista es obligatorio"),
  descripcion: z.string().trim().optional(),
  genero: z.enum(GENEROS),
  formato: z.enum(["VINILO", "CD", "CASSETTE", "MERCHANDISE", "OTRO"]),
  condicion: z.enum(["NUEVO", "COMO_NUEVO", "BUENO", "ACEPTABLE"]),
  precio: z.coerce.number().positive("El precio debe ser un número mayor a 0"),
  stock: z.coerce
    .number()
    .int("El stock debe ser un número entero")
    .nonnegative("El stock no puede ser negativo"),
});

export const perfilSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre del negocio es obligatorio"),
  descripcion: z.string().trim().optional(),
  direccion: z.string().trim().min(1, "La dirección es obligatoria"),
  ciudad: z.string().trim().min(1, "La ciudad es obligatoria"),
  provincia: z.string().trim().optional(),
  codigo_postal: z.string().trim().min(1, "El código postal es obligatorio"),
});

// Etapa 3 — Control Plane: edición/suspensión parcial de productos desde el admin global.
// Todos los campos son opcionales (PATCH = actualización parcial) y se suma `activo`
// para poder suspender/reactivar en el mismo endpoint.
export const productoAdminPatchSchema = productoSchema.partial().extend({
  activo: z.boolean().optional(),
});