import React, { useState } from "react";

interface CustomerTableProps {
  customers: Customer[];
  transactions: Transaction[];
  onSelectCustomer: (customer: Customer) => void;
  selectedCustomer: Customer | null;
}

type SortKey = "name" | "transactions" | "amount";
type SortOrder = "asc" | "desc";

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  transactions,
  onSelectCustomer,
  selectedCustomer,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const sortedCustomers = [...customers].sort((a, b) => {
    const aTransactions = transactions.filter((t) => t.customer_id === a.id);
    const bTransactions = transactions.filter((t) => t.customer_id === b.id);
    const aTotalAmount = aTransactions.reduce((sum, t) => sum + t.amount, 0);
    const bTotalAmount = bTransactions.reduce((sum, t) => sum + t.amount, 0);

    switch (sortKey) {
      case "name":
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case "transactions":
        return sortOrder === "asc"
          ? aTransactions.length - bTransactions.length
          : bTransactions.length - aTransactions.length;
      case "amount":
        return sortOrder === "asc"
          ? aTotalAmount - bTotalAmount
          : bTotalAmount - aTotalAmount;
      default:
        return 0;
    }
  });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const SortIcon: React.FC<{ active: boolean; order: SortOrder }> = ({
    active,
    order,
  }) => {
    if (!active) return <span className="ml-1">↕️</span>;
    return <span className="ml-1">{order === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th
              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name <SortIcon active={sortKey === "name"} order={sortOrder} />
            </th>
            <th
              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("transactions")}
            >
              Total Transactions{" "}
              <SortIcon active={sortKey === "transactions"} order={sortOrder} />
            </th>
            <th
              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("amount")}
            >
              Total Amount{" "}
              <SortIcon active={sortKey === "amount"} order={sortOrder} />
            </th>
          </tr>
        </thead>
        {customers.length > 0 &&<tbody className="bg-white divide-y divide-gray-200">
          {sortedCustomers.map((customer) => {
            const customerTransactions = transactions.filter(
              (transaction) => transaction.customer_id === customer.id
            );
            const totalAmount = customerTransactions.reduce(
              (sum, transaction) => sum + transaction.amount,
              0
            );
            const isSelected =
              selectedCustomer && selectedCustomer.id === customer.id;
            return (
              <tr
                key={customer.id}
                onClick={() => onSelectCustomer(customer)}
                className={`cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${
                  isSelected ? "bg-blue-100" : ""
                }`}
              >
                <td className="px-4 py-2 whitespace-nowrap">{customer.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {customerTransactions.length}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  ${totalAmount.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
                }
      </table>
      {
        customers.length === 0 && <p className="text-center mt-5">No customers found</p>
      }
    </div>
  );
};

export default CustomerTable;
