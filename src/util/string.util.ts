
export default class StringUtil {
    public static joinUrlPaths(...urls: string[]): string {
        if (urls.length === 0) {
          return "";
        }

        let result: string = urls[0];
        for (let i = 1; i < urls.length; i++) {
          let piece = urls[i];
          if (piece.startsWith("/")) {
            piece = piece.substring(1);
          }

          if (result.endsWith("/")) {
            result += piece;
          } else {
            result += "/" + piece;
          }
        }

        return result;
      }
}