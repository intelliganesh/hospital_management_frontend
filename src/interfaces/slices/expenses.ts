export interface Expenses {
  date: string;
  description: string;
  amount: number;
  mode_of_payment: string;
  transaction_id: string;
  image: File[] | string[] | null;
  expense_name: string;
  entered_name: string;
  for_name: string;
  other: string;
  generate_voucher_number: string | null | any;
  voucher_number: string | null | any;
}

export interface ExpenseState {
  loading: boolean;
  expensesDetails: any;
  expensesList: Expenses[];
  expenseDropdownList: any[];
}

