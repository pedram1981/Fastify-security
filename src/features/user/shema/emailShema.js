const emailSchema = {
    query: {
      type: "object",
      required: ["email"],
      properties: {
        email: {
          type: "string",
          format: "email",
          errorMessage: {
            format: "Email must be a valid format"
          }
        }
      },
      errorMessage: {
        required: "Email must be provided in the query parameters"
      }
    }
  };

  export default emailSchema;
