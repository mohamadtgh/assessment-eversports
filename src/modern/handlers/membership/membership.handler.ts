import { Request, Response } from "express";
import { IMembershipService } from "../../services/membership/membership.service.interface";
import { IMembershipHandler } from "./membership.handler.interface";
import { ApiErrorType } from "../../validation/errors.enum";
import { Membership } from "../../model/membership.model";

export default class MembershipHandler implements IMembershipHandler {
  private readonly service: IMembershipService;
  constructor(service: IMembershipService) {
    this.service = service;
  }

  public async listAllMemberships(request: Request, response: Response): Promise<void> {
    try {
      const membershipsWithPeriods = await this.service.listAllMembershipWithPeriods();
      response.status(200).json(membershipsWithPeriods);
    } catch (error) {
      response.status(500).json({ message: ApiErrorType.InternalServerError });
    }
  }

  public async createMembership(request: Request, response: Response): Promise<void> {
    try {
      const model = request.body as Membership;
      const membershipWithPeriods = await this.service.createMembershipWithPeriods(model);
      const { membership, periods: membershipPeriods } = membershipWithPeriods;

      response.status(201).json({ membership, membershipPeriods });
    } catch (error) {
      response.status(500).json({ message: ApiErrorType.InternalServerError });
    }
  }
}
