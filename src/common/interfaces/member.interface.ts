import { User } from '@/users/schemas/user.schema';
export interface Imember {
  findOneAndUpdate(arg0: { user: any }, arg1: { amount: number }): unknown;
  updateMany(arg0: Imember): unknown;
  user: User;
  amount: number;
  lastbuy: Date;
  percentage: number;
}
