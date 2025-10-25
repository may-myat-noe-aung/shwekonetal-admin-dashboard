import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Image as StickerIcon,
  CheckCheck,
  Smile,
  SmileIcon,
  SmilePlus,
  Image,
} from "lucide-react";
import sticker1 from "../../assets/images/stickers/sticker_1.jpg";
// import sticker2 from "../../assets/images/stickers/sticker_2.png";
import sticker3 from "../../assets/images/stickers/sticker_3.png";

const USERS = [
  { id: 1, name: "Mg Mg" },
  { id: 2, name: "Aung Aung" },
  { id: 3, name: "Su Su" },
];

// Example stickers
const STICKERS = [sticker1, sticker3];

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(USERS[0]);
  const [messages, setMessages] = useState({
    1: [
      { from: "user", text: "Hi Admin 👋" },
      {
        from: "admin",
        text: "Hello Mg Mg! How can I help you today?",
        seen: true,
      },
    ],
    2: [{ from: "user", text: "Any update about my order?" }],
    3: [],
  });
  const [newMessage, setNewMessage] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const [autoScroll, setAutoScroll] = useState(true);
  const chatContainerRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Simulate user typing after admin sends a message
  const simulateUserReply = (userId) => {
    setLoading(true);
    setTimeout(() => {
      const updated = { ...messages };

      // Add actual reply text instead of fake "Typing response..."
      updated[userId].push({ from: "user", text: "Thanks for your message!" });

      setMessages(updated);
      setLoading(false); // stop typing
    }, 1000);
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    setAutoScroll(true); // ✅ text or sticker ပို့တဲ့အခါ scroll ပြန်ဖွင့်
    const updated = { ...messages };
    updated[selectedUser.id].push({ from: "admin", text, seen: true });
    setMessages(updated);
    setNewMessage("");
    simulateUserReply(selectedUser.id);
  };

  const handleStickerClick = (url) => {
    setAutoScroll(true); // ✅ sticker ပို့တဲ့အခါ scroll ဖွင့်
    const updated = { ...messages };
    updated[selectedUser.id].push({ from: "admin", text: url, isImage: true });
    setMessages(updated);
    setShowStickers(false);
    simulateUserReply(selectedUser.id);
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🧷 Save scroll position before image loads
    const scrollPos = chatContainerRef.current?.scrollTop || 0;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAutoScroll(false); // photo → no scroll
      const updated = { ...messages };
      updated[selectedUser.id].push({
        from: "admin",
        text: event.target.result,
        isImage: true,
      });
      setMessages(updated);

      // 🧷 Restore scroll position after render
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = scrollPos;
        }
      }, 100);
      simulateUserReply(selectedUser.id);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-[85.5vh] bg-neutral-950 text-neutral-100 border border-neutral-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-1/4 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="px-4 py-3 border-b border-neutral-800">
          <input
            type="text"
            placeholder="Search user..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-neutral-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {USERS.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-colors ${
                selectedUser.id === user.id
                  ? "bg-yellow-600/20 border-l-4 border-yellow-500"
                  : "hover:bg-neutral-800"
              }`}
            >
              <img
                className="w-10 h-10 rounded-full border border-neutral-700"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=2b2b2b&color=fff`}
                alt={user.name}
              />
              <div className="flex-1">
                <p className="font-medium text-sm text-neutral-200">
                  {user.name}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {messages[user.id]?.slice(-1)[0]?.text || "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-neutral-950">
        {/* Header */}
        <div className="flex flex-col bg-neutral-900/70 backdrop-blur-md px-5 py-3 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            {/* User avatar */}
            <img
              className="w-10 h-10 rounded-full border border-neutral-700"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                selectedUser.name
              )}&background=2b2b2b&color=fff`}
              alt={selectedUser.name}
            />

            {/* Name + typing */}
            <div className="flex flex-col">
              <h2 className="font-semibold text-neutral-100">
                {selectedUser.name}
              </h2>

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-yellow-400">typing</span>
                  {/* Animated dots */}
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce delay-300"></span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-5 space-y-4 w-full max-w-full"
        >
          {(messages[selectedUser.id] || []).map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.from === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              {/* {msg.isImage ? (
                <div
                  className={`relative ${
                    STICKERS.includes(msg.text)
                      ? "w-20 h-20"
                      : "w-20"
                  }`}
                >
                  <img
                    src={msg.text}
                    alt="sent"
                    className="w-full h-full object-cover rounded-2xl"
                    loading="lazy"
                    onLoad={(e) => (e.target.style.opacity = 1)}
                    style={{ opacity: 0, transition: "opacity 0.3s ease" }}
                  />
                </div>
              ) : (
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                    msg.from === "admin"
                      ? "bg-yellow-500 text-white rounded-br-none"
                      : "bg-neutral-800 text-neutral-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                  {msg.from === "admin" && msg.seen && (
                    <CheckCheck className="inline ml-1 w-3 h-3 text-neutral-800" />
                  )}
                </div>
              )} */}
              {msg.isImage ? (
                <div
                  className={`relative ${
                    STICKERS.includes(msg.text) ? "w-20 h-20" : "w-20"
                  }`}
                >
                  <img
                    src={msg.text}
                    alt="sent"
                    className="w-full h-full object-cover rounded-2xl"
                    loading="lazy"
                    onLoad={(e) => (e.target.style.opacity = 1)}
                    // style={{ opacity: 0, transition: "opacity 0.3s ease" }}
                  />
                </div>
              ) : (
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                    msg.from === "admin"
                      ? "bg-yellow-500 text-white rounded-br-none"
                      : "bg-neutral-800 text-neutral-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                  {msg.from === "admin" && msg.seen && (
                    <CheckCheck className="inline ml-1 w-3 h-3 text-white" />
                  )}
                </div>
              )}
            </div>
          ))}
          {/* Typing indicator below header */}
          {/* {loading && (
            <div className="px-5 py-1 text-sm text-neutral-400">
              {selectedUser.name} is typing...
            </div>
          )} */}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-neutral-800 bg-neutral-900/70 backdrop-blur-md px-4 py-3 flex items-center gap-2 relative">
          <button
            onClick={() => setShowStickers(!showStickers)}
            className="p-2 hover:bg-neutral-800 rounded-full"
          >
            <SmilePlus className="h-5 w-5 text-neutral-400" />
          </button>

          <input
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            className="hidden"
            id="upload-image"
          />
          <label
            htmlFor="upload-image"
            className="p-2 hover:bg-neutral-800 rounded-full cursor-pointer"
          >
            <Image className="h-5 w-5 text-neutral-400" />
          </label>

          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(newMessage)}
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-neutral-500"
          />

          <button
            onClick={() => handleSend(newMessage)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>

          {/* Sticker Picker */}
          {/* {showStickers && (
            <div className="absolute bottom-12 left-12 bg-neutral-800 border border-neutral-700 p-2 rounded-xl flex gap-2">
              {STICKERS.map((s, idx) => (
                <img
                  key={idx}
                  src={s}
                  alt="sticker"
                  className="w-12 h-12 cursor-pointer"
                  onClick={() => handleStickerClick(s)}
                />
              ))}
            </div>
          )} */}
          {showStickers && (
            <div className="absolute bottom-14 left-4 bg-neutral-900 border border-neutral-700 p-3 rounded-2xl shadow-lg w-60">
              <h3 className="text-xs text-neutral-400 mb-2 px-1">Stickers</h3>
              <div className="grid grid-cols-4 gap-2">
                {STICKERS.map((s, idx) => (
                  <img
                    key={idx}
                    src={s}
                    alt="sticker"
                    className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform rounded-lg border border-neutral-700"
                    onClick={() => handleStickerClick(s)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
