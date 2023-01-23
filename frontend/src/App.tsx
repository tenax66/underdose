import * as React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Typography, Layout, Menu, theme } from "antd";

type Tweet = {
  edit_history_tweet_ids: string[];
  id: string;
  text: string;
};

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [tweets, setTweets] = React.useState<Tweet[] | null>(null);

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

  return (
    <Layout>
      <Header style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}>
        <Title style={{ color: "white", paddingTop: "5px" }}>Underdose</Title>
        <Menu theme="dark" mode="horizontal" items={[]} />
      </Header>
      <Content className="site-layout" style={{ padding: "0 50px" }}>
        <div style={{ padding: 24, minHeight: 380, background: colorBgContainer }}>
          <div className="container tweets">
            <h1>Tweets</h1>
            {tweets?.map((tweet: Tweet) => (
              <div key={tweet.id}>
                <TwitterTweetEmbed tweetId={tweet.id} />
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
