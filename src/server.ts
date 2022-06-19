import * as hapi from "@hapi/hapi";
import * as Joi from "joi";
import * as hapiSwagger from "hapi-swagger";
import * as vision from "@hapi/vision";
import * as inert from "@hapi/inert";
import * as packageJson from "../package.json";

import routers from "./routers";
import prismaPlugin from "./plugins/prisma";
import usersPlugin from "./plugins/users";

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

const schema: Joi.ObjectSchema<any> = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  repeat_password: Joi.ref("password"),
  access_token: [Joi.string(), Joi.number()],
  birth_year: Joi.number().integer().min(1900).max(2013),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: {
      allow: ["com", "net"],
    },
  }),
})
  .with("username", "birth_year")
  .xor("password", "access_token")
  .with("password", "repeat_password");

// console.log(
//   schema.validate({
//     username: "abc",
//     birth_year: 1994,
//     password: "123456",
//     repeat_password: "1234567",
//   }).error.message
// );

// run
const start = async () => {
  try {
    await server.register([prismaPlugin, usersPlugin]);

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
