import * as React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";

type Tweet = {
  edit_history_tweet_ids: string[];
  id: string;
  text: string;
};

const App: React.FC = () => {
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
    <div className="container tweets">
      <h1>Tweets</h1>

      {tweets?.map((tweet: Tweet) => (
        <div key={tweet.id}>
          <TwitterTweetEmbed tweetId={tweet.id} />
        </div>
      ))}
    </div>
  );
};

export default App;
