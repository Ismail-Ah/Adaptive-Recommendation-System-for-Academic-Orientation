export interface User {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  balance: number;
  address: {
    streetNumber: string;
    streetName: string;
    city: string;
    postalCode: string;
    country: string;
  };
  role: 'admin' | 'user';
}

export interface AuthUser {
  id: string;
  role: 'admin' | 'user';
}