import express from "express";
import path from "path";
import { tokenize, KuromojiToken } from "kuromojin";
import { Client } from "twitter-api-sdk";
import "dotenv/config";

const assert = require("assert");
const analyze = require("negaposi-analyzer-ja");
const app: express.Express = express();
const port = Number(process.env.PORT) || 8000;

const MAX_RESULTS = 10;

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("/search", async (req: express.Request, res: express.Response) => {
  const token = process.env.BEARER_TOKEN;
  if (token === undefined) {
    throw new Error('Environment variable "BEARER_TOKEN" not set.');
  }

  const client = new Client(token);
  const query: string = "サンプル lang:ja";
  try {
    const response = await searchByTweet(client, query);
    res.send(response);
  } catch (e) {
    console.error(e);
  }
});

async function searchByTweet(client: Client, query: string): Promise<any> {
  const response = await client.tweets.tweetsRecentSearch({
    query: query,
    max_results: MAX_RESULTS,
  });

  return response.data;
}

app.get("/emotional-analysis", async (req: express.Request, res: express.Response) => {
  const text = req.query.text as string | undefined;
  tokenize(text ?? "").then((tokens) => {
    const score = analyze(tokens);
    var json = JSON.parse("{}");
    json.score = score;
    res.send(json);
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
