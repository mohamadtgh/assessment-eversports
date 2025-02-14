import { Router } from "express";

export interface IRouter<H> {
  handler: H;
  getRoutes(): Router;
}
