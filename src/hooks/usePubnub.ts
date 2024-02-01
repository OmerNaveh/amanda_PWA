import { useEffect, useRef } from "react";
import Pubnub from "pubnub";
import { useAuthContext } from "context/AuthContext";

type props = {
  handleMessage: ({ message }: Pubnub.MessageEvent) => void;
};

const { REACT_APP_PUBNUB_SUBSCRIBE_KEY } = process.env;
const usePubnub = ({ handleMessage }: props) => {
  const pubnubClient = useRef<Pubnub | null>(null);
  const messageEventHandlerRef = useRef<any | null>(null);
  const { user } = useAuthContext();

  // Initial pubnub setup
  useEffect(() => {
    if (!REACT_APP_PUBNUB_SUBSCRIBE_KEY || !user?.id) return;
    pubnubClient.current = new Pubnub({
      subscribeKey: REACT_APP_PUBNUB_SUBSCRIBE_KEY!,
      uuid: String(user.id),
    });
    if (messageEventHandlerRef.current) {
      pubnubClient.current.removeListener(messageEventHandlerRef.current);
      messageEventHandlerRef.current = { message: handleMessage };
    } else {
      messageEventHandlerRef.current = { message: handleMessage };
    }
    pubnubClient.current.addListener(messageEventHandlerRef.current);
    return () => {
      if (!pubnubClient.current) return;
      pubnubClient.current.removeListener(messageEventHandlerRef.current);
    };
  }, []);

  const connectToPubnub = (channel: string | null) => {
    if (!channel || pubnubClient.current === null) return;
    const subscribedChannels = pubnubClient.current.getSubscribedChannels();
    if (subscribedChannels.includes(channel)) return; // prevent duplicate subscriptions to same channel
    pubnubClient.current.subscribe({ channels: [channel], withPresence: true });
    console.log("subscribed to channel");
  };
  const handleDisconnectFromPubnub = (channel: string | null) => {
    if (!pubnubClient.current || !channel) return;
    pubnubClient.current.unsubscribe({
      channels: [channel],
    });

    console.log("disconnected from channel");
  };

  return {
    connectToPubnub,
    handleDisconnectFromPubnub,
  };
};

export default usePubnub;
