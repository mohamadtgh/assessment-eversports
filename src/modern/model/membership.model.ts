export enum MembershipName {
  Platinum = "Platinum Plan",
  Gold = "Gold Plan",
}

export enum MembershipState {
  Active = "active",
  Issued = "issued",
  Pending = "pending",
  Expired = "expired",
  Planned = "planned",
}

export enum MembershipAssignedBy {
  Admin = "Admin",
}

export enum MembershipPaymentMethod {
  CreditCard = "credit card",
  Cash = "cash",
}

export enum MembershipBillingInterval {
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
}

export interface Membership {
  id?: number;
  uuid: string;
  name: MembershipName;
  userId: number;
  recurringPrice: number;
  validFrom: Date;
  validUntil: Date;
  state: MembershipState;
  assignedBy?: MembershipAssignedBy;
  paymentMethod: MembershipPaymentMethod | null;
  billingInterval: MembershipBillingInterval;
  billingPeriods: number;
}

export interface MembershipPeriod extends Pick<Membership, "uuid" | "state"> {
  id?: number;
  membershipId: number;
  start: Date;
  end: Date;
}

export interface MembershipWithPeriods {
  membership: Membership;
  periods: MembershipPeriod[];
}
