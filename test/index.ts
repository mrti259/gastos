import { config } from "dotenv";

import "./app/gastos/storage.test";
import { runTests } from "./utils";

config({ path: ".env.test" });

runTests();
