import { Container } from "inversify";
import config from "../config";
import { AppConfig } from "../config/interface";
import Types from "./types";

const container = new Container();

container.bind<AppConfig>(Types.Config).toConstantValue(config);

export default container;