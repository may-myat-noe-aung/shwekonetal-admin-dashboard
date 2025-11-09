import React, { useState, useEffect, useRef } from "react";
import { Send, CheckCheck, SmilePlus, Image } from "lucide-react";

const API_BASE = "http://38.60.244.74:3000";
const WS_URL = "ws://38.60.244.74:3000";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const wsRef = useRef(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // ===== fetch users =====
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/users`);
        const data = await res.json();
        const approved = Array.isArray(data)
          ? data.filter((u) => (u.status ? u.status === "approved" : true))
          : [];
        const list = approved.length
          ? approved
          : Array.isArray(data)
          ? data
          : [];
        setUsers(list);
        if (list.length > 0 && !selectedUser) setSelectedUser(list[0]);

        // 🟡 fetch all last messages + unseen counts once
        const all = {};
        const counts = {};
        for (const u of list) {
          try {
            const resMsg = await fetch(`${API_BASE}/messages?userId=${u.id}`);
            const msgs = await resMsg.json();
            const formatted = (Array.isArray(msgs) ? msgs : []).map((msg) => ({
              from: msg.sender === "admin" ? "admin" : "user",
              text: msg.content,
              isSticker: msg.type === "sticker",
              isImage: msg.type === "image",
              seen: !!msg.seen,
              createdAt: msg.created_at,
            }));
            all[u.id] = formatted;

            // unseen count
            const unseen = formatted.filter(
              (m) => m.from === "user" && !m.seen
            ).length;
            counts[u.id] = unseen;
          } catch (e) {
            console.error("Msg preload fail for", u.id, e);
          }
        }
        setMessages(all);
        setUnreadCounts(counts);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

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
        setStickers(fixed);
      } catch (err) {
        console.error("Failed to fetch stickers:", err);
      }
    };
    fetchStickers();
  }, []);

  // ===== fetch messages =====
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/messages?userId=${selectedUser.id}`
        );
        const data = await res.json();
        const formatted = (Array.isArray(data) ? data : []).map((msg) => ({
          from: msg.sender === "admin" ? "admin" : "user",
          text: msg.content,
          isSticker: msg.type === "sticker",
          isImage: msg.type === "image",
          seen: !!msg.seen,
          createdAt: msg.created_at,
        }));
        setMessages((prev) => ({ ...prev, [selectedUser.id]: formatted }));

        // ✅ mark as seen in DB
        await fetch(`${API_BASE}/messages/mark-seen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: selectedUser.id }),
        });

        // ✅ reset unread UI count
        setUnreadCounts((prev) => ({ ...prev, [selectedUser.id]: 0 }));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // ===== handle user select =====
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      await fetch(`${API_BASE}/messages/mark-seen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (err) {
      console.error("Failed to mark seen:", err);
    }
    setUnreadCounts((prev) => ({ ...prev, [user.id]: 0 }));
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ===== WebSocket =====
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({ type: "init", userId: "admin" }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data || !data.sender || !data.content) return;

        // Ignore echo of admin
        if (data.sender === "admin") return;

        const userIdRelated = data.sender;
        setMessages((prev) => {
          const updated = { ...prev };
          if (!updated[userIdRelated]) updated[userIdRelated] = [];
          updated[userIdRelated].push({
            from: "user",
            text: data.content,
            isSticker: data.type === "sticker",
            isImage: data.type === "image",
            seen: false,
            createdAt: new Date(),
          });
          return updated;
        });

        // Unread update
        setUnreadCounts((prev) => ({
          ...prev,
          [userIdRelated]:
            selectedUser?.id === userIdRelated
              ? 0
              : (prev[userIdRelated] || 0) + 1,
        }));

        // ✅ Auto mark seen if that user is open
        if (selectedUser?.id === userIdRelated) {
          fetch(`${API_BASE}/messages/mark-seen`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userIdRelated }),
          }).catch(() => {});
        }
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    ws.onclose = () => console.log("WebSocket closed");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.close();
  }, [selectedUser]);

  // ===== Auto scroll =====
  useEffect(() => {
    if (autoScroll)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, autoScroll]);

  useEffect(() => {
    if (selectedUser) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [selectedUser]);

  // ===== send message =====
  const sendMessage = (text, type = "text") => {
    if (!text || !selectedUser) return;
    const msgObj = {
      from: "admin",
      text,
      isSticker: type === "sticker",
      isImage: type === "image",
      seen: true,
      createdAt: new Date(),
    };
    setMessages((prev) => {
      const updated = { ...prev };
      updated[selectedUser.id] = updated[selectedUser.id] || [];
      updated[selectedUser.id].push(msgObj);
      return updated;
    });

    try {
      wsRef.current?.send(
        JSON.stringify({
          sender: "admin",
          receiver: selectedUser.id,
          type,
          content: text,
        })
      );
    } catch (err) {
      console.error("WS send failed:", err);
    }
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setAutoScroll(true);
    sendMessage(newMessage.trim(), "text");
    setNewMessage("");
  };

  const handleStickerClick = (s) => {
    setAutoScroll(true);
    const url = s.url || s;
    sendMessage(url, "sticker");
    setShowStickers(false);
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      sendMessage(base64, "image");
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSticker = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name || "sticker.png");
    try {
      const res = await fetch(`${API_BASE}/stickers`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const url =
        data.url && data.url.startsWith("http")
          ? data.url
          : `${API_BASE}${data.url || data.path || ""}`;
      if (url) setStickers((prev) => [...prev, { id: Date.now(), url }]);
    } catch (err) {
      console.error("Sticker upload failed:", err);
    }
  };

  const shownUsers = users
    .filter((u) =>
      (u.fullname || u.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const lastA = messages[a.id]?.slice(-1)[0]?.createdAt || 0;
      const lastB = messages[b.id]?.slice(-1)[0]?.createdAt || 0;
      return new Date(lastB) - new Date(lastA);
    });

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="flex h-[80vh] rounded-2xl bg-neutral-950 text-neutral-100 border border-neutral-800 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-1/4 bg-neutral-900 border-r border-neutral-800 flex flex-col">
            <div className="px-4 py-3 border-b border-neutral-800">
              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-neutral-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {(shownUsers.length ? shownUsers : users).map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-colors ${
                    selectedUser?.id === user.id
                      ? "bg-yellow-600/20 border-l-4 border-yellow-500"
                      : "hover:bg-neutral-800"
                  }`}
                >
                  {/* Avatar */}
                  <img
                    className="w-10 h-10 rounded-full border border-neutral-700 flex-shrink-0"
                    src={
                      user.profile ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.fullname || user.name || ""
                      )}&background=2b2b2b&color=fff`
                    }
                    alt={user.fullname || user.name}
                  />

                  {/* User Info + Last Message */}
                  <div className="flex-1 flex justify-between items-center overflow-hidden">
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-neutral-200 truncate">
                        {user.fullname || user.name}
                      </p>
                      <p className="text-xs text-neutral-400 overflow-hidden text-ellipsis whitespace-nowrap">
                        {messages[user.id]?.slice(-1)[0]?.text
                          ? messages[user.id].slice(-1)[0].isSticker
                            ? "📎 Sticker"
                            : messages[user.id].slice(-1)[0].isImage
                            ? "🖼️ Image"
                            : messages[user.id].slice(-1)[0].text
                          : "No messages yet"}
                      </p>
                    </div>

                    {/* Right side: Time + Notification bubble */}
                    <div className="flex flex-col items-end ml-2 shrink-0">
                      {/* Last message time */}
                      <span className="text-[10px] text-yellow-400">
                        {messages[user.id]?.length
                          ? new Date(
                              messages[user.id][
                                messages[user.id].length - 1
                              ].createdAt
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : ""}
                      </span>

                      {/* Unread count bubble */}
                      {unreadCounts[user.id] > 0 && (
                        <span className="mt-1 min-w-[18px] h-[18px] px-1.5 flex items-center justify-center text-[10px] font-semibold text-white bg-yellow-500 rounded-full shadow-md">
                          {unreadCounts[user.id] > 99
                            ? "99+"
                            : unreadCounts[user.id]}
                        </span>
                      )}
                    </div>
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
                <img
                  className="w-10 h-10 rounded-full border border-neutral-700"
                  src={
                    selectedUser?.profile ||
                    (selectedUser
                      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedUser.fullname || selectedUser.name
                        )}&background=2b2b2b&color=fff`
                      : `https://ui-avatars.com/api/?name=No+User&background=2b2b2b&color=fff`)
                  }
                  alt={selectedUser?.fullname || selectedUser?.name}
                />
                <div className="flex flex-col">
                  <h2 className="font-semibold text-neutral-100">
                    {selectedUser?.fullname ||
                      selectedUser?.name ||
                      "No user selected"}
                  </h2>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-4 w-full max-w-full"
            >
              {(() => {
                const userMessages =
                  selectedUser && messages[selectedUser.id]
                    ? messages[selectedUser.id]
                    : [];
                let lastDate = "";

                return userMessages.map((msg, idx) => {
                  const currentDate = formatDate(msg.createdAt || new Date());
                  const showDateHeader = currentDate !== lastDate;
                  lastDate = currentDate;

                  return (
                    <React.Fragment key={idx}>
                      {showDateHeader && (
                        <div className="text-center text-xs text-neutral-400 my-3">
                          {currentDate}
                        </div>
                      )}

                      <div
                        className={`flex ${
                          msg.from === "admin" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.isSticker ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={msg.text}
                              alt="sticker"
                              className="w-24 h-24 object-contain rounded-xl"
                            />
                            <span className="text-[10px] text-yellow-400 mt-1">
                              {formatTime(msg.createdAt || new Date())}
                            </span>
                          </div>
                        ) : msg.isImage ? (
                          <div className="flex flex-col items-end">
                            <div className="relative w-40">
                              <img
                                src={msg.text}
                                alt="sent"
                                className="w-full h-full object-cover rounded-2xl cursor-pointer"
                                onClick={() => setPreviewPhoto(msg.text)}
                                loading="lazy"
                              />
                            </div>
                            <span className="text-[10px] text-yellow-400 mt-1">
                              {formatTime(msg.createdAt || new Date())}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end">
                            <div
                              className={`max-w-xs px-4 py-2 rounded-2xl text-sm break-words ${
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
                            <span className="text-[10px] text-yellow-400 mt-1">
                              {formatTime(msg.createdAt || new Date())}
                            </span>
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                });
              })()}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
      <div className="border-t border-neutral-800 bg-neutral-900/70 backdrop-blur-md px-4 py-3 flex items-end gap-2 relative">
  {/* Stickers button */}
  <button
    onClick={() => setShowStickers(!showStickers)}
    className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
  >
    <SmilePlus className="h-5 w-5 text-neutral-400" />
  </button>

  {/* Image upload */}
  <input
    type="file"
    accept="image/*"
    onChange={handleUploadImage}
    className="hidden"
    id="upload-image"
  />
  <label
    htmlFor="upload-image"
    className="p-2 hover:bg-neutral-800 rounded-full cursor-pointer transition-colors"
  >
    <Image className="h-5 w-5 text-neutral-400" />
  </label>

  {/* Auto-resize textarea for messages */}
  <textarea
    placeholder="Type a message..."
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
    rows={1}
    className="flex-1 max-h-32 resize-none bg-neutral-800 border border-neutral-700 rounded-2xl px-4 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-neutral-500 overflow-y-auto"
  />

  {/* Send button */}
  <button
    onClick={handleSend}
    className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 flex items-center justify-center transition-colors"
  >
    <Send className="h-5 w-5" />
  </button>

  {/* Stickers panel */}
  {showStickers && (
    <div className="absolute bottom-14 left-4 bg-neutral-900 border border-neutral-700 p-3 rounded-2xl shadow-lg w-64 z-50">
      <h3 className="text-xs text-neutral-400 mb-2 px-1">Stickers</h3>
      <div className="grid grid-cols-4 gap-2">
        <label
          htmlFor="upload-sticker"
          className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-dashed border-neutral-600 text-neutral-500 cursor-pointer hover:border-yellow-500 hover:text-yellow-500 transition-all"
        >
          +
        </label>
        <input
          id="upload-sticker"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUploadSticker}
        />
        {stickers.map((s, idx) => (
          <img
            key={s.id || idx}
            src={s.url || s}
            alt="sticker"
            className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform rounded-lg border border-neutral-700"
            onClick={() => handleStickerClick(s)}
          />
        ))}
      </div>
    </div>
  )}
</div>

            {previewPhoto && (
              <div
                onClick={() => setPreviewPhoto(null)}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer"
              >
                <img
                  src={previewPhoto}
                  alt="preview"
                  className="max-h-[80vh] max-w-[80vw] object-contain rounded-xl shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
