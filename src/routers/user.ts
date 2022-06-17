import * as hapi from "@hapi/hapi";
import * as Wreck from "@hapi/wreck";
import client from "../httpClient";

export type LoginBodyType = {
  username?: string;
  password?: string;
  type?: string;
};

let access = "";

const waitTime = (time: number = 100): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const userRouters: Array<hapi.ServerRoute> = [
  {
    method: "GET",
    path: "/api/currentUser",
    handler: async function (request: hapi.Request, h: hapi.ResponseToolkit) {
      return {
        success: true,
        data: {
          name: "Serati Ma",
          avatar:
            "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
          userid: "00000001",
          email: "antdesign@alipay.com",
          signature: "海纳百川，有容乃大",
          title: "交互专家",
          group: "蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED",
          tags: [
            {
              key: "0",
              label: "很有想法的",
            },
            {
              key: "1",
              label: "专注设计",
            },
            {
              key: "2",
              label: "辣~",
            },
            {
              key: "3",
              label: "大长腿",
            },
            {
              key: "4",
              label: "川妹子",
            },
            {
              key: "5",
              label: "海纳百川",
            },
          ],
          notifyCount: 12,
          unreadCount: 11,
          country: "China",
          access: access,
          geographic: {
            province: {
              label: "浙江省",
              key: "330000",
            },
            city: {
              label: "杭州市",
              key: "330100",
            },
          },
          address: "西湖区工专路 77 号",
          phone: "0752-268888888",
        },
      };
    },
  },
  {
    method: "GET",
    path: "/api/users",
    handler: function (
      request: hapi.Request,
      h: hapi.ResponseToolkit
    ): hapi.Lifecycle.ReturnValue {
      return [
        {
          key: "1",
          name: "John Brown",
          age: 32,
          address: "New York No. 1 Lake Park",
        },
        {
          key: "2",
          name: "Jim Green",
          age: 42,
          address: "London No. 1 Lake Park",
        },
        {
          key: "3",
          name: "Joe Black",
          age: 32,
          address: "Sidney No. 1 Lake Park",
        },
      ];
    },
  },

  // 登录接口
  {
    method: "POST",
    path: "/api/login/account",
    handler: (
      request: hapi.Request,
      h: hapi.ResponseToolkit
    ): hapi.Lifecycle.ReturnValue => {
      const { username, password, type } = request.payload as LoginBodyType;

      if (password === "ant.design" && username === "admin") {
        access = "admin";
        return {
          status: "ok",
          type,
          currentAuthority: "admin",
        };
      }
      if (password === "ant.desgin" && username === "user") {
        access = "user";
        return {
          status: "ok",
          type,
          currentAuthority: "user",
        };
      }

      if (type === "mobile") {
        access = "admin";
        return {
          status: "ok",
          type,
          currentAuthority: "admin",
        };
      }
    },
  },

  // 登出接口
  {
    method: "POST",
    path: "/api/login/outLogin",
    handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
      access = "";
      return {
        data: {},
        success: true,
      };
    },
  },

  // 注册
  {
    method: "POST",
    path: "/api/register",
    handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
      return {
        status: "ok",
        currentAuthority: "user",
        success: true,
      };
    },
  },
  // 500
  {
    method: "GET",
    path: "/api/500",
    handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
      const response = h.response({
        timestamp: 1513932555104,
        status: 500,
        error: "error",
        message: "error",
        path: "/base/category/list",
      });
      response.code(500);
      return response;
    },
  },

  // 404
  {
    method: "GET",
    path: "/api/404",
    handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
      const response = h.response({
        timestamp: 1513932643431,
        status: 404,
        error: "Not Found",
        message: "No message available",
        path: "/base/category/list/2121212",
      });
      response.code(404);
      return response;
    },
  },

  // 403
  {
    method: "GET",
    path: "/api/403",
    handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
      const response = h.response({
        timestamp: 1513932555104,
        status: 403,
        error: "Forbidden",
        message: "Forbidden",
        path: "/base/category/list",
      });
      response.code(403);
      return response;
    },
  },

  // 401
  {
    method: "GET",
    path: "/api/401",
    handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
      const response = h.response({
        timestamp: 1513932555104,
        status: 401,
        error: "Unauthorized",
        message: "Unauthorized",
        path: "/base/category/list",
      });
      response.code(401);
      return response;
    },
  },

  {
    method: "GET",
    path: "/api/login/captcha",
    handler: async (request: hapi.Request, h: hapi.ResponseToolkit) => {
      await waitTime(2000);
      return "captcha-xxx";
    },
  },
];

export default userRouters;
