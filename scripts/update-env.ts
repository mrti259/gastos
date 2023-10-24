import axios from "axios";
import { config } from "dotenv";
import * as fs from "fs";

config();
const baseUrl = "https://api.vercel.com";
const project = "admin-gastos";
const token = process.env.VERCEL_TOKEN;
const authorization = `Bearer ${token}`;
const headers = {
  authorization,
};

interface Env {
  type: string;
  value: string;
  target: string[];
  id: string;
  key: string;
}

async function getVariables() {
  const url = `${baseUrl}/v9/projects/${project}/env`;
  const response = await axios.get(url, { headers });
  return response.data["envs"] as Env[];
}

async function addVariable(key: string, value: string, target: string[]) {
  console.log(`Adding ${key}`);
  await axios.post(
    `${baseUrl}/v10/projects/${project}/env`,
    {
      key,
      value,
      target,
      type: "encrypted",
    },
    { headers },
  );
}

async function editVariable(
  id: string,
  key: string,
  value: string,
  target: string[],
) {
  console.log(`Updating ${key}`);
  await axios.patch(
    `${baseUrl}/v10/projects/${project}/env/${id}`,
    {
      key,
      value,
      target,
      type: "encrypted",
    },
    { headers },
  );
}

async function uploadVariablesFromFile(
  path: string,
  target: string[],
  ignore: string[],
) {
  const envs = await getVariables();
  const file = fs.readFileSync(path, { encoding: "utf-8" });
  for (const line of file.split("\n")) {
    const [key, value] = line.split("=");
    if (!key || !value || key.startsWith("#") || ignore.includes(key)) {
      continue;
    }
    const envFound = envs.find((env) => env.key === key);
    if (envFound) {
      await editVariable(envFound.id, key, value, target);
      continue;
    }
    await addVariable(key, value, target);
  }
}

uploadVariablesFromFile(
  ".env",
  ["production", "development", "preview"],
  ["VERCEL_TOKEN"],
);
