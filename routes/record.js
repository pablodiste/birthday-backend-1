const express = require("express");
const sha1 = require("sha1");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This section will help you get a list of all the records.
recordRoutes.route("/users").get(async function (req, res) {
  let users = await dbo.usersCollection()
  users.find({}).limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});

// This section will help you create a new record.
recordRoutes.route("/users/:userId/").get(async function (req, res) {
  let usersCollection = await dbo.usersCollection()
  let user = await usersCollection.findOne({ userId: req.params.userId })
  console.log(user)
  res.json(user);
});

// This section will help you create a new record.
recordRoutes.route("/users/:userId/contacts/").get(async function (req, res) {
  let usersCollection = await dbo.usersCollection()
  let user = await usersCollection.findOne({ userId: req.params.userId })
  res.json(user.contacts);
});

// This section will help you create a new record.
recordRoutes.route("/users/:userId/contacts/").post(async function (req, res) {
  let usersCollection = await dbo.usersCollection()

  const input = req.body
  input.id = sha1(input.name)
  const filter = { userId: req.params.userId };
  //const options = { upsert: true };
  const options = {}
  const updateDoc = {
    $push: { contacts: input },
  };
  const result = await usersCollection.updateOne(filter, updateDoc, options);
  console.log(
    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
  );

  let user = await usersCollection.findOne({ userId: req.params.userId })
  res.json(user.contacts.filter( (item) => item.id == input.id )[0]);
});

// This section will help you create a new record.
recordRoutes.route("/users/:userId/contacts/:contactId").delete(async function (req, res) {
  let contactId = req.params.contactId;
  let userId = req.params.userId;
  let usersCollection = await dbo.usersCollection();

  const filter = { userId: userId };
  //const options = { upsert: true };
  const options = {}
  const updateDoc = {
    $pull: { contacts: { id: contactId } },
  };
  const result = await usersCollection.updateOne(filter, updateDoc, options);
  console.log(
    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
  );
  res.json({ result: 'success' });
});

module.exports = recordRoutes;
