const DataLoader = require('dataloader');
const User = require('../models/user');

const batchUsers = async (ids) => {
  const intIds = ids.map(id => parseInt(id, 10));
  const users = await User.findByIds(intIds);
  const userMap = {};
  users.forEach(u => { if (u) userMap[u._id.toString()] = u; });
  return ids.map(id => userMap[id.toString()] || null);
};

function createLoaders() {
  return {
    userLoader: new DataLoader(batchUsers, { cache: true }),
  };
}

module.exports = { createLoaders };
