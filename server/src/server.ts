import 'reflect-metadata'
import express from 'express';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { buildSchemaSync } from 'type-graphql';
import jwt from 'express-jwt';
// import path from 'path';
import { ByeResolver } from './resolvers/bye';
import { StoryResolver } from './resolvers/story';
import { AuthResolver } from './resolvers/auth';
import { httpRouter } from './resolvers/http';
import { StoryCRUDResolver } from './resolvers/storyCRUD';
import { customAuthChecker } from './utils/authCheck';

const main = async () => {
    const app = express();
    await createConnection();
    console.log('💽 CockroachDB connected');

    await mongoose.connect('mongodb+srv://hatwaarbeta:mongo7038@devcluster0.hdvnq.mongodb.net/aware?retryWrites=true&w=majority')
    console.log("🏪 Mongodb Atlas connected")
    const path = '/graphql';

    app.use('/api', httpRouter)
    app.get('/hello', (_, res) => res.send('hello world'))

    const apolloServer = new ApolloServer({
        schema: await buildSchemaSync({
            resolvers: [ByeResolver, StoryCRUDResolver, StoryResolver, AuthResolver],
            authChecker: customAuthChecker
        }),
        context: ({ req, res }: any) => ({
            req: {
                ...req,
                user: req.user
            },
            res,          // authorsLoader: createAuthorsLoader()
        }),
    })

    app.use(path, jwt({
        secret: "KALASH SECRET",
        credentialsRequired: false,
        algorithms: ["HS256"],
        // ignoreExpiration: true
    }), function (err, _req, _res, next) {
        if (err.code === 'invalid_token') return next();
        return next(err);
    })

    await apolloServer.start()
    apolloServer.applyMiddleware({ app, cors: true });
    app.listen(4000, () => console.log('🚀🚀🚀 Server started on port 4000'));
}

main().catch(err => console.error(err));