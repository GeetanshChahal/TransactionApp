import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Table, Input, Button, DatePicker, message, Modal, Select } from "antd";

const { Option } = Select;

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("credit");
  const [newTransaction, setNewTransaction] = useState({
    date: null,
    description: "",
    credit: 0,
    debit: 0,
  });

  const handleChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, dateString) => {
    setNewTransaction({ ...newTransaction, date: dateString });
  };

  const handleTypeChange = (value) => {
    setTransactionType(value);
    setNewTransaction({
      ...newTransaction,
      credit: value === "credit" ? newTransaction.credit : 0,
      debit: value === "debit" ? newTransaction.debit : 0,
    });
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/transactions");
      setTransactions(res?.data);
    } catch (err) {
      message.error("Error fetching transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async () => {
    if (!newTransaction.date || !newTransaction.description) {
      message.warning("Please fill all required fields");
      return;
    }
    try {
      await axios.post("http://localhost:5000/transactions", newTransaction);
      fetchTransactions();
      setNewTransaction({ date: null, description: "", credit: 0, debit: 0 });
      message.success("Transaction added successfully");
      setIsModalOpen(false);
    } catch (err) {
      message.error("Error adding transaction");
    }
  };

  const columns = [
    {
      title: "Date",
      width: 200,
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Description",
      width: 250,
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Credit",
      dataIndex: "credit",
      width: 200,
      key: "credit",
      render: (credit) => (credit ? credit : "-"),
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      width: 200,
      render: (debit) => (debit ? debit : "-"),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 200,
      render: (balance) => (balance ? balance : "-"),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Transaction System</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Transaction +
        </Button>
      </div>
      <Table
        style={{ width: "100%" }}
        dataSource={transactions}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 6 }}
      />
      <Modal
        title="Add Transaction"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={addTransaction}
      >
        <DatePicker
          onChange={handleDateChange}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <Input
          placeholder="Description"
          name="description"
          value={newTransaction.description}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <Select
          defaultValue="credit"
          style={{ width: "100%", marginBottom: 10 }}
          onChange={handleTypeChange}
        >
          <Option value="credit">Credit</Option>
          <Option value="debit">Debit</Option>
        </Select>
        <Input
          type="number"
          placeholder="Amount"
          name={transactionType}
          value={newTransaction[transactionType]}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </Modal>
    </div>
  );
};

export default TransactionTable;
