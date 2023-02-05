import * as React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Typography, Layout, Menu, theme } from "antd";

type Tweet = {
  edit_history_tweet_ids: string[];
  id: string;
  text: string;
};

type ScoredTweet = {
  tweet: Tweet;
  score: string;
};

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [tweets, setTweets] = React.useState<Tweet[] | null>(null);
  const [scoredTweets, setScoredTweets] = React.useState<ScoredTweet[] | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/search");
        const json: React.SetStateAction<Tweet[] | null> = await res.json();
        setTweets(json);
      } catch (e: unknown) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchScore = async () => {
      const scoredTweets: ScoredTweet[] = [];

      tweets?.forEach(async function (tweet: Tweet) {
        const params = {
          text: tweet.text,
        };
        const urlSearchParam = new URLSearchParams(params).toString();
        const res = await fetch("/emotional-analysis/?" + urlSearchParam);
        const json = await res.json();

        const scoredTweet: ScoredTweet = {
          tweet: tweet,
          score: json.score,
        };

        scoredTweets.push(scoredTweet);
      });

      const json: React.SetStateAction<ScoredTweet[] | null> = scoredTweets;
      setScoredTweets(json);
    };

    fetchScore();
  }, []);

  return (
    <Layout>
      <Header style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}>
        <Title style={{ color: "white", paddingTop: "5px" }}>Underdose</Title>
        <Menu theme="dark" mode="horizontal" items={[]} />
      </Header>
      <Content className="site-layout" style={{ padding: "0 25px" }}>
        <div style={{ padding: 8, minHeight: 380, background: colorBgContainer }}>
          <div className="container tweets">
            <h1>Tweets</h1>
            {scoredTweets?.map((scoredTweet: ScoredTweet) => (
              <div key={scoredTweet.tweet.id}>
                <TwitterTweetEmbed
                  tweetId={scoredTweet.tweet.id}
                  options={{
                    hideCard: false,
                    hideThread: true,
                  }}
                  placeholder="loading..."
                />
                <div>{scoredTweet.score}</div>
              </div>
            ))}
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>Underdose ©2023</Footer>
    </Layout>
  );
};

export default App;
