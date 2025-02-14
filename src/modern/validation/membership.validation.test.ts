import { Request, Response, NextFunction } from "express";
import { ValidationErrorType } from "./errors.enum";
import MembershipValidation from "./membership.validaiton";
import {
  Membership,
  MembershipBillingInterval,
  MembershipPaymentMethod,
} from "../model/membership.model";

describe("MembershipValidation", () => {
  let membershipValidation: MembershipValidation;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    membershipValidation = new MembershipValidation();
    req = { body: {} } as Partial<Request>;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    next = jest.fn();
  });

  it("should return 400 if name or recurringPrice is missing", () => {
    membershipValidation.createMembershipValidation(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: ValidationErrorType.MissingMandatoryFields });
  });

  it("should return 400 if recurringPrice is negative", () => {
    req.body = { name: "Basic", recurringPrice: -10 } as unknown as Membership;
    membershipValidation.createMembershipValidation(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: ValidationErrorType.NegativeRecurringPrice });
  });

  it("should return 400 if recurringPrice > 100 and payment method is Cash", () => {
    req.body = {
      name: "Basic",
      recurringPrice: 150,
      paymentMethod: MembershipPaymentMethod.Cash,
    } as unknown as Membership;
    membershipValidation.createMembershipValidation(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: ValidationErrorType.CashPriceBelow100 });
  });

  it("should return 400 if billingPeriods > 12 for Monthly billingInterval", () => {
    req.body = {
      name: "Basic",
      recurringPrice: 50,
      billingInterval: MembershipBillingInterval.Monthly,
      billingPeriods: 13,
    } as unknown as Membership;
    membershipValidation.createMembershipValidation(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: ValidationErrorType.BillingPeriodsMoreThan12Months,
    });
  });

  it("should return 400 if billingPeriods < 6 for Monthly billingInterval", () => {
    req.body = {
      name: "Basic",
      recurringPrice: 50,
      billingInterval: MembershipBillingInterval.Monthly,
      billingPeriods: 5,
    } as unknown as Membership;
    membershipValidation.createMembershipValidation(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: ValidationErrorType.BillingPeriodsLessThan6Months,
    });
  });

  it("should return 400 if billingPeriods > 10 for Yearly billingInterval", () => {
    req.body = {
      name: "Basic",
      recurringPrice: 50,
      billingInterval: MembershipBillingInterval.Yearly,
      billingPeriods: 11,
    } as unknown as Membership;
    membershipValidation.createMembershipValidation(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: ValidationErrorType.BillingPeriodsMoreThan10Years,
    });
  });

  it("should return 400 if billingPeriods is invalid", () => {
    req.body = {
      name: "Basic",
      recurringPrice: 50,
      billingInterval: "Invalid" as MembershipBillingInterval,
      billingPeriods: 2,
    } as unknown as Membership;
    membershipValidation.createMembershipValidation(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: ValidationErrorType.InvalidBillingPeriods });
  });

  it("should call next() if validation passes", () => {
    req.body = {
      name: "Basic",
      recurringPrice: 50,
      billingInterval: MembershipBillingInterval.Monthly,
      billingPeriods: 6,
    } as unknown as Membership;
    membershipValidation.createMembershipValidation(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
