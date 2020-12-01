
import express, {Request,Response,NextFunction } from 'express'
import { Container } from "inversify";
import winston from "winston";
import { interfaces, InversifyExpressServer } from "inversify-express-utils";
import { Errors } from "./interfaces/errors";
import * as bodyParser from "body-parser";
import Types from "./container/types";
import ejs from "ejs";
import Environment from "./util/environment";
import path from "path";
import { IDatabaseService } from "./service/database.service";
import LogUtil from "./util/logger.util";

export default class App {
    public container: Container;
    public expressServer: express.Application;

    private logger: winston.Logger;
    // private config: AppConfig;
    private server: InversifyExpressServer;
    private databaseService: IDatabaseService;

    constructor(container: Container,expressServer: express.Application) {
      this.expressServer = expressServer;
      this.container = container;
      this.logger = LogUtil.createLogger("App");
    //   this.config = container.get(Types.Config);
      this.server =
        new InversifyExpressServer(
          container
        //   ,
        //   {
        //     routingConfig: { rootPath: this.config.topLevelRoute }
        //   }
        );
      this.databaseService = this.getFromContainer(Types.Service.Database);
    }

    public configure() {
      this.container.bind<App>(Types.App).toConstantValue(this);
      this.server.setConfig((expressApp) => {
        // EJS renderer
        expressApp.engine("html", ejs.renderFile);

        // https redirect
        expressApp.use(this.secureHandler);

        // AppEngine requirement
        expressApp.get("/_ah/:command", (_, res) => {
          res.status(200).end();
        });

        // static serves
        expressApp.use("/admin", express.static(path.join(__dirname, "ui")));

        // body parsers
        expressApp.use(bodyParser.json({
          limit: "50mb"
        }));

        expressApp.use(bodyParser.urlencoded({
          limit: "50mb",
          parameterLimit: 100000,
          extended: true,
         }));
      });

      this.server.setErrorConfig((app) => {
        // Convert error codes to the correct HTTP status code on failures
        app.use((err: any, req: any, res: any, next: any) => {
          const errorMessage = Errors.getErrorMessage(err);
          const statusCode = Errors.statusCodeForError(errorMessage);

          res.status(statusCode).send({
            response: errorMessage,
          });
        });
      });

      this.expressServer = this.server.build();
    }

    public async listen(): Promise<void> {
      if (!this.expressServer) {
        throw new Error("You must call #configure() first.");
      }

      await this.databaseService.init();
      this.expressServer.listen(Environment.port, () => {
        this.logger.info(`Server started on http://localhost:${Environment.port}`);
      });
    }


    private getFromContainer<T>(symbol: any): T {
      this.container.bind<interfaces.HttpContext>(Symbol.for("HttpContext")).toConstantValue({} as any);
      const value = this.container.get<T>(symbol);
      this.container.unbind(Symbol.for("HttpContext"));
      return value;
    }

    public secureHandler(req: Request, res: Response, next: NextFunction) {
        if (this.needsHttpsRedirect(req)) {
          return res.redirect("https://" + req.get("host") + req.url);
        }
        next();
      }

      public  needsHttpsRedirect(req: Request) {
        const security = req.get("x-forwarded-proto") || req.get("X-Forwarded-Proto");
        if (security !== "https") {
          if (Environment.isLocal) {
            return false;
          }

          for (const pattern of this.allowedPatterns) {
            if (req.url.startsWith(pattern)) {
              return false;
            }
          }

          return true;
        } else {
          return false;
        }
      }
      public allowedPatterns: string[] = [
        "/_ah",
        "/api/v2/task",
      ];
  }
