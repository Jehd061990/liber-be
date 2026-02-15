const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Liber API",
    version: "1.0.0",
    description: "API documentation for liber-be",
  },
  tags: [
    { name: "Auth", description: "Authentication" },
    { name: "Books", description: "CRUD for books" },
    { name: "Readers", description: "CRUD for readers" },
    { name: "Health", description: "Health checks" },
  ],
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server",
    },
    {
      url: "https://liber-be.onrender.com",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Jane Doe" },
          email: { type: "string", example: "jane@example.com" },
          password: { type: "string", example: "secret123" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "jane@example.com" },
          password: { type: "string", example: "secret123" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          user: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
            },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      Book: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          bookAuthor: { type: "string" },
          isbn: { type: "string" },
          publisher: { type: "string" },
          category: { type: "string" },
          description: { type: "string" },
          genre: { type: "string" },
          coverImage: { type: "string" },
          barcode: { type: "string" },
          qrCode: { type: "string" },
          shelfLocation: { type: "string" },
          status: { type: "string" },
          availableCopies: { type: "number" },
          totalCopies: { type: "number" },
          publishedYear: { type: "number" },
          createdBy: { type: "string" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      },
      BookCreateRequest: {
        type: "object",
        required: ["title", "bookAuthor"],
        properties: {
          title: { type: "string", example: "The Alchemist" },
          bookAuthor: { type: "string", example: "Book author" },
          availableCopies: { type: "number", example: 1 },
          barcode: { type: "string", example: "456" },
          category: { type: "string", example: "Non-Fiction" },
          description: { type: "string", example: "A classic novel." },
          genre: { type: "string", example: "Horror" },
          coverImage: { type: "string", example: "" },
          isbn: { type: "string", example: "32423-3999" },
          publisher: { type: "string", example: "Web book" },
          qrCode: { type: "string", example: "236" },
          shelfLocation: { type: "string", example: "a-6" },
          status: { type: "string", example: "Available" },
          totalCopies: { type: "number", example: 1 },
          publishedYear: { type: "number", example: 1988 },
        },
      },
      BookUpdateRequest: {
        type: "object",
        properties: {
          title: { type: "string", example: "Book title" },
          bookAuthor: { type: "string", example: "Book author" },
          availableCopies: { type: "number", example: 1 },
          barcode: { type: "string", example: "456" },
          category: { type: "string", example: "Non-Fiction" },
          description: { type: "string", example: "A classic novel." },
          genre: { type: "string", example: "Horror" },
          coverImage: { type: "string", example: "" },
          isbn: { type: "string", example: "32423-3999" },
          publisher: { type: "string", example: "Web book" },
          qrCode: { type: "string", example: "236" },
          shelfLocation: { type: "string", example: "a-6" },
          status: { type: "string", example: "Available" },
          totalCopies: { type: "number", example: 1 },
          publishedYear: { type: "number", example: 1988 },
        },
      },
      BookListResponse: {
        type: "object",
        properties: {
          books: {
            type: "array",
            items: { $ref: "#/components/schemas/Book" },
          },
        },
      },
      BookResponse: {
        type: "object",
        properties: {
          book: { $ref: "#/components/schemas/Book" },
        },
      },
      Reader: {
        type: "object",
        properties: {
          id: { type: "string" },
          readerId: { type: "string" },
          studentId: { type: "string" },
          fullName: { type: "string" },
          email: { type: "string" },
          phoneNumber: { type: "string" },
          membershipType: {
            type: "string",
            enum: ["Student", "Teacher", "Staff"],
          },
          status: { type: "string", enum: ["Active", "Inactive", "Suspended"] },
          address: { type: "string" },
          createdBy: { type: "string" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      },
      ReaderCreateRequest: {
        type: "object",
        required: [
          "readerId",
          "fullName",
          "email",
          "phoneNumber",
          "membershipType",
          "status",
        ],
        properties: {
          readerId: { type: "string", example: "R12345" },
          studentId: { type: "string", example: "S67890" },
          fullName: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john.doe@example.com" },
          phoneNumber: { type: "string", example: "+1234567890" },
          membershipType: {
            type: "string",
            enum: ["Student", "Teacher", "Staff"],
            example: "Student",
          },
          status: {
            type: "string",
            enum: ["Active", "Inactive", "Suspended"],
            example: "Active",
          },
          address: { type: "string", example: "123 Main St, City, Country" },
        },
      },
      ReaderUpdateRequest: {
        type: "object",
        properties: {
          readerId: { type: "string", example: "R12345" },
          studentId: { type: "string", example: "S67890" },
          fullName: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john.doe@example.com" },
          phoneNumber: { type: "string", example: "+1234567890" },
          membershipType: {
            type: "string",
            enum: ["Student", "Teacher", "Staff"],
            example: "Student",
          },
          status: {
            type: "string",
            enum: ["Active", "Inactive", "Suspended"],
            example: "Active",
          },
          address: { type: "string", example: "123 Main St, City, Country" },
        },
      },
      ReaderListResponse: {
        type: "object",
        properties: {
          readers: {
            type: "array",
            items: { $ref: "#/components/schemas/Reader" },
          },
        },
      },
      ReaderResponse: {
        type: "object",
        properties: {
          reader: { $ref: "#/components/schemas/Reader" },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        summary: "Health check",
        tags: ["Health"],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                example: { status: "ok" },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        summary: "Register a user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "Email already registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/books": {
      get: {
        summary: "List books",
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description:
              "Free text search across title, author, ISBN, publisher, category, description, genre, barcode, QR code, and shelf location.",
          },
          {
            name: "title",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "bookAuthor",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "author",
            in: "query",
            schema: { type: "string" },
            description: "Alias for bookAuthor",
          },
          {
            name: "isbn",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "publisher",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "genre",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "status",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "shelfLocation",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "barcode",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "qrCode",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "publishedYear",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "publishedYearFrom",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "publishedYearTo",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "availableCopiesMin",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "availableCopiesMax",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "totalCopiesMin",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "totalCopiesMax",
            in: "query",
            schema: { type: "number" },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookListResponse" },
              },
            },
          },
        },
      },
      post: {
        summary: "Add a book",
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookCreateRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    book: { $ref: "#/components/schemas/Book" },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/books/{id}": {
      get: {
        summary: "Get a book by ID",
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Book ID",
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookResponse" },
              },
            },
          },
          401: {
            description: "Not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update a book",
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookUpdateRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookResponse" },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a book",
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          401: {
            description: "Not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/readers": {
      get: {
        summary: "List readers",
        tags: ["Readers"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description:
              "Free text search across reader ID, student ID, full name, email, phone number, and address.",
          },
          {
            name: "readerId",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "studentId",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "fullName",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "email",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "phoneNumber",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "membershipType",
            in: "query",
            schema: { type: "string", enum: ["Student", "Teacher", "Staff"] },
          },
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["Active", "Inactive", "Suspended"],
            },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ReaderListResponse" },
              },
            },
          },
          401: {
            description: "Not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a reader",
        tags: ["Readers"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ReaderCreateRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ReaderResponse" },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "Reader ID or email already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/readers/{id}": {
      get: {
        summary: "Get a reader by ID",
        tags: ["Readers"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Reader ID",
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ReaderResponse" },
              },
            },
          },
          401: {
            description: "Not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update a reader",
        tags: ["Readers"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ReaderUpdateRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ReaderResponse" },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "Reader ID or email already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a reader",
        tags: ["Readers"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          401: {
            description: "Not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [],
});

module.exports = { swaggerSpec };
