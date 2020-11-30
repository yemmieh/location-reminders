export class Errors {
    public static alreadyAuthenticated: string = "ALREADY_AUTHENTICATED";
    public static badRequest: string = "BAD_REQUEST";
    public static badRequestState: string = "BAD_REQUEST_STATE";
    public static incorrectPassword: string = "INCORRECT_PASSWORD";
    public static internalError: string = "INTERNAL_ERROR";
    public static invalidEmail: string = "INVALID_EMAIL";
    public static invalidPassword: string = "INVALID_PASSWORD";
    public static invalidPermissions: string = "INVALID_PERMISSIONS";
    public static invalidPhoneNumber: string = "INVALID_PHONE_NUMBER";
    public static missingFields: string = "MISSING_FIELDS";
    public static notFound: string = "NOT_FOUND";
    public static unimplemented: string = "UNIMPLEMENTED";
    public static phoneNumberInUse: string = "PHONENUMBER_ALREADY_EXIST";
    public static unknown: string = "UNKNOWN";
  
    public static statusCodeForError(error: string): number {
      switch (error) {
        case Errors.incorrectPassword:
        case Errors.notFound:
          return 404;
        case Errors.alreadyAuthenticated:
        case Errors.internalError:
        case Errors.unimplemented:
          return 500;
        default:
          return 400;
      }
    }
  
    public static getErrorMessage(error: any): string {
      if (!!error) {
        if (typeof error === "string") {
          return Errors.mapMongooseResponse(error);
        } else if (!!error.message && typeof error.message === "string") {
          return Errors.mapMongooseResponse(error.message);
        }
      }
  
      return Errors.unknown;
    }
  
  
    private static mapMongooseResponse(error: string): string {
      const validationErrorRegex = /^User validation failed:*/;
      if (!validationErrorRegex.test(error)) {
        return error;
      }
  
      if (error.includes("email: can't be blank")) {
        return Errors.invalidEmail;
      } else if (error.includes("email: is invalid")) {
        return Errors.invalidEmail;
      } else if (error.includes("phoneNumber: is already taken")) {
        return Errors.phoneNumberInUse;
      } else {
        return error;
      }
    }
  }
  