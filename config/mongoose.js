const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

async function connectToInMemoryMongoDB() {
  const mongoServer = await MongoMemoryServer.create();

  try {
    const uri = await mongoServer.getUri();
    // if need to use mongodb server pass MONGO_DB_URL in .env or else application will be using in memory mongo data will be lost if server restarts
    await mongoose.connect(process.env.MONGO_DB_URL || uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to the MongoDB server');
  } catch (err) {
    console.error('Failed to connect to the MongoDB server:', err);
    process.exit(1);
  }
}

connectToInMemoryMongoDB();

const ItemSchema = new mongoose.Schema({
  movie_title: String,
  movie_id: String,
  is_favourite: {
    type: Boolean,
    default: false,
  },
  extra_info: Object
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = { Item };
