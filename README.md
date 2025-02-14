# Assumptions and Decisions

## Identified bugs

#### Incorrect assignments

- In `membership-periods.json`, the `membership` property is unused in the schema while `membershipId` is being used in the legacy code(to map periods to memberships).
  It was causing the `GET /legacy/memberships` endpoint to always return an empty array as the value of the property `periods`.
  Since the goal of the task is to use typescript for type safety and therefore I have to declare model interfaces, the `membership` property would become unused and on the other side, using `membershipId` in the code will cause exceptions
  due to lack of definition. I assume it is a typo in the assessment and I fixed it by renaming the `membership` property in the `membership-periods.json` file
  to `membershipId`.
  The reason for renaming the property in the mocked data instead of adding a new property to the model interface(in the modernized code) is based on the task consideration which states
  > The response from the endpoints should be exactly the same. Use the same error messages that are used in the legacy implementation.

By doing this, I will fix the response for both legacy and the new code.

- Same was happening for `userId` as well. The `POST /legacy/memberships` was assigning id to `user` while the correct property is `userId` according to json file.

#### Issue with storing membership periods

In the legacy code, while storing membership periods, the code is creating an empty array of membershipPeriods and is pushing the generated periods to it while it is not then pushed to the global `membershipPeriods` object(which is loaded initially from the json file).

Also, wrong id is being assigned to the period object. we should not assign the `loop counter +1` as id but the global `membershipPeriods.length +1`. This is also fixed in both legacy and modern code as it was mentioned for both to have same response.

#### Accessing undefined property

In the legacy code at line `29` where the code was trying to accessing `billingPeriod` from `req` instead of `req.body`.

```js
if (req.billingPeriods < 6) {
  return res.status(400).json({ message: "billingPeriodsLessThan6Months" });
}
```

This causes a bug and again I assume it is not intentional but a typo in the code.
I fixed it on both legacy and modern code.

## Tests

I only wrote 2 tests for handler and validation to showcase the impact of automated tests. I chose `membership.handler` and `membership.validation` for tests since those are closer
to the end user.

# Fullstack Interview Challenge

> [!IMPORTANT]
> You should have received a google doc together with this repository that explains in detail the scope and context of the exercise, together with it's acceptance criteria and any other necessary information for the completion of the challenge.

## Context

You are working in the product team at eversports that is maintaining the eversports manager. You and your team are working on a bunch of features around memberships within the current quarter.

The team also started an initiative in this quarter to modernize the codebase by refactoring features implemented in an old technology stack to a more modern one.

### Domain: Memberships

A `Membership` allows a user to participate at any class the a specific sport venue within a specific timespan. Within this timespan, the membership is divided into `MembershipPeriods`. The MembershipPeriods represent billing periods that the user has to pay for.

For the scope of this exercise, the domain model was reduced to a reasonable size.

#### Entity: Membership

```ts
interface Membership {
  name: string; // name of the membership
  user: number; // the user that the membership is assigned to
  recurringPrice: number; // price the user has to pay for every period
  validFrom: Date; // start of the validity
  validUntil: Date; // end of the validity
  state: string; // indicates the state of the membership
  paymentMethod: string; // which payment method will be used to pay for the periods
  billingInterval: string; // the interval unit of the periods
  billingPeriods: number; // the number of periods the membership has
}
```

#### Entity: MembershipPeriod

```ts
interface MembershipPeriod {
  membership: number; // membership the period is attached to
  start: Date; // indicates the start of the period
  end: Date; // indicates the end of the period
  state: string;
}
```

## Task 1 - Modernization of the membership codebase (backend only)

Before your team can start to implement new features, you guys decided to **modernize the backend codebase** first.

Your task is to **refactor two endpoints** implemented in the **legacy codebase** that can be used to list and create memberships:

GET /legacy/memberships (`src/legacy/routes/membership.routes.js`)
POST /legacy/memberships (`src/legacy/routes/membership.routes.js`)

Your new implementation should be accessible through new endpoints in the **modern codebase** that are already prepared:

GET /memberships (`src/modern/routes/membership.routes.ts`)
POST /memberships (`src/modern/routes/membership.routes.ts`)

When refactoring, you should consider the following aspects:

- The response from the endpoints should be exactly the same. Use the same error messages that are used in the legacy implementation.
- You write read- and maintainable code
- You use Typescript instead of Javascript to enabled type safety
- Your code is separated based on concerns
- Your code is covered by automated tests to ensure the stability of the application

> [!NOTE]
> For the scope of this task, the data used is mocked within the json files `membership.json` and `membership-periods.json`

> [!NOTE]
> We provided you with an clean express.js server to run the example. For your implementations, feel free to use any library out there to help you with your solution. If you decide to choose another JavaScript/TypeScript http library/framework (eg. NestJs) update the run config described below if needed, and ensure that the routes of the described actions don't change.

## Task 2 - Design an architecture to provide a membership export (conception only)

The team discovered that users are interested in **exporting all of their memberships** from the system to run their own analysis once a month as a **CSV file**. Because the creation of the export file would take some seconds, the team decided to go for an **asynchronous process** for creating the file and sending it via email. The process will be triggered by an API call of the user.

Your task is to **map out a diagram** that visualizes the asynchronous process from receiving the request to sending the export file to the user. This diagram should include all software / infrastructure components that will be needed to make the process as stable and scalable as possible.

Because the team has other things to work on too, this task is timeboxed to **1 hour** and you should share the architecture diagram as a **PDF file**.

> [!NOTE]
> Feel free to use any tool out there to create your diagram. If you are not familiar with such a tool, you can use www.draw.io.

## Repository Intro

In this repository you will find an plain express.js server the exposes API endpoints to consumers. For this exercise, the API endpoints are not protected.

### Installation

```sh
npm install
```

### Usage

```sh
npm run start
```

### Run test

```sh
npm run test
```

## 🗒️ Conditions

- You will have multiple days for the challenge, but most of our candidates spend around **8h to 10h** on this assignment.
- You should put your code in GitHub or GitLab/Bitbucket and send us the link to your repository where we can find the source code. That means no ZIP files.
- Please make sure to include any additional instructions in a readme in case you change something about the compilation or execution of the codebase.

## 💻 Technologies:

We believe that great developers are not bound to a specific technology set, but no matter their toolbox they are able to think critically about how to structure and design good code. For this exercise, we provided just a small and simple set of tools to run the a application and tests. Feel free to use any library out there to help you with your implementation.

### Pre-installed

- Express - https://expressjs.com/
- TypeScript - https://www.typescriptlang.org/
- Jest - https://jestjs.io/

Best of luck and looking forward to what you are able to accomplish! 🙂
