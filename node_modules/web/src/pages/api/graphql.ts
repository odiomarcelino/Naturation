import { createSchema, createYoga } from 'graphql-yoga';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function openDb() {
  return open({
    filename: './stats.sqlite',
    driver: sqlite3.Database,
  });
}

const typeDefs = /* GraphQL */ `
  type Stat {
    type: String!
    count: Int!
  }
  type Query {
    stats: [Stat!]!
  }
`;

const resolvers = {
  Query: {
    stats: async () => {
      const db = await openDb();
      const rows = await db.all('SELECT type, COUNT(*) as count FROM events GROUP BY type');
      return rows;
    },
  },
};

export default createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: '/api/graphql',
});

export const config = {
  api: {
    bodyParser: false,
  },
};
