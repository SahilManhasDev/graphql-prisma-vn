import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers/user.js';
import movieResolvers from './resolvers/movie.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;
const typeDefs = fs.readFileSync('./src/schema.graphql', 'utf-8');

const schema = makeExecutableSchema({
    typeDefs,
    resolvers: [resolvers, movieResolvers]
});

const server = new ApolloServer({
    schema,
    context: ({ req }) => {
        const token = req.headers.authorization || '';
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            return { user: decoded };
        } catch (error) {
            return { user: null };
        }
    },
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});