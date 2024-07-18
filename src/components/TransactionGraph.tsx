import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TransactionGraphProps {
  transactions: Transaction[];
}

interface ChartData {
  date: string;
  totalAmount: number;
}

const TransactionGraph: React.FC<TransactionGraphProps> = ({ transactions }) => {
  const data: Record<string, ChartData> = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = { date, totalAmount: 0 };
    }
    acc[date].totalAmount += transaction.amount;
    return acc;
  }, {} as Record<string, ChartData>);

  const chartData = Object.values(data).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TransactionGraph;