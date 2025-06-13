import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const getEnv = (key: string) => {
  return process.env[key] || "";
};

export default getEnv;
