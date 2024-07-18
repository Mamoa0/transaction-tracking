interface Customer {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  customer_id: number;
  date: string;
  amount: number;
  description: string;
}

interface Data {
  customers: Customer[];
  transactions: Transaction[];
}
