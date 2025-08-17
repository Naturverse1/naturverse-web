export type { NaturOrder as Order, NaturLine as OrderLine, Shipping } from './orders';

export interface Address {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal: string;
  country: string;
}
