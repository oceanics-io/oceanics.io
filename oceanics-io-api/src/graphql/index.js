// https://www.apollographql.com/docs/apollo-server/v2/deployment/netlify/
import { ApolloServer, gql } from "apollo-server-lambda";

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => {
      return "Hello, world!";
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

exports.handler = server.createHandler();