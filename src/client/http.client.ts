import { injectable } from "inversify";
import _ from "lodash";
import fetch from "node-fetch";
import StringUtil from "../util/string.util";

@injectable()
export default class HttpClient {
    public baseUrl: string | any = "null";

  public async get<T = any>(url: string, headers?: any): Promise<T> {
    if (!!headers) {
      headers = _.cloneDeep(headers);
      headers["Content-Type"] = "application/json";
    } else {
      headers = { "Content-Type": "application/json" };
    }

    const res = await fetch(this.getUrl(url), {
      method: "get",
      headers
    });

    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(res);
    }
  }

  public async post<T = any>(url: string, body: any, headers?: any): Promise<T> {
    if (!!headers) {
      headers = _.cloneDeep(headers);
      headers["Content-Type"] = "application/json";
    } else {
      headers = { "Content-Type": "application/json" };
    }

    const res = await fetch(this.getUrl(url), {
      method: "post",
      body: JSON.stringify(body),
      headers,
    });

    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(res);
    }
  }

  public async postRaw(url: string, body: any): Promise<string> {
    const res = await fetch(this.getUrl(url), {
      method: "post",
      body: this.formatForUrl(body),
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
        "Content-Type": "text/plain",
      },
    });

    if (res.ok) {
      return res.text();
    } else {
      return Promise.reject(res);
    }
  }

  private getUrl(url: string) {
    if (this.baseUrl && !url.startsWith("http")) {
      return StringUtil.joinUrlPaths(this.baseUrl, url);
    } else {
      return url;
    }
  }

  private formatForUrl(object: any) {
    let result = "";
    for (const key of Object.keys(object)) {
      const value = encodeURIComponent(`${object[key]}`);
      result += `${key}=${value}&`;
    }

    if (result.length > 0) {
      return result.substr(0, result.length - 1);
    } else {
      return "";
    }
  }
}
