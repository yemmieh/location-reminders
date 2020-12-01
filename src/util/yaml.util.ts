import fs from "fs";
import yaml from "yaml";

export default class YamlUtil {
  public static parseFromFile(path: string): any {
    let yamlFileString: string;
    try {
      yamlFileString = fs.readFileSync(path, "utf-8");
    } catch (error) {
      throw new Error(`${path} not found!`);
    }

    const localEnvVars = yaml.parse(yamlFileString);
    if (!localEnvVars) {
      throw new Error(`${path} contents were empty`);
    }

    return localEnvVars;
  }
}
