import * as hapi from "@hapi/hapi";
import * as hapiSwagger from "hapi-swagger";
import * as vision from "@hapi/vision";
import * as inert from "@hapi/inert";
import * as packageJson from "../package.json";

import routers from "./routers";

const server: hapi.Server = new hapi.Server({
  host: "localhost",
  port: 8000,
});

const swaggerOptions: hapiSwagger.RegisterOptions = {
  info: {
    title: "Hapi Typescript Demo Document",
    version: packageJson.version,
  },
};

// routers
server.route(routers);

// run
const start = async () => {
  try {
    await server.register([
      vision,
      inert,
      {
        plugin: hapiSwagger,
        options: swaggerOptions,
      },
    ]);
    await server.start();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  console.log("Server running at:", server.info.uri);
};

process.on("unhandledRejection", (err: Error) => {
  console.log(err);
  process.exit(1);
});

start();
