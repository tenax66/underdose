import * as React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Typography, Layout, Menu, theme } from "antd";

type Tweet = {
  edit_history_tweet_ids: string[];
  id: string;
  text: string;
  score: number;
};

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [tweets, setTweets] = React.useState<Tweet[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/search");
        const json: Tweet[] = await res.json();

        //map内で非同期処理を行う
        const result = await Promise.all(
          json.map(async (tweet: Tweet) => {
            const urlSearchParam = new URLSearchParams({ text: tweet.text }).toString();
            const res = await fetch("/emotional-analysis/?" + urlSearchParam);
            const json = await res.json();
            tweet.score = json.score;

            return tweet;
          })
        );
        setTweets(result);
      } catch (e: unknown) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Header style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}>
        <Title style={{ color: "white", paddingTop: "5px" }}>Underdose</Title>
        <Menu theme="dark" mode="horizontal" items={[]} />
      </Header>
      <Content className="site-layout" style={{ padding: "0 25px" }}>
        <div style={{ padding: 8, minHeight: 380, background: colorBgContainer }}>
          <h1 className="center">Tweets</h1>
          <div className="container">
            <div>
              {tweets?.map((tweet: Tweet) => (
                <div key={tweet.id}>
                  <TwitterTweetEmbed
                    tweetId={tweet.id}
                    options={{
                      hideCard: false,
                      hideThread: true,
                      width: 720,
                    }}
                    placeholder="loading..."
                  />
                  <div>{tweet.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>Underdose ©2023</Footer>
    </Layout>
  );
};

export default App;
