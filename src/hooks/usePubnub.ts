import { useEffect, useId, useRef, useState } from "react";
import Pubnub from "pubnub";

type props = {
  handleMessage: ({ message }: Pubnub.MessageEvent) => void;
};

const { REACT_APP_PUBNUB_SUBSCRIBE_KEY } = process.env;
const usePubnub = ({ handleMessage }: props) => {
  const [messageEvent, setMessageEvent] = useState<any>(null);
  const pubnubClient = useRef<Pubnub | null>(null);
  const messageEventHandlerRef = useRef<any | null>(null);
  const pubnubId = useId();

  // Initial pubnub setup
  useEffect(() => {
    if (!REACT_APP_PUBNUB_SUBSCRIBE_KEY) return;
    pubnubClient.current = new Pubnub({
      subscribeKey: REACT_APP_PUBNUB_SUBSCRIBE_KEY!,
      uuid: pubnubId,
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
