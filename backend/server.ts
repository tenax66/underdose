import express from "express";
import { Client } from "twitter-api-sdk";
import "dotenv/config";

const app: express.Express = express();
const port = 8000;

const MAX_RESULTS = 10;

app.get("/search", async (req: express.Request, res: express.Response) => {
  const token = process.env.BEARER_TOKEN;
  if (token === undefined) {
    throw new Error('Environment variable "BEARER_TOKEN" not set.');
  }

  const client = new Client(token);
  const query: string = "メンヘラ lang:ja";
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

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
