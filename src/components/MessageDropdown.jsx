import React, { useState, useRef, useEffect } from "react";
import { MessageCircleMore } from "lucide-react";

export default function MessageDropdown({ messages = [] }) {
  const [open, setOpen] = useState(false);
  const [localMsg, setLocalMsg] = useState([]);
  const msgRef = useRef();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("messagesNoti")) || messages;
    setLocalMsg(saved);
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("messagesNoti", JSON.stringify(localMsg));
  }, [localMsg]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (msgRef.current && !msgRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearAll = async () => {
    setLocalMsg([]);
    localStorage.removeItem("messagesNoti");

    try {
      const res = await fetch("http://38.60.244.74:3000/admin-messages");
      const data = await res.json();

      const msgArr = Array.isArray(data?.data) ? data.data : data;
      const currentCount = msgArr.length;

      // ✅ store current count so no new noti appears
      localStorage.setItem("prevCount_messages", currentCount.toString());
    } catch {
      // fail-safe
      localStorage.setItem("prevCount_messages", "999999");
    }
  };

  const messageUI = {
    icon: <MessageCircleMore size={18} className="text-blue-400" />,
    textColor: "text-blue-300",
    gradient: "from-blue-500/20 to-transparent",
  };

  return (
    <div className="relative" ref={msgRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-2xl bg-neutral-900 border border-neutral-800 p-2 hover:bg-neutral-800"
      >
        <MessageCircleMore className="h-5 w-5 text-neutral-100" />
        {localMsg.some((m) => !m.read) && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-h-96  rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg z-50">
          <div className="p-4 border-b border-neutral-800 font-semibold flex justify-between items-center">
            <span>Messages</span>
            {localMsg.length > 0 && (
              <button
                onClick={clearAll}
                className="text-blue-400 text-sm hover:text-blue-300"
              >
                Clear all
              </button>
            )}
          </div>

          {localMsg.length === 0 && (
            <div className="p-4 text-center text-neutral-400">No messages</div>
          )}

          <div className="overflow-y-auto max-h-72  no-scrollbar">
            <ul>
              {localMsg.map((msg, i) => (
                <li
                  key={i}
                  className="relative px-4 py-3 border-b border-neutral-800 flex items-center gap-3"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 rounded-md bg-gradient-to-br ${messageUI.gradient}`}
                  />

                  <div className="relative flex items-center gap-3 w-full">
                    <div>{messageUI.icon}</div>

                    <div className={`flex-1 text-sm ${messageUI.textColor}`}>
                      {msg.message}
                      <div className="text-xs text-neutral-400">{msg.time}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
