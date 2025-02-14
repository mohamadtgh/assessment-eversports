import DBClient from "../../db/database-client";
import {
  Membership,
  MembershipBillingInterval,
  MembershipPeriod,
  MembershipState,
  MembershipWithPeriods,
} from "../../model/membership.model";
import { v4 as uuidv4 } from "uuid";
import { IMembershipService } from "./membership.service.interface";

export default class MembershipService implements IMembershipService {
  constructor(private readonly dbClient: DBClient) {}

  public async listAllMembershipWithPeriods(): Promise<MembershipWithPeriods[]> {
    try {
      const memberships = await this.dbClient.findAll<Membership>("memberships");
      if (!memberships) {
        throw new Error("memberships not found");
      }

      const membershipPeriods = await this.dbClient.findAll<MembershipPeriod>("membership-periods");
      if (!membershipPeriods) {
        throw new Error("membership-periods not found");
      }

      return this.mapPeriodsToMembership(memberships, membershipPeriods);
    } catch (error) {
      throw new Error(`failed to fetch. ${error}`);
    }
  }

  public async createMembershipWithPeriods(model: Membership): Promise<MembershipWithPeriods> {
    try {
      // /////////////////////////////
      // We assume we have real database
      // and we handle membership creation
      // inside a database transaction.
      ////////////////////////////////
      const userId = 2000;
      const validFrom = model.validFrom ? new Date(model.validFrom) : new Date();
      const validUntil = new Date(validFrom);
      switch (model.billingInterval) {
        case MembershipBillingInterval.Monthly:
          validUntil.setMonth(validFrom.getMonth() + model.billingPeriods);
          break;
        case MembershipBillingInterval.Yearly:
          validUntil.setMonth(validFrom.getMonth() + model.billingPeriods * 12);
          break;
        case MembershipBillingInterval.Weekly:
          validUntil.setDate(validFrom.getDate() + model.billingPeriods * 7);
          break;
      }

      let state = MembershipState.Active;
      if (validFrom > new Date()) {
        state = MembershipState.Pending;
      }
      if (validUntil < new Date()) {
        state = MembershipState.Expired;
      }

      const newMembership: Membership = {
        uuid: uuidv4(),
        name: model.name,
        state,
        validFrom,
        validUntil,
        userId,
        paymentMethod: model.paymentMethod,
        recurringPrice: model.recurringPrice,
        billingPeriods: model.billingPeriods,
        billingInterval: model.billingInterval,
      };
      const membership = await this.dbClient.insert<Membership>("memberships", newMembership);
      if (!membership || !membership.id) {
        throw new Error("can not store membership");
        // terminate transaction and rollback changes.
      }

      // Generating periods
      const membershipPeriods: MembershipPeriod[] = [];
      let periodStart = validFrom;
      for (let i = 0; i < membership.billingPeriods; i++) {
        const validFrom = periodStart;
        const validUntil = new Date(validFrom);
        switch (membership.billingInterval) {
          case MembershipBillingInterval.Monthly:
            validUntil.setMonth(validFrom.getMonth() + 1);
            break;
          case MembershipBillingInterval.Yearly:
            validUntil.setMonth(validFrom.getMonth() + 12);
            break;
          case MembershipBillingInterval.Weekly:
            validUntil.setDate(validFrom.getDate() + 7);
            break;
        }
        const period: MembershipPeriod = {
          uuid: uuidv4(),
          membershipId: membership.id,
          start: validFrom,
          end: validUntil,
          state: MembershipState.Planned,
        };
        const membershipPeriod = await this.dbClient.insert<MembershipPeriod>(
          "membership-periods",
          period
        );

        if (!membershipPeriod) {
          throw new Error("can not store membership period");
          // terminate transaction and rollback changes.
        }
        membershipPeriods.push(membershipPeriod);
        periodStart = validUntil;
      }
      return {
        membership: membership,
        periods: membershipPeriods,
      };
    } catch (error) {
      throw new Error(`failed to insert membership ${error}`);
    }
  }

  private mapPeriodsToMembership(
    memberships: Membership[],
    membershipPeriod: MembershipPeriod[]
  ): MembershipWithPeriods[] {
    const membershipWithPeriods: MembershipWithPeriods[] = [];
    for (const membership of memberships) {
      const periods = membershipPeriod.filter((p) => p.membershipId === membership.id);
      membershipWithPeriods.push({ membership, periods });
    }

    return membershipWithPeriods;
  }
}
