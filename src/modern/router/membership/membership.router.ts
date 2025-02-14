import { Request, Response, Router } from "express";
import { IRouter } from "../router";
import { IMembershipHandler } from "../../handlers/membership/membership.handler.interface";
import MembershipValidation from "../../validation/membership.validaiton";

export default class MembershipRouter implements IRouter<IMembershipHandler> {
  handler: IMembershipHandler;

  private validation: MembershipValidation;
  constructor(handler: IMembershipHandler) {
    this.handler = handler;
    this.validation = new MembershipValidation();
  }

  public getRoutes(): Router {
    const router = Router();

    router.get("/", this.handler.listAllMemberships.bind(this.handler));

    router.post(
      "/",
      this.validation.createMembershipValidation,
      this.handler.createMembership.bind(this.handler)
    );

    return router;
  }
}
