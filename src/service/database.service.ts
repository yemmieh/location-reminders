import { injectable } from "inversify";
import mongoose from "mongoose";
import Environment from "../util/environment";
import BaseService from "./base.service";

export interface IDatabaseService {
  init(): Promise<void>;
}

@injectable()
export class DatabaseService extends BaseService implements IDatabaseService {
  constructor(
  ) {
    super();
  }

  public async init() {
    const MONGO_USE_SRV = Environment.mongo.useSrv;
    const MONGO_HOST = Environment.mongo.host;
    const MONGO_PORT = Environment.mongo.port;
    const MONGO_DB_NAME = Environment.mongo.dbName;
    const MONGO_USER = Environment.mongo.user;
    const MONGO_PASS = Environment.mongo.pass;

    let mongoDbUrl: string;
    if (MONGO_USE_SRV) {
      mongoDbUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB_NAME}`;
    } else {
      mongoDbUrl = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;
    }

    try {
      await mongoose.connect(mongoDbUrl, {
        useNewUrlParser:true,useUnifiedTopology: true
      });
      this.logger.info(`Connected to Mongo database at ${mongoDbUrl}`);
    } catch (error) {
      this.logger.error(`Unable to connect to database at ${mongoDbUrl}`);
      this.logger.error(error);
      throw error;
    }
  }
}
