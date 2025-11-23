import React, { useEffect, useState } from "react";
import MessageDropdown from "./MessageDropdown";

export default function MessagesFetcher() {
  const [messages, setMessages] = useState([]);

  const playSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.volume = 1;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("messagesNoti")) || [];
    setMessages(saved);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://38.60.244.74:3000/admin-messages");
        const data = await res.json();

        const msgArr = Array.isArray(data.data) ? data.data : data;
        const currentCount = msgArr.length;

        const key = "prevCount_messages";
        const prevCount = parseInt(localStorage.getItem(key) || "0");

        // ✅ No change → stop
        if (currentCount <= prevCount) return;

        // ✅ Get latest message sender
        const latest = msgArr[0];
        if (!latest?.sender) return;

        // ✅ Fetch user details
        const userRes = await fetch(`http://38.60.244.74:3000/users/${latest.sender}`);
        const user = await userRes.json();

        const fullname = user?.fullname || latest.sender;

        const newMsg = {
          message: `A new message has been sent by ${fullname}`,
          time: new Date().toLocaleTimeString(),
          read: false,
        };

        const updated = [
          newMsg,
          ...(JSON.parse(localStorage.getItem("messagesNoti")) || []),
        ];

        setMessages(updated);
        localStorage.setItem("messagesNoti", JSON.stringify(updated));
        localStorage.setItem(key, currentCount.toString());

        playSound();

      } catch (err) {
        console.error("Message fetch failed:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 500);
    return () => clearInterval(interval);
  }, []);

  return <MessageDropdown messages={messages} />;
}
