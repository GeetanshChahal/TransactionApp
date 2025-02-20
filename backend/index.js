require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://geetanshchahal:geetansh@cluster0.ttioz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDb connected!!");
  })
  .catch((err) => console.log(err));

const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  credit: { type: Number, required: true },
  debit: { type: Number, required: true },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

app.post("/transactions", async (req, res) => {
  try {
    const { date, description, credit, debit } = req.body;
    const transaction = new Transaction({ date, description, credit, debit });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: 1 });
    let balance = 0;
    const latestTransactions = transactions.map((x) => {
      balance += x.credit - x.debit;
      return { ...x.toObject(), balance };
    });
    res.json(latestTransactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
