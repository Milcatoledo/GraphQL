const DataLoader = require('dataloader');
const User = require('../models/user');

const batchUsers = async (ids) => {
  const objectIds = ids.map(id => id);
  const users = await User.find({ _id: { $in: objectIds } });
  const userMap = {};
  users.forEach(u => { userMap[u._id.toString()] = u; });
  return ids.map(id => userMap[id.toString()] || null);
};

function createLoaders() {
  return {
    userLoader: new DataLoader(batchUsers, { cache: true }),
  };
}

module.exports = { createLoaders };
