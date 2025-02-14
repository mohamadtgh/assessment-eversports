import { NextFunction, Request, Response } from "express";
import {
  Membership,
  MembershipBillingInterval,
  MembershipPaymentMethod,
} from "../model/membership.model";
import { ValidationErrorType } from "./errors.enum";

export default class MembershipValidation {
  public createMembershipValidation(request: Request, response: Response, next: NextFunction) {
    const body = request.body as Membership;
    if (!body.name || !body.recurringPrice) {
      return response.status(400).json({ message: ValidationErrorType.MissingMandatoryFields });
    }

    if (body.recurringPrice < 0) {
      return response.status(400).json({ message: ValidationErrorType.NegativeRecurringPrice });
    }

    if (body.recurringPrice > 100 && body.paymentMethod === MembershipPaymentMethod.Cash) {
      return response.status(400).json({ message: ValidationErrorType.CashPriceBelow100 });
    }

    if (body.billingInterval === MembershipBillingInterval.Monthly) {
      if (body.billingPeriods > 12) {
        return response
          .status(400)
          .json({ message: ValidationErrorType.BillingPeriodsMoreThan12Months });
      }
      if (body.billingPeriods < 6) {
        return response
          .status(400)
          .json({ message: ValidationErrorType.BillingPeriodsLessThan6Months });
      }
    } else if (body.billingInterval === MembershipBillingInterval.Yearly) {
      if (body.billingPeriods > 3) {
        if (body.billingPeriods > 10) {
          return response
            .status(400)
            .json({ message: ValidationErrorType.BillingPeriodsMoreThan10Years });
        } else {
          return response
            .status(400)
            .json({ message: ValidationErrorType.BillingPeriodsLessThan3Years });
        }
      }
    } else {
      return response.status(400).json({ message: ValidationErrorType.InvalidBillingPeriods });
    }

    next();
  }
}
