import * as Hapi from "@hapi/hapi";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const secretToken =
  "47df8937b0b175ae7c5e297c69153c7cb0e675e6ad485039cbd9313b8ba39a41259d4ccef4f5c8033db20b643ab0dd687808bc8503750c6c87968711ca4";

const usersPlugin: Hapi.Plugin<null> = {
  name: "api/users",
  dependencies: ["prisma"],
  register: async (server: Hapi.Server) => {
    console.log("users routers");
    server.route([
      {
        method: "POST",
        path: "/signup",
        handler: signUpHandler,
      },
      {
        method: "POST",
        path: "/login",
        handler: loginHandler,
      },
      {
        method: "GET",
        path: "/whoami",
        handler: whoamiHandler,
      },
    ]);
  },
};

export default usersPlugin;

// handlers

// signup handler
async function signUpHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;
  const { name, password } = request.payload as any;
  const password_digest = await bcrypt.hash(password, 10);

  try {
    const createdUser = await prisma.user.create({
      data: {
        nikename: name,
        password_digest,
      },
    });
    return h.response(createdUser).code(201);
  } catch (error: any) {
    console.log(error.message);
    return h
      .response({
        error: error.message,
      })
      .code(500);
  }
}

// login handler
async function loginHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;
  const { name, password } = request.payload as any;

  try {
    const user = await prisma.user.findUnique({
      where: {
        nikename: name,
      },
    });
    if (user) {
      const validatePass = await bcrypt.compare(password, user.password_digest);
      if (validatePass) {
        const jwtToken = jwt.sign(
          {
            id: user.id,
          },
          secretToken
        );
        return h
          .response({
            token: jwtToken,
          })
          .code(200);
      } else {
        return h
          .response({
            error: "用户名或者密码错误",
          })
          .code(400);
      }
    } else {
      return h
        .response({
          error: "用户名或者密码错误",
        })
        .code(400);
    }
  } catch (error) {}
}

async function whoamiHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;
  const token = request.headers["token"];
  console.log(token);

  try {
    const verify = jwt.verify(token, secretToken) as jwt.VerifyOptions & {
      id: string;
    };

    console.log(verify);
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(verify.id),
      },
    });
    if (user) {
      return h.response(delete user.password_digest && user).code(200);
    }
  } catch (error: any) {
    return h
      .response({
        error: error.message,
      })
      .code(401);
  }
  return h
    .response({
      data: "ok",
    })
    .code(200);
}
