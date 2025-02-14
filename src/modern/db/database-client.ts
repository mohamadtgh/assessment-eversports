// This module mimics the database client since there is no
// real database in place and the data is being populated from
// static json file.
import memberships from "../../data/memberships.json";
import membershipPeriods from "../../data/membership-periods.json";

export default class DBClient {
  private static instance: DBClient;
  private constructor() {}

  public static getInstance(): DBClient {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }

    return DBClient.instance;
  }

  public async findAll<T>(collection: string): Promise<T[] | null> {
    return new Promise((resolve: (result: T[] | null) => void, reject: (reason: Error) => void) => {
      if (!this.availableCollections().includes(collection)) {
        reject(new Error("invalid-collection"));
      }
      try {
        switch (collection) {
          case "memberships":
            resolve(memberships as T[]);
            break;
          case "membership-periods":
            resolve(membershipPeriods as T[]);
            break;
          default:
            resolve(null);
        }
      } catch (err: any) {
        reject(err);
      }
    });
  }

  public insert<T>(collection: string, model: any): Promise<T | null> {
    return new Promise((resolve: (result: any | null) => void, reject: (reason: Error) => void) => {
      if (!this.availableCollections().includes(collection)) {
        reject(new Error("invalid-collection"));
      }
      try {
        switch (collection) {
          case "memberships":
            model.id = memberships.length + 1;
            memberships.push(model);
            resolve(model);
            break;
          case "membership-periods":
            model.id = membershipPeriods.length + 1;
            membershipPeriods.push(model);
            resolve(model);
            break;
          default:
            resolve(null);
        }
      } catch (err: any) {
        reject(err);
      }
    });
  }

  private availableCollections(): string[] {
    return ["memberships", "membership-periods"];
  }
}
