import React, { useEffect, useState } from "react";
import CustomerTable from "./components/CustomerTable";
import TransactionGraph from "./components/TransactionGraph";
import data from "./constants/dummyData";
/* I prefer to make everything from scratch and not using any library 
like react-table or material-table becuase it's not that big and it's a simple project.*/
const App: React.FC = () => {
  const customers = data.customers;
  const transactions = data.transactions;
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [nameFilter, setNameFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    const customerTransactions = transactions.filter(
      (transaction) => transaction.customer_id === customer.id
    );
    const totalAmount = customerTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    return (
      customer.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      totalAmount >= (parseInt(amountFilter) || 0)
    );
  });

  const filteredTransactions = transactions.filter((transaction) =>
    selectedCustomer ? transaction.customer_id === selectedCustomer.id : true
  );

  useEffect(() => {
    if (!filteredCustomers.length) {
      setSelectedCustomer(null);
    } else if (
      selectedCustomer &&
      !filteredCustomers.some((customer) => customer.id === selectedCustomer.id)
    ) {
      setSelectedCustomer(null);
    }
  }, [filteredCustomers, selectedCustomer]);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer((prevCustomer) =>
      prevCustomer && prevCustomer.id === customer.id ? null : customer
    );
  };

  const handleUnselectCustomer = () => {
    setSelectedCustomer(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 max-w-screen-2xl mx-auto">
        <div className="md:block hidden absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl md:w-[800px]"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 md:w-[800px]">
          <h1 className="text-4xl font-bold mb-5 text-gray-800">
            Customer Transactions
          </h1>
          <div className="mb-5 space-y-2">
            <input
              type="text"
              placeholder="Filter by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            />
            <input
              type="number"
              placeholder="Filter by min total amount"
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            />
          </div>
          <CustomerTable
            customers={filteredCustomers}
            transactions={transactions}
            onSelectCustomer={handleSelectCustomer}
            selectedCustomer={selectedCustomer}
          />
          {selectedCustomer && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="md:text-2xl text-xl font-semibold text-gray-700">
                  Transactions for {selectedCustomer.name}
                </h2>
                <button
                  onClick={handleUnselectCustomer}
                  className="md:px-4  px-2 py-2 md:text-base text-[12px] bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Unselect Customer
                </button>
              </div>
              <TransactionGraph
                transactions={filteredTransactions.filter(
                  (transaction) =>
                    transaction.customer_id === selectedCustomer.id
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
