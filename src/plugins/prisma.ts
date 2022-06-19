import { PrismaClient } from "@prisma/client";
import * as Hapi from "@hapi/hapi";

declare module "@hapi/hapi" {
  interface ServerApplicationState {
    prisma: PrismaClient;
  }
}

const prismaPlugin: Hapi.Plugin<null> = {
  name: "prisma",
  register: async (server: Hapi.Server) => {
    const prisma = new PrismaClient();

    server.app.prisma = prisma;

    server.ext({
      type: "onPostStop",
      method: async (server: Hapi.Server) => {
        server.app.prisma.$disconnect();
      },
    });
  },
};

export default prismaPlugin;
