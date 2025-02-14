// This module performs manual dependency injection.
// instead of using DI libraries, I used this approach to
// minimize the scope of the changes and to prevent adding
// extra library for this task.

import DBClient from "./db/database-client";
import MembershipHandler from "./handlers/membership/membership.handler";
import MembershipRouter from "./router/membership/membership.router";
import MembershipService from "./services/membership/membership.service";
import { IRouter } from "./router/router";
import { IMembershipService } from "./services/membership/membership.service.interface";
import { IMembershipHandler } from "./handlers/membership/membership.handler.interface";

interface Dependencies {
  dbClient: DBClient;
  membershipService: IMembershipService;
  membershipRouter: IRouter<IMembershipHandler>;
}

export default class Container {
  private static dependencies: Dependencies;
  private constructor() {}

  public static init(): void {
    const dbClient = DBClient.getInstance();
    const membershipService = new MembershipService(dbClient);
    const membershipHandler = new MembershipHandler(membershipService);
    const membershipRouter = new MembershipRouter(membershipHandler);

    Container.dependencies = {
      dbClient,
      membershipRouter,
      membershipService,
    };
  }

  public static get<T extends keyof Dependencies>(key: T): Dependencies[T] {
    return Container.dependencies[key];
  }
}
