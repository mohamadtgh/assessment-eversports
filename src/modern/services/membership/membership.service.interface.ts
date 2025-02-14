import { Membership, MembershipWithPeriods } from "../../model/membership.model";

export interface IMembershipService {
  listAllMembershipWithPeriods(): Promise<MembershipWithPeriods[]>;
  createMembershipWithPeriods(model: Membership): Promise<MembershipWithPeriods>;
}
