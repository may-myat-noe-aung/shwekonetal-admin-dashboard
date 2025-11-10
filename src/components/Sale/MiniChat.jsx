import React, { useState, useRef, useEffect } from "react";
import { Send, SmilePlus, Image } from "lucide-react";

const API_BASE = "http://38.60.244.74:3000";
const WS_URL = "ws://38.60.244.74:3000";

export default function MiniChat({ user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
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
      }
    };
    fetchStickers();
  }, []);

  // ===== fetch chat history =====
  useEffect(() => {
    if (!user?.userid) return;
    const fetchHistory = async () => {
      try {
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
      }
    };
    fetchHistory();
  }, [user]);

  // ===== WebSocket =====
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "init", userId: "admin" }));
      console.log("✅ MiniChat connected");
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

    ws.onclose = () => console.log("MiniChat WS closed");
    ws.onerror = (err) => console.error("MiniChat WS error:", err);

    return () => ws.close();
  }, [user]);

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

  // ===== send image =====
  const handleSendImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => sendMessage(event.target.result, "image");
    reader.readAsDataURL(file);
  };

  const handleStickerClick = (url) => sendMessage(url, "sticker");

  // ===== auto scroll =====
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===== auto resize textarea =====
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [newMsg]);

  // ===== UI =====
  return (
    <>
      {/* Image Preview Modal */}
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

      <div className="absolute right-[-300px] sm:right-[-515px] top-1/2 -translate-y-1/2 bg-neutral-900 text-white p-4 rounded-xl w-[350px] h-[500px] flex flex-col shadow-xl border border-neutral-700 z-[60]">
        {/* Header */}
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

        {/* Messages */}
   <div
  ref={chatContainerRef}
  className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scroll"
>
  {messages.map((msg, i) => (
    <div
      key={i}
      className={`flex flex-col max-w-[80%] break-words ${
        msg.from === 'admin' ? 'ml-auto items-end' : 'items-start'
      }`}
    >
      {msg.type === 'text' && (
        <div
          className={`px-3 py-1.5 rounded-xl text-sm max-w-[80%] whitespace-pre-wrap break-words ${
            msg.from === 'admin'
              ? 'bg-yellow-500 text-white rounded-br-none'
              : 'bg-neutral-700 text-white rounded-bl-none'
          }`}
        >
          {msg.text}
        </div>
      )}
      {msg.type === 'image' && (
        <img
          src={msg.text}
          alt="sent"
          className="w-32 h-32 object-cover rounded-xl cursor-pointer"
          onClick={() => setPreviewImage(msg.text)}
        />
      )}
      {msg.type === 'sticker' && (
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


        {/* Input */}
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
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage(newMsg)
            }
            className="flex-1 bg-neutral-700 rounded-2xl px-3 py-1.5 text-sm text-white outline-none resize-none max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-neutral-800 hover:scrollbar-thumb-yellow-400 transition-all duration-200"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#eab308 #262626", // (yellow-500, neutral-800)
            }}
          />

          <button
            onClick={() => sendMessage(newMsg)}
            className="px-3 py-1.5 bg-yellow-500 rounded-full text-sm hover:bg-yellow-600"
          >
            <Send className="h-4 w-4" />
          </button>

          {/* Sticker Panel */}
          {showStickers && (
            <div className="absolute bottom-14 left-0 bg-neutral-900 border border-neutral-700 p-3 rounded-2xl shadow-lg w-64 z-50">
              <h3 className="text-xs text-neutral-400 mb-2 px-1">Stickers</h3>
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
