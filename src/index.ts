// tslint:disable-next-line:no-var-requires
require("source-map-support").install();
import "reflect-metadata";
import * as express from "express";

import App from "./app";
import container from "./container";
import LogUtil from "./util/logger.util";

const crashLogger = LogUtil.createLogger("application");

process.on("uncaughtException", (error) => {
  console.log("Fatal uncaught exeption crashed server:");
  console.log(error);
  crashLogger.log("error", "Fatal uncaught exception crashed server:", error, () => {
    process.exit(1);
  });
});

const app = new App(container,express.application);
app.configure();
app.listen().then(() => {
  // do nothing, app is listening and ready
}).catch((error) => {
  console.log(error);
  crashLogger.log("error", error);
  process.exit(1);
});
