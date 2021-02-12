import { LoggerActivity } from "./LoggerActivity";
import { ActivityEvent } from "./ActivityEvent";
import geoipLite from "geoip-lite";
import "./middlewareLoggerGlobal";
import { requestHandlerAsync } from "@reignmodule/express-utils/handle-async";
import type { Request, Response } from "express";

export interface createMiddlewareLoggerOptions {
  logger: LoggerActivity;
  middleware?: (
    activityEvent: ActivityEvent,
    request: Request,
    response: Response
  ) => ActivityEvent;
  ignorePropertiesHeaders?: string[];
  ignoreDefaultIgnorePropertiesHeaders?: boolean;
}

export function createMiddlewareLogger(options: createMiddlewareLoggerOptions) {
  return function middlewareLogger(
    activityEvent: ActivityEvent,
    secondOptions?: createMiddlewareLoggerOptions
  ) {
    const logger = secondOptions?.logger ?? options.logger;
    const middleware = secondOptions?.middleware ?? options.middleware;
    const ignoreDefaultIgnorePropertiesHeaders =
      secondOptions?.ignoreDefaultIgnorePropertiesHeaders ??
      options.ignoreDefaultIgnorePropertiesHeaders ??
      false;
    const optionsIgnorePropertiesHeaders = options?.ignorePropertiesHeaders;
    const secondOptionsIgnorePropertiesHeaders =
      secondOptions?.ignorePropertiesHeaders;
    const ignorePropertiesHeaders: string[] = [];

    if (!ignoreDefaultIgnorePropertiesHeaders) {
      ignorePropertiesHeaders.push(
        "authorization",
        "x-device-authorization",
        "x-api-key"
      );
    }

    if (Array.isArray(optionsIgnorePropertiesHeaders)) {
      ignorePropertiesHeaders.push(...optionsIgnorePropertiesHeaders);
    }

    if (Array.isArray(secondOptionsIgnorePropertiesHeaders)) {
      ignorePropertiesHeaders.push(...secondOptionsIgnorePropertiesHeaders);
    }

    const templateCleanHeaders = ignorePropertiesHeaders.reduce(
      (a, c) => ({ ...a, [c]: undefined }),
      {} as { [k: string]: undefined }
    );

    return requestHandlerAsync(async (req, res, next) => {
      const getHeader = (headerName: string) => {
        const h = req.headers[headerName];
        if (typeof h === "string") return h;
      };

      const ip = getHeader("x-forwarded-for") || req.connection.remoteAddress;
      const geo = ip ? geoipLite.lookup(ip) : undefined;

      const message: ActivityEvent = {
        ...activityEvent,
        formatId: getHeader("x-format-id"),
        storeId: getHeader("x-origin-soapid") ?? getHeader("x-storeid"),
        location: geo
          ? {
              city: geo.city,
              countryCode: geo.country,
              regionCode: geo.region,
              position: [geo.ll[0], geo.ll[1]],
            }
          : undefined,
        meta: {
          appVersion: getHeader("x-app-version"),
          url: req.originalUrl,
          headers: {
            ...req.headers,
            ...templateCleanHeaders,
          },
        },
        statusCode: res.statusCode,
      };

      res.loggerActivity = {
        message:
          typeof middleware === "function"
            ? middleware(message, req, res)
            : message,
      };

      const durationReqMsStart = Date.now();
      res.on("finish", () => {
        message.durationReqMs = Date.now() - durationReqMsStart;
        if (!message.disabled) {
          logger.sendMessage(message);
        }
      });

      return next();
    });
  };
}
