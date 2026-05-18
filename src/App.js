// App.js

import React, {
  useState,
  useEffect
} from "react";

import Modal from "react-modal";

import {
  FaTrash,
  FaEdit
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

import "./styles/app.css";

Modal.setAppElement("#root");

function App() {

  // WALLET BALANCE
  const [walletBalance, setWalletBalance] =
    useState(5000);

  // INCOME
  const [income, setIncome] =
    useState("");

  // EXPENSES
  const [expenses, setExpenses] =
    useState([]);

  // MODAL
  const [isOpen, setIsOpen] =
    useState(false);

  // FORM STATES
  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [date, setDate] =
    useState("");

  // EDIT STATE
  const [editId, setEditId] =
    useState(null);

  // LOAD LOCAL STORAGE
  useEffect(() => {

    const savedExpenses =
      JSON.parse(
        localStorage.getItem("expenses")
      ) || [];

    const savedWallet =
      localStorage.getItem(
        "walletBalance"
      );

    setExpenses(savedExpenses);

    if (savedWallet) {
      setWalletBalance(
        Number(savedWallet)
      );
    }

  }, []);

  // SAVE LOCAL STORAGE
  useEffect(() => {

    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses)
    );

    localStorage.setItem(
      "walletBalance",
      walletBalance
    );

  }, [expenses, walletBalance]);

  // ADD INCOME
  const addIncome = () => {

    if (!income || income <= 0) {
      return;
    }

    setWalletBalance(
      walletBalance + Number(income)
    );

    setIncome("");
  };

  // OPEN MODAL
  const openExpenseModal = () => {

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
    setEditId(null);

    setIsOpen(true);
  };

  // CLOSE MODAL
  const closeExpenseModal = () => {
    setIsOpen(false);
  };

  // ADD / UPDATE EXPENSE
  const handleAddExpense = (e) => {

    e.preventDefault();

    // VALIDATION
    if (
      !title ||
      !amount ||
      !category ||
      !date
    ) {
      alert("Please fill all fields");
      return;
    }

    // EDIT EXPENSE
    if (editId) {

      const oldExpense =
        expenses.find(
          (item) =>
            item.id === editId
        );

      const balanceAfterRefund =
        walletBalance +
        oldExpense.amount;

      if (
        Number(amount) >
        balanceAfterRefund
      ) {
        alert(
          "Insufficient Wallet Balance"
        );
        return;
      }

      const updatedExpenses =
        expenses.map((item) =>

          item.id === editId
            ? {
                ...item,
                title,
                amount: Number(amount),
                category,
                date
              }
            : item
        );

      setExpenses(updatedExpenses);

      setWalletBalance(
        balanceAfterRefund -
        Number(amount)
      );

      setEditId(null);

    } else {

      // ADD EXPENSE

      if (
        Number(amount) >
        walletBalance
      ) {
        alert(
          "Insufficient Wallet Balance"
        );
        return;
      }

      const newExpense = {
        id: Date.now(),
        title,
        amount: Number(amount),
        category,
        date
      };

      setExpenses([
        ...expenses,
        newExpense
      ]);

      setWalletBalance(
        walletBalance -
        Number(amount)
      );
    }

    // CLEAR FORM
    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");

    // CLOSE MODAL
    closeExpenseModal();
  };

  // DELETE EXPENSE
  const deleteExpense = (id) => {

    const deletedExpense =
      expenses.find(
        (item) => item.id === id
      );

    // REFUND WALLET
    setWalletBalance(
      walletBalance +
      deletedExpense.amount
    );

    // REMOVE EXPENSE
    const updatedExpenses =
      expenses.filter(
        (item) => item.id !== id
      );

    setExpenses(updatedExpenses);
  };

  // EDIT EXPENSE
  const editExpense = (expense) => {

    setTitle(expense.title);

    setAmount(expense.amount);

    setCategory(expense.category);

    setDate(expense.date);

    setEditId(expense.id);

    setIsOpen(true);
  };

  // TOTAL EXPENSES
  const totalExpenses =
    expenses.reduce(
      (total, item) =>
        total + item.amount,
      0
    );

  // CHART DATA
  const chartData = [

    {
      name: "Food",
      value: expenses
        .filter(
          (item) =>
            item.category === "Food"
        )
        .reduce(
          (total, item) =>
            total + item.amount,
          0
        )
    },

    {
      name: "Entertainment",
      value: expenses
        .filter(
          (item) =>
            item.category ===
            "Entertainment"
        )
        .reduce(
          (total, item) =>
            total + item.amount,
          0
        )
    },

    {
      name: "Travel",
      value: expenses
        .filter(
          (item) =>
            item.category === "Travel"
        )
        .reduce(
          (total, item) =>
            total + item.amount,
          0
        )
    }

  ];

  // CHART COLORS
  const COLORS = [
    "#A000FF",
    "#FF9300",
    "#FDE006"
  ];

  return (

    <div className="app">

      <h1>
        Expense Tracker
      </h1>

      {/* TOP SECTION */}

      <div className="top-section">

        {/* WALLET CARD */}

        <div className="card">

          <h2>
            Wallet Balance:
            <br />
            ₹{walletBalance}
          </h2>

          {/* INCOME INPUT */}

          <input
            type="number"
            name="income"
            placeholder="Income Amount"
            value={income}
            onChange={(e) =>
              setIncome(
                e.target.value
              )
            }
            className="income-input"
          />
           <button
        type="submit"
         className="income-btn"
           onClick={addIncome}
             >
            Add Balance
           </button>

        </div>

        {/* EXPENSE CARD */}

        <div className="card">

          <h2>
            Expenses:
            <br />
            ₹{totalExpenses}
          </h2>

          <button
            className="expense-btn"
            onClick={
              openExpenseModal
            }
          >
            + Add Expense
          </button>

        </div>

      </div>

      {/* CHARTS */}

      <div className="charts-section">

        {/* PIE CHART */}

        <div className="chart-box">

          <h2>
            Expense Summary
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >

                {
                  chartData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
                        }
                      />

                    )
                  )
                }

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* BAR CHART */}

        <div className="chart-box">

          <h2>
            Top Expenses
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={chartData}
            >

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#8884d8"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* RECENT TRANSACTIONS */}

      <div className="expense-list">

        <h2>
          Recent Transactions
        </h2>

        {
          expenses.length === 0 ? (

            <p>
              No expenses added
            </p>

          ) : (

            expenses.map((item) => (

              <div
                className="expense-item"
                key={item.id}
              >

                <div>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.category}
                    {" | "}
                    {item.date}
                  </p>

                </div>

                <div className="expense-actions">

                  <h3>
                    ₹{item.amount}
                  </h3>

                  {/* EDIT BUTTON */}

                  <button
                    className="edit-btn"
                    onClick={() =>
                      editExpense(item)
                    }
                  >
                    <FaEdit />
                  </button>

                  {/* DELETE BUTTON */}

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteExpense(item.id)
                    }
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>

            ))
          )
        }

      </div>

      {/* MODAL */}

      <Modal
        isOpen={isOpen}
        onRequestClose={
          closeExpenseModal
        }
        className="modal"
        overlayClassName="overlay"
      >

        <h2>

          {
            editId
              ? "Edit Expense"
              : "Add Expense"
          }

        </h2>

        <form
          className="expense-form"
          onSubmit={
            handleAddExpense
          }
        >

          {/* TITLE */}

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

          {/* PRICE */}

          <input
            type="number"
            name="price"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
          />

          {/* CATEGORY */}

          <select
            name="category"
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
          >

            <option value="">
              Select Category
            </option>

            <option value="Food">
              Food
            </option>

            <option value="Entertainment">
              Entertainment
            </option>

            <option value="Travel">
              Travel
            </option>

          </select>

          {/* DATE */}

          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
          />

          {/* BUTTONS */}

          <div className="modal-buttons">

            <button
              type="submit"
              className="submit-btn"
            >

              {
                editId
                  ? "Update Expense"
                  : "Add Expense"
              }

            </button>

            <button
              type="button"
              onClick={
                closeExpenseModal
              }
            >
              Cancel
            </button>

          </div>

        </form>

      </Modal>

    </div>
  );
}

export default App;