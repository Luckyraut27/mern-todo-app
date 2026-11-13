
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI?.trim();

  if (!uri) {
    throw new Error('MONGO_URI is missing in Render Environment');
  }

  if (!uri.startsWith('mongodb://') &&
      !uri.startsWith('mongodb+srv://')) {
    throw new Error('Invalid MongoDB URI format. Check Render MONGO_URI.');
  }

  const conn = await mongoose.connect(uri);

  console.log('MongoDB connected:', conn.connection.host);
};

module.exports = connectDB;
