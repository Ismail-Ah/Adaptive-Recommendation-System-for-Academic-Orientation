import { z } from 'zod';

export const addressSchema = z.object({
  streetNumber: z.string().min(1, "Le numéro de rue est requis"),
  streetName: z.string().min(1, "Le nom de rue est requis"),
  city: z.string().min(1, "La ville est requise"),
  postalCode: z.string().regex(/^\d+$/, "Le code postal doit contenir uniquement des chiffres"),
  country: z.string().min(1, "Le pays est requis")
});

export const userSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Format de date invalide (JJ/MM/AAAA)"),
  balance: z.number().positive("Le solde doit être positif"),
  address: addressSchema
});