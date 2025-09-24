import { execSync } from "child_process";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

module.exports = () => {
  process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
  execSync("npx prisma db push --force-reset --accept-data-loss", {
    stdio: "inherit",
    env: {
      ...process.env, // passa todas as envs
      DATABASE_URL: process.env.DATABASE_URL_TEST,
    },
  });
};
