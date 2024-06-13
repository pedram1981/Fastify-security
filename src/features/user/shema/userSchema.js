const userSchema = {
    body: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          format: "email",
          errorMessage: {
            type: "Email must be a string",
            format: "Email is not in a valid format",
          },
        },
        password: {
          type: "string",
          minLength: 8,
          maxLength: 20,
          pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
          errorMessage: {
            type: "Password must be a string",
            minLength: "Password must be at least 8 characters long",
            maxLength: "Password must not exceed 20 characters",
            pattern: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          },
        },
        phone: {
          type: "string",
          pattern: "^\\d{10}$",
          errorMessage: {
            type: "phone number must be a string",
            pattern: "The phone number must be 10 digits long.",
          },
        },
        name: {
          type: "string",
          maxLength: 20,
          errorMessage: {
            type: "Name must be a string",
            maxLength: "Name must not exceed 20 characters",
          },
        }
      },
    },
  };
  
  export default userSchema;

