import Koa from "koa";
import koaBody from "koa-bodyparser";
import koaLogger from "koa-logger";
import koaHelmet from "koa-helmet";
import koaCors from "@koa/cors";
import { donationRouter } from "./donation";
import { healthRouter } from "./health";
import { container } from "../container";

export const applyKoaMiddlewares = (app: Koa): void => {
  app.use(koaCors());
  app.use(koaBody());
  app.use(koaHelmet());
  app.use(koaLogger());
  app.use((ctx, next) => {
    ctx.scope = container.createScope();
    return next();
  });
  app.use(donationRouter.routes()).use(donationRouter.allowedMethods());
  app.use(healthRouter.routes()).use(healthRouter.allowedMethods());
};
