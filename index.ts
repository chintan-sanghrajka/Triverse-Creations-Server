import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mergedResolvers from "./resolvers";
import mergedTypeDefs from "./typeDefs";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer, BaseContext } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import authRouter from "./routers/auth-router";
import categoriesRouter from "./routers/categories-router";
import subCategoriesRouter from "./routers/sub-categories-router";

const createServer = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.static(__dirname));

  app.use(authRouter);
  app.use(categoriesRouter);
  app.use(subCategoriesRouter);

  const httpServer = http.createServer(app);

  const server = new ApolloServer<BaseContext>({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  dotenv.config();

  await server.start();

  const PORT = process.env.PORT;

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })
  );

  app.listen(PORT, () => {
    console.log("Triverse Creations server running on PORT: ", PORT);
  });
};

createServer();

// Company Motto:
// "Building Dreams, Layer by Layer"

// Tagline:
// "Precision in Every Print, Revolutionizing Possibilities"

// Tagline:
// "Unleashing the Future, One Print at a Time"
