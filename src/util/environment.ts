import _ from "lodash";
import path from "path";
import YamlUtil from "./yaml.util";

// Determine where to fetch env_vars depending on execution mode
if (process.env.NODE_ENV === "local") {
  console.log("local wwwwww","got here ")
  // parse app.local.yaml
  const yamlFilePath = path.join(__dirname, "..", "..", "app.local.yaml");
  let localEnvVars: any;
  try {
    localEnvVars = YamlUtil.parseFromFile(yamlFilePath);
  } catch (error) {
    console.log(error);
    // process.exit(1);
  }

  const envVars = localEnvVars.env_variables;
  if (envVars) {
    Object.keys(envVars).forEach((value: string) => {
      process.env[value] = envVars[value];
    });
  } else {
    console.log("Environment vars not found, exiting. Make sure `env_variables` is in your YAML file.");
    process.exit(1);
  }
} else if (process.env.NODE_ENV === "development") {
  // do nothing, vars will be set by runtime.
} else if (process.env.NODE_ENV === "production") {
  // do nothing, vars will be set by runtime.
}


/** Contains the MongoDB environment variables, i.e. variables starting with `MONGO_` */
export interface IMongoEnvironment {
  useSrv: boolean;
  host: string;
  port: number;
  dbName: string;
  user: string;
  pass: string;
}



export default class Environment {
  public static get isProduction(): boolean {
    return Environment.var("NODE_ENV") === "production";
  }

  public static get isDevelopment(): boolean {
    return Environment.var("NODE_ENV") === "development";
  }

  public static get isLocal(): boolean {
    return Environment.var("NODE_ENV") === "local";
  }

  public static get port(): number {
    return Environment.intVar("PORT");
  }



  public static get mongo(): IMongoEnvironment {
    return {
      useSrv: Environment.boolVar("MONGO_USE_SRV"),
      host: Environment.var("MONGO_HOST"),
      port: Environment.intVar("MONGO_PORT"),
      dbName: Environment.var("MONGO_DB_NAME"),
      user: Environment.var("MONGO_USER"),
      pass: Environment.var("MONGO_PASS"),
    };
  }

  public static hasVar(varName: string): boolean {
    const envVarSet = _.has(process.env, varName) && !!process.env[varName];
    return !!envVarSet;
  }

  public static var(varName: string): string {
    return process.env[varName] as string;
  }

  public static boolVar(varName: string): boolean {
    return process.env[varName] === "true";
  }

  public static intVar(varName: string): number {
    return parseInt(process.env[varName] as string, 10);
  }

  public static floatVar(varName: string): number {
    return parseFloat(process.env[varName] as string);
  }
}

// validate environment variables before any other crashes can occur
const expectedEnvVars = [
  // Server settings
  "PORT",

  // Database connection settings
  "MONGO_USE_SRV",
  "MONGO_HOST",
  "MONGO_PORT",
  "MONGO_DB_NAME",
  "MONGO_USER",
  "MONGO_PASS",
];

function checkEnvVars() {
  const missingVars = [];
  for (const envVar of expectedEnvVars) {
    if (!Environment.hasVar(envVar)) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    console.log("local",`got here ${process.env.NODE_ENV}`);
    console.log("You are missing the following environment variables:");
    console.log("  " + missingVars.join("\n  "));
    console.log("local",`got here ${process.env.NODE_ENV}`);
    throw Error("MISSING_ENV_VARS");
  }
}

checkEnvVars();
