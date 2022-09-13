const swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "jwt",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ["./doc-models/*.yaml"], // files containing annotations as above
};
const openapiSpecification = swaggerJsdoc(options);

const swaggerDocsObj = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(openapiSpecification),
};
module.exports = swaggerDocsObj;
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
