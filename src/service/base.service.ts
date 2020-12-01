import { injectable } from "inversify";
import winston = require("winston");
import Environment from "../util/environment";
import LogUtil from "../util/logger.util";

@injectable()
export default abstract class BaseService{


  protected logger: winston.Logger;

  protected get httpPrefix(): string {
    return Environment.isLocal ? "http://" : "https://";
  }

  public constructor() {
    this.logger = LogUtil.createLogger(this.constructor.name);
  }
}
