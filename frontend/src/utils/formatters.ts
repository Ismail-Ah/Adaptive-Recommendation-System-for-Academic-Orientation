export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('fr-MA')} MAD`;
};

export const formatDate = (date: string): string => {
  const [day, month, year] = date.split('/');
  return `${day}/${month}/${year}`;
};

export const formatAddress = (address: {
  streetNumber: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}): string => {
  return `${address.streetNumber} - ${address.streetName}, ${address.city} ${address.postalCode}, ${address.country}`;
};