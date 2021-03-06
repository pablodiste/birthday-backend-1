const { MongoClient } = require("mongodb");
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let clientPromise;

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    clientPromise = client.connect();
    console.log("Connected to mongo client");
    return callback();
    /*
    clientPromise = client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("birthdays");
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
    */
  },

  getDb: function () {
    return dbConnection;
  },

  getClientPromise: function() {
    return clientPromise;
  },

  usersCollection: async function() {
    const client = await this.getClientPromise()
    return client.db("birthdays").collection("users")
  }
};