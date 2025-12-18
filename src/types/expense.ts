export type CreateExpenseInput = {
  amount: number;
  description?: string;
  date?: Date;
  categoryId: string;
};
