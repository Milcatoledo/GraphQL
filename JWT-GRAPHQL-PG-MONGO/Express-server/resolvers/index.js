const persona = require('./personaResolvers');
const user = require('./userResolvers') || {};
const auth = require('./authResolvers');

const Query = Object.assign({}, persona.Query || {}, user.Query || {}, auth.Query || {});
const Mutation = Object.assign({}, persona.Mutation || {}, user.Mutation || {}, auth.Mutation || {});

module.exports = { Query, Mutation };
