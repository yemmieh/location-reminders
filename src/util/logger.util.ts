
import util from "util";
import winston from "winston";

export default class LogUtil {
  public static toString(object: any) {
    return util.format("%o", object);
  }

  public static createLogger(forName: string, toFile?: string): winston.Logger {
    const printfFormat = winston.format.printf(
      (info) => {
        const spaces = LogUtil.getSpaces(info.level, forName);
        return `${info.timestamp} ${info.level}: ${forName}${spaces}| ${info.message}`
          + (info.splat !== undefined ? `${info.splat}` : " ");
      });

    const uncolorizedFormat = winston.format.combine(
      winston.format.timestamp(),
      printfFormat,
    );

    const colorizedFormat = winston.format.combine(
      winston.format.prettyPrint(),
      winston.format.colorize(),
      winston.format.timestamp(),
      printfFormat,
    );

    const returnLogger = winston.createLogger({
      level: "info",
      defaultMeta: { service: forName },
      transports: [
        new winston.transports.Console({ format: colorizedFormat })
      ],
      exitOnError: false
    });

    if (toFile) {
      returnLogger.add(new winston.transports.File({ filename: toFile, format: uncolorizedFormat }));
    }

    return returnLogger;
  }

  private static getSpaces(level: string, name: string) {
    const message = level + ": " + name;
    const numSpaces = 30 - message.length;
    if (numSpaces <= 0) {
      return "\t";
    } else {
      return " ".repeat(numSpaces);
    }
  }
}
