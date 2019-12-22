const User = require('../models/user');

//Get all users data
function getAllUsers() {
  return User.find({}).select({username: "test", email: "test@gmail.com", whitelisted: true});
}

// Whitelist or Blacklist a user
function updateWhitelist(id, status) {
  return User.findById(id).update({whitelisted: status});
}

module.exports = {getAllUsers, updateWhitelist};