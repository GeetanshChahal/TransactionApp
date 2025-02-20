import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  // const [transactionType, setTransactionType] = useState("credit");
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    description: "",
    credit: 0,
    debit: 0,
  });
  const handleChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/transactions");
      console.log("res", res?.data);
      setTransactions(res?.data);
    } catch (err) {
      console.log("Error while adding transaction:", err);
    }
  };

  useEffect(() => {
    console.log(transactions);
  }, [transactions]);

  const addTransaction = async () => {
    try {
      await axios.post("http://localhost:5000/transactions", newTransaction);
      fetchTransactions();
      setNewTransaction({
        date: "",
        description: "",
        credit: 0,
        debit: 0,
      });
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <h1>Transaction System</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th style={{ width: "200px" }}>Date</th>
            <th style={{ width: "200px" }}>Description</th>
            <th style={{ width: "200px" }}>Credit</th>
            <th style={{ width: "200px" }}>Debit</th>
            <th style={{ width: "200px" }}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((txn, index) => (
            <tr key={index}>
              <td>{moment(txn?.date).format("YYYY-MM-DD")}</td>
              <td>{txn?.description}</td>
              <td>{txn?.credit ? txn?.credit : "-"}</td>
              <td>{txn?.debit ? txn?.debit : "-"}</td>
              <td>{txn?.balance ? txn?.balance : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3>Add Transaction</h3>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          name="date"
          value={newTransaction.date}
          onChange={handleChange}
        />
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          name="description"
          value={newTransaction.description}
          onChange={handleChange}
        />
        {/* <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value={"credit"}>Credit</option>
          <option value={"debit"}>Debit</option>
        </select> */}
        <label htmlFor="credit">Credit:</label>
        <input
          type="number"
          name="credit"
          placeholder="credit"
          value={newTransaction.credit}
          onChange={handleChange}
        />
        <label htmlFor="debit">Debit:</label>
        <input
          type="number"
          name="debit"
          placeholder="debit"
          value={newTransaction.debit}
          onChange={handleChange}
        />
        <button onClick={addTransaction}>Add+</button>
      </div>
    </div>
  );
};

export default TransactionTable;
