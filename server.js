const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transaction'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/wallets', require('./routes/wallet'));
app.use('/api/budgets', require('./routes/budget'));
app.use('/api/reports', require('./routes/report'));

app.get('/', (req, res) => {
  res.json({ message: 'DailyExpense API Running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));