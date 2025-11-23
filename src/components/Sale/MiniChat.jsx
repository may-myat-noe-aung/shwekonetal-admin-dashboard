import React, { useState, useRef, useEffect } from "react";
import { Send, SmilePlus, Image, Loader2 } from "lucide-react"; // 🟡 added Loader2 only

const API_BASE = "http://38.60.244.74:3000";
const WS_URL = "ws://38.60.244.74:3000";

export default function MiniChat({ user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const [autoScroll, setAutoScroll] = useState(true);

  // 🟡 added loading states
  const [loading, setLoading] = useState(true);
  const [stickersLoading, setStickersLoading] = useState(true);

  const chatContainerRef = useRef(null);

  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // ===== fetch stickers =====
  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const res = await fetch(`${API_BASE}/stickers`);
        const data = await res.json();
        const fixed = (Array.isArray(data) ? data : []).map((s) => ({
          ...s,
          url:
            s.url && s.url.startsWith("http") ? s.url : `${API_BASE}${s.url}`,
        }));
        setStickers(fixed.map((s) => s.url));
      } catch (err) {
        console.error("Failed to fetch stickers:", err);
      } finally {
        setStickersLoading(false); // ✅ mark done
      }
    };
    fetchStickers();
  }, []);

  // ===== fetch chat history =====
  useEffect(() => {
    if (!user?.userid) return;
    const fetchHistory = async () => {
      try {
        setLoading(true); // ✅ start loading
        const res = await fetch(`${API_BASE}/messages?userId=${user.userid}`);
        const data = await res.json();
        const formatted = (Array.isArray(data) ? data : []).map((msg) => ({
          from: msg.sender === "admin" ? "admin" : "user",
          text: msg.content,
          type: msg.type || "text",
          createdAt: msg.created_at,
        }));
        setMessages(formatted);

        // ✅ mark as seen
        await fetch(`${API_BASE}/messages/mark-seen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.userid }),
        });
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false); // ✅ done
      }
    };
    fetchHistory();
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50); // small delay ensures messages are rendered
  }, [user]);

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // Disable autoScroll if user scrolls up
    setAutoScroll(scrollTop + clientHeight >= scrollHeight - 20);
  };

  useEffect(() => {
    if (autoScroll) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50); // small delay ensures the messages are rendered
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [loading, messages]);

  // ===== websocket =====
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "init", userId: "admin" }));
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data || !data.sender || !data.content) return;
        if (data.sender !== user.userid) return;
        setMessages((prev) => [
          ...prev,
          {
            from: "user",
            text: data.content,
            type: data.type || "text",
            createdAt: new Date(),
          },
        ]);
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };
    return () => ws.close();
  }, [user]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 112; // max-h-28
      const newHeight = Math.min(scrollHeight, maxHeight);
      textareaRef.current.style.height = newHeight + "px";
    }
  }, [newMsg]);



  // ===== send message =====
  const sendMessage = (text, type = "text") => {
    if (!text.trim() || !user?.userid) return;
    const msg = {
      from: "admin",
      text: text.trim(),
      type,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMsg("");
    setShowStickers(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px"; // exactly 1 line
    }

    try {
      wsRef.current?.send(
        JSON.stringify({
          sender: "admin",
          receiver: user.userid,
          type,
          content: text,
        })
      );
    } catch (err) {
      console.error("WS send failed:", err);
    }
  };

  const handleSendImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => sendMessage(event.target.result, "image");
    reader.readAsDataURL(file);
  };

  const handleStickerClick = (url) => sendMessage(url, "sticker");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current && newMsg) { // only adjust if user typed
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 112; // max-h-28
      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [newMsg]);



  return (
    <>
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[90%] max-w-[90%] rounded-xl shadow-lg"
          />
        </div>
      )}

      <div className="absolute right-[-300px] sm:right-[-525px] top-1/2 -translate-y-1/2 bg-neutral-900 text-white p-4 rounded-xl w-[350px] h-[500px] flex flex-col shadow-xl border border-neutral-700 z-[60]">
        <div className="flex justify-between items-center border-b border-neutral-700 pb-2 mb-2">
          <p className="font-semibold text-sm break-words text-sky-400">
            Chat with {user?.fullname || "Customer"}
          </p>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* 🟡 Loading UI for messages */}
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center gap-3 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
            <p className="text-sm italic">Loading messages...</p>
          </div>
        ) : (
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scroll"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[80%] break-words ${msg.from === "admin" ? "ml-auto items-end" : "items-start"
                  }`}
              >
                {msg.type === "text" && (
                  <div
                    className={`px-3 py-1.5 rounded-xl text-sm max-w-[80%] whitespace-pre-wrap break-words ${msg.from === "admin"
                        ? "bg-yellow-500 text-white rounded-br-none"
                        : "bg-neutral-700 text-white rounded-bl-none"
                      }`}
                  >
                    {msg.text}
                  </div>
                )}
                {msg.type === "image" && (
                  <img
                    src={msg.text}
                    alt="sent"
                    className="w-32 h-32 object-cover rounded-xl cursor-pointer"
                    onClick={() => setPreviewImage(msg.text)}
                  />
                )}
                {msg.type === "sticker" && (
                  <img
                    src={msg.text}
                    alt="sticker"
                    className="w-16 h-16 object-contain cursor-pointer"
                    onClick={() => setPreviewImage(msg.text)}
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="mt-2 flex gap-2 items-end relative">
          <button
            onClick={() => setShowStickers(!showStickers)}
            className="p-2 hover:bg-neutral-800 rounded-full"
          >
            <SmilePlus className="h-5 w-5 text-neutral-400" />
          </button>

          <input
            type="file"
            accept="image/*"
            onChange={handleSendImage}
            className="hidden"
            id="upload-image"
          />
          <label
            htmlFor="upload-image"
            className="p-2 hover:bg-neutral-800 rounded-full cursor-pointer"
          >
            <Image className="h-5 w-5 text-neutral-400" />
          </label>

          <textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            // onKeyDown={(e) =>
            //   e.key === "Enter" && !e.shiftKey && sendMessage(newMsg)
            // }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();      
                sendMessage(newMsg);     
                setNewMsg("");           
              }
            }}

            className="flex-1 bg-neutral-700 rounded-2xl px-3 py-1.5 text-sm text-white outline-none resize-none
           max-h-28 overflow-y-auto
           scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-neutral-800 hover:scrollbar-thumb-yellow-400 transition-all duration-200
"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#eab308 #262626",
            }}
            rows={1}
          />

          <button
            onClick={() => sendMessage(newMsg)}
            className="px-3 py-1.5 bg-yellow-500 rounded-full text-sm hover:bg-yellow-600"
          >
            <Send className="h-4 w-4" />
          </button>

          {/* 🟡 Loading UI for stickers */}
          {showStickers && (
            <div className="absolute bottom-14 left-0 bg-neutral-900 border border-neutral-700 p-3 rounded-2xl shadow-lg w-64 z-50">
              <h3 className="text-xs text-neutral-400 mb-2 px-1">Stickers</h3>
              {stickersLoading ? (
                <div className="flex justify-center items-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {stickers.map((s, idx) => (
                    <img
                      key={idx}
                      src={s}
                      alt="sticker"
                      className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform rounded-lg border border-neutral-700"
                      onClick={() => handleStickerClick(s)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}