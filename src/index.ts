import express from "express";
import { errorHandler } from "./error-handler.middleware";
import Container from "./modern/dependencies";

const app = express();
const port = 3099;

Container.init();

app.use(express.json());

// because of the javascript module, we need to use require to import the legacy routes
const legacyMembershipRoutes = require("./legacy/routes/membership.routes");
const membershipRoutes = Container.get("membershipRouter").getRoutes();

app.use("/memberships", membershipRoutes);
app.use("/legacy/memberships", legacyMembershipRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
