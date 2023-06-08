import { config } from "dotenv";

import "./app.test.ts";
import { runTests } from "./utils";

config({ path: ".test.env" });

runTests();
