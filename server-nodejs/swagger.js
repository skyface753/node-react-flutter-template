const swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");

const DisableTryItOutPlugin = function () {
  return {
    statePlugins: {
      spec: {
        wrapSelectors: {
          allowTryItOutFor: () => () => false,
        },
      },
    },
  };
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SkyManager API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  swaggerOptions: {
    plugins: [DisableTryItOutPlugin],
  },
  apis: ["./services/*.js"], // files containing annotations as above
};
const openapiSpecification = swaggerJsdoc(options);

const swaggerDocsObj = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(openapiSpecification),
};
module.exports = swaggerDocsObj;
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
