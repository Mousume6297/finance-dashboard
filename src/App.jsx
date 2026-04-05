import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";

function App() {

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("Viewer");
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(false);

  const [transactionsData, setTransactionsData] = useState([
    { date: "2026-04-01", amount: 2000, category: "Food", type: "expense" },
    { date: "2026-04-02", amount: 5000, category: "Salary", type: "income" },
    { date: "2026-04-03", amount: 1500, category: "Shopping", type: "expense" },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) setTransactionsData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactionsData));
  }, [transactionsData]);

  const highestSpending = transactionsData
    .filter(t => t.type === "expense")
    .reduce((max, curr) => curr.amount > max.amount ? curr : max, { amount: 0 });

  const totalIncome = transactionsData
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactionsData
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const exportCSV = () => {
    const rows = [
      ["Date", "Amount", "Category", "Type"],
      ...transactionsData.map(t => [t.date, t.amount, t.category, t.type])
    ];

    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <div className={dark 
      ? "min-h-screen bg-gray-900 text-white transition duration-300" 
      : "min-h-screen bg-gray-100 transition duration-300"}>

      {/* Navbar */}
      <div className={`shadow px-6 py-4 flex justify-between items-center ${
        dark ? "bg-gray-800 text-white" : "bg-white"
      }`}>
        <h1 className="text-xl font-bold text-blue-500">
          Finance Dashboard 💰
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="border px-3 py-1 rounded transition duration-300 hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {dark ? "Light" : "Dark"}
          </button>

          <select
            className={`px-3 py-1 rounded border transition ${
              dark
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Viewer</option>
            <option>Admin</option>
          </select>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* 🔥 CARDS WITH PREMIUM HOVER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className={`${dark ? "bg-gray-800" : "bg-white"} 
            p-5 rounded-2xl shadow 
            transition duration-300 
            hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03]`}>
            <h3 className="text-sm text-gray-400">Total Balance</h3>
            <p className="text-2xl font-bold text-blue-500 mt-1">₹50,000</p>
          </div>

          <div className={`${dark ? "bg-gray-800" : "bg-white"} 
            p-5 rounded-2xl shadow 
            transition duration-300 
            hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03]`}>
            <h3 className="text-sm text-gray-400">Income</h3>
            <p className="text-2xl font-bold text-green-500 mt-1">₹{totalIncome}</p>
          </div>

          <div className={`${dark ? "bg-gray-800" : "bg-white"} 
            p-5 rounded-2xl shadow 
            transition duration-300 
            hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03]`}>
            <h3 className="text-sm text-gray-400">Expenses</h3>
            <p className="text-2xl font-bold text-red-500 mt-1">₹{totalExpense}</p>
          </div>

        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className={`${dark ? "bg-gray-800" : "bg-white"} 
            p-4 rounded-2xl shadow 
            transition duration-300 hover:shadow-xl`}>
            <h3 className="mb-2 font-semibold">Balance Trend</h3>
            <LineChart width={300} height={250} data={[
              { month: "Jan", balance: 20000 },
              { month: "Feb", balance: 30000 },
              { month: "Mar", balance: 25000 },
              { month: "Apr", balance: 50000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="balance" stroke="#3b82f6" />
            </LineChart>
          </div>

          <div className={`${dark ? "bg-gray-800" : "bg-white"} 
            p-4 rounded-2xl shadow 
            transition duration-300 hover:shadow-xl`}>
            <h3 className="mb-2 font-semibold">Spending Breakdown</h3>
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  { name: "Food", value: 4000 },
                  { name: "Shopping", value: 3000 },
                  { name: "Travel", value: 2000 },
                ]}
                dataKey="value"
                outerRadius={80}
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

        </div>

        {/* Insights */}
        <div className={`${dark ? "bg-gray-800" : "bg-white"} 
          p-4 rounded-2xl shadow transition hover:shadow-xl`}>
          <h3 className="font-semibold mb-2">Insights</h3>
          <p>💡 Highest: {highestSpending.category || "N/A"}</p>
          <p>📊 Income: ₹{totalIncome}</p>
          <p>📉 Expense: ₹{totalExpense}</p>
        </div>

        {/* Transactions */}
        <div className={`${dark ? "bg-gray-800" : "bg-white"} 
          p-4 rounded-2xl shadow transition hover:shadow-xl`}>

          {role === "Admin" && (
            <button className="bg-blue-500 hover:bg-blue-600 hover:scale-105 transition text-white px-4 py-2 mb-4 rounded">
              + Add Transaction
            </button>
          )}

          <button
            onClick={exportCSV}
            className="bg-green-500 hover:bg-green-600 hover:scale-105 transition text-white px-4 py-2 mb-4 rounded ml-2"
          >
            Export CSV
          </button>

          {/* Filter + Search */}
          <div className="flex flex-col md:flex-row gap-2 mb-4">

            <select
              className={`p-2 rounded border ${
                dark
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              placeholder="Search category..."
              className={`p-2 rounded border w-full ${
                dark
                  ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                  : "bg-white text-black border-gray-300"
              }`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="overflow-x-auto">
            <table className="w-full border rounded">
              <thead>
                <tr className={dark ? "bg-gray-700" : "bg-gray-200"}>
                  <th className="p-2">Date</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Type</th>
                </tr>
              </thead>

              <tbody>
                {transactionsData
                  .filter(t => t.category.toLowerCase().includes(search.toLowerCase()))
                  .filter(t => filter === "all" ? true : t.type === filter)
                  .length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-400">
                      🚫 No data found
                    </td>
                  </tr>
                ) : (
                  transactionsData
                    .filter(t => t.category.toLowerCase().includes(search.toLowerCase()))
                    .filter(t => filter === "all" ? true : t.type === filter)
                    .map((t, i) => (
                      <tr key={i} className="text-center border-t hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="p-2">{t.date}</td>
                        <td className="p-2">₹{t.amount}</td>
                        <td className="p-2">{t.category}</td>
                        <td className="p-2">{t.type}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;