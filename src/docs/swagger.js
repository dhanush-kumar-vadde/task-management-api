const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "API documentation for Task Management System"
    },

    servers: [
      {
        url: "http://localhost:5000"
      }
    ],

    tags: [
      {
        name: "Auth",
        description: "Authentication APIs"
      },
      {
        name: "Users",
        description: "User profile management"
      },
      {
        name: "Projects",
        description: "Project management APIs"
      },
      {
        name: "Tasks",
        description: "Task management APIs"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },

  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;