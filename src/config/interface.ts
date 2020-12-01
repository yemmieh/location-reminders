import _ from "lodash";


export class AppConfig {
  public static applyConfig(defaultConfig: AppConfig, environmentConfig: AppConfig): AppConfig {
    return _.merge(_.cloneDeep(defaultConfig), environmentConfig);
  }

  public port?: number;
  public topLevelRoute?: string;
}
