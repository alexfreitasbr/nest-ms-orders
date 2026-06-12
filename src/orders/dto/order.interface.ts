export { OrdersStatus } from '../../../generated/prisma/client';

export const OrderStatusList = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export type OrderBy =
  | 'userId'
  | 'totalAmount'
  | 'items'
  | 'status'
  | 'paid'
  | 'paidAt'
  | 'createdAt'
  | 'updatedAt';

export const OrderByList = [
  'userId',
  'totalAmount',
  'items',
  'status',
  'paid',
  'paidAt',
  'createdAt',
  'updatedAt',
];
