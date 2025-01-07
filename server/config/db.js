const mongoose = require('mongoose');

const { MongoClient } = require("mongodb");

const connectDB = async () => {

    // Replace the uri string with your connection string.
    // const uri = process.env.MONGO_URI;
    // const client = new MongoClient(uri);    

    // try {
    //     const database = client.db('nf-database');
    //     const movies = database.collection('movies');
    //     // Query for a movie that has the title 'Back to the Future'
    //     const query = { title: 'Back to the Future' };
    //     const movie = await movies.findOne(query);
    //     console.log(movie);
    //   } catch(e){
    //     console.log("Failed MongoDB connection");
    //     console.log(e);
    //   }


  try {
    await mongoose.connect(process.env.MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
