import { Request, Response } from "express";

export interface IMembershipHandler {
  listAllMemberships(request: Request, response: Response): Promise<void>;
  createMembership(request: Request, response: Response): Promise<void>;
}
