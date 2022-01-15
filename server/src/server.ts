import 'reflect-metadata'
import express from 'express';
import { createConnection } from 'typeorm';
// import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { buildSchemaSync } from 'type-graphql';
import { ByeResolver } from './resolvers/bye';
import { StoryResolver } from './resolvers/story';
import { AuthResolver } from './resolvers/auth';
import { httpRouter } from './resolvers/http';


const main = async () => {
    const app = express();
    await createConnection()

    app.use('/api', httpRouter)
    app.get('/hello', (_, res) => res.send('hello world'))

    const apolloServer = new ApolloServer({
        schema: await buildSchemaSync({
            resolvers: [ByeResolver, StoryResolver, AuthResolver],
        }),
        context: ({ req, res }) => ({ req, res })
    })
    await apolloServer.start()
    apolloServer.applyMiddleware({ app, cors: true });
    app.listen(4000, () => console.log('🚀 Server started on port 4000'));
}

main().catch(err => console.error(err));