import defaultConfig from "./default.config";
import { AppConfig } from "./interface";
import localConfig from "./local.config";

const validEnvironmentNames = ["local"];
const environmentConfigs: any = {
  local: localConfig,
};

function resolveConfig(environmentName: string): AppConfig {
  if (!validEnvironmentNames.includes(environmentName)) {
    throw new Error("Invalid environment name: " + environmentName);
  }
  return AppConfig.applyConfig(defaultConfig, environmentConfigs[environmentName]);
}

export default resolveConfig(process.env.NODE_ENV as string);
