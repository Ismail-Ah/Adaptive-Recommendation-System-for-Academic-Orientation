import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères"),
  password: z.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .max(50, "Le mot de passe ne peut pas dépasser 50 caractères")
});

export const addressSchema = z.object({
  streetNumber: z.string().min(1, "Le numéro de rue est requis"),
  streetName: z.string().min(1, "Le nom de rue est requis"),
  city: z.string().min(1, "La ville est requise"),
  postalCode: z.string().regex(/^\d+$/, "Le code postal doit contenir uniquement des chiffres"),
  country: z.string().min(1, "Le pays est requis")
});

export const userSchema = z.object({
  firstName: z.string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastName: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  birthDate: z.string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Format de date invalide (JJ/MM/AAAA)")
    .refine((date) => {
      const [day, month, year] = date.split('/').map(Number);
      const dateObj = new Date(year, month - 1, day);
      return dateObj.getDate() === day && 
             dateObj.getMonth() === month - 1 && 
             dateObj.getFullYear() === year;
    }, "Date invalide"),
  balance: z.number()
    .positive("Le solde doit être positif")
    .max(1000000, "Le solde ne peut pas dépasser 1,000,000 MAD"),
  address: addressSchema
});