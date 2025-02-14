import MembershipHandler from "./membership.handler";
import { IMembershipHandler } from "./membership.handler.interface";
import { IMembershipService } from "../../services/membership/membership.service.interface";
import memberships from "../../../data/memberships.json";

describe("MembershipHandler", () => {
  let membershipService: IMembershipService;
  let membershipHandler: IMembershipHandler;

  beforeEach(() => {
    membershipService = {
      listAllMembershipWithPeriods: jest.fn(),
      createMembershipWithPeriods: jest.fn(),
    };

    membershipHandler = new MembershipHandler(membershipService);
  });

  it("should return list of memberships", async () => {
    const req = {} as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    (membershipService.listAllMembershipWithPeriods as jest.Mock).mockResolvedValue(memberships);

    await membershipHandler.listAllMemberships(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(memberships);
  });

  it("should create and return a memberships", async () => {
    const { [0]: membership } = memberships;
    membership.id = 0;
    const req = {
      body: { ...membership },
    } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    (membershipService.createMembershipWithPeriods as jest.Mock).mockResolvedValue({
      membership: {
        ...membership,
        id: memberships.length + 1,
      },
      periods: [],
    });

    await membershipHandler.createMembership(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      membership: {
        ...membership,
        id: memberships.length + 1,
      },
      membershipPeriods: [],
    });
  });
});
