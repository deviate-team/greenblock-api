import { User } from '@/users/schemas/user.schema';
export interface Imember {
  user: User;
  amount: number;
  lastbuy: Date;
  percentage: number;
}
