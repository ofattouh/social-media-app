const express = require('express');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');

const resolvers = require('./resolvers.js');
const typeDefs = require('./typeDefs.js');

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, connection }) => ({
    token: req ? req.headers.authorization : connection.context.authorization,
  }),
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 4000 }, () => {
  console.log('Apollo Server on http://localhost:4000/graphql');
});

// package.json
// expo install apollo-server apollo-server-express 
// expo install bcryptjs express faker
// expo install graphql graphql-tools
// expo install http jsonwebtoken node-fetch
// expo install nodemon
