const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Ensure you have a well-formed URI in your environment variable.
    // Example .env entry:
    //MONGODB_URI="mongodb+srv://kondurukalyan555:YourEncodedPassword@cluster0.knn249w.mongodb.net/yourdbname?retryWrites=true&w=majority"
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ticketmaster-clone';
    
    // Optional: Pass additional connection options
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
