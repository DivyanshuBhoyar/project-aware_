"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const hello_1 = require("./resolvers/hello");
const type_graphql_1 = require("type-graphql");
const bye_1 = require("./resolvers/bye");
const register_1 = require("./resolvers/register");
const main = async () => {
    const app = (0, express_1.default)();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchemaSync)({
            resolvers: [hello_1.HelloResolver, register_1.RegisterResolver, bye_1.ByeResolver],
            validate: true,
        }),
        context: ({ req, res }) => ({ req, res })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: true });
    app.listen(4000, () => console.log('🚀 Server started on port 4000'));
};
main().catch(err => console.error(err));
//# sourceMappingURL=server.js.map