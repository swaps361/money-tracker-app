const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.addTransaction = async (req, res) => {
    try {
        const { type, amount, description } = req.body;
        const newTransaction = new Transaction({ type, amount, description });
        await newTransaction.save();
        res.json(newTransaction);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        await transaction.remove();
        res.json({ message: 'Transaction removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
