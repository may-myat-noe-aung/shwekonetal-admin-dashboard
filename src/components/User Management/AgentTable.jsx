

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useAlert } from "../../AlertProvider";

const API_BASE = "http://38.60.244.74:3000";

export default function AgentTable() {
  const [agents, setAgents] = useState([]);
  const [newAgentId, setNewAgentId] = useState("");
  const [newAgentName, setNewAgentName] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  const agentCodeRef = useRef(null);
  const passcodeRef = useRef(null);

  const [page, setPage] = useState(1);
  const [pageWindow, setPageWindow] = useState(1);
  const pageSize = 5;
  const pagesPerWindow = 5;

  // ✅ Move fetchAgents to component scope
  const fetchAgents = async () => {
    try {
      const res = await fetch(`${API_BASE}/agents`);
      const data = await res.json();
      if (data.success) setAgents(data.data);
    } catch {
      showAlert("users အချက်အလက်များကို load ဆွဲလို့မရပါ။ သင့် internet connection ကို စစ်ဆေးပါ", "warning");
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAgents();

    // Repeat fetch every 500ms
    const intervalId = setInterval(fetchAgents, 500);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (showModal) {
      if (pendingAction?.type === "add") {
        agentCodeRef.current?.focus();
      } else {
        passcodeRef.current?.focus();
      }
    }
  }, [showModal, pendingAction]);

  const openAddModal = () => {
    setPendingAction({ type: "add" });
    setShowModal(true);
  };

  const openDeleteModal = (id) => {
    setPendingAction({ type: "delete", payload: { id } });
    setShowModal(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      verifyAndExecute();
    }
  };

  const verifyAndExecute = async () => {
    if (!passcode) {
      showAlert("Passcode ထည့်ပေးပါ", "warning");
      return;
    }

    if (pendingAction.type === "add") {
      if (!newAgentId || !newAgentName) return alert("ID and Name required");

      if (newAgentId.length !== 8)
        return showAlert("Agent Code သည် character 8 လုံး အတိအကျ ပေးရန် လိုအပ်သည်");
    }

    try {
      const verify = await fetch(`${API_BASE}/admin/verify-admin-passcode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const verifyRes = await verify.json();

      if (!verifyRes.success) {
        showAlert(verifyRes.message || "Incorrect passcode", "error");
        return;
      }

      if (pendingAction.type === "add")
        await addAgent({ id: newAgentId, name: newAgentName });
      if (pendingAction.type === "delete")
        await deleteAgent(pendingAction.payload.id);

      setShowModal(false);
      setPasscode("");
      setPendingAction(null);
      setNewAgentId("");
      setNewAgentName("");
    } catch {
      showAlert("Verification လုပ်ရန် အခက်အခဲ တစ်ချို့ရှိနေသည်", "error");
    }
  };

  const addAgent = async ({ id, name }) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });

      const data = await res.json();
      showAlert(data.message, "success");
      if (data.success) fetchAgents();
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/agents/${id}`, { method: "DELETE" });
      const data = await res.json();
      showAlert(data.message, "success");
      if (data.success) setAgents((prev) => prev.filter((a) => a.id !== id));
    } catch {
      showAlert("Delete ရန် အခက်အခဲ တစ်ချို့ရှိနေသည်", "error");
    }
  };

const filteredAgents = agents.filter((a) => {
  const q = searchQuery.toLowerCase();
  return (
    a.name.toLowerCase().includes(q) ||
    a.id.toLowerCase().includes(q)
  );
});

  const totalPages = Math.ceil(filteredAgents.length / pageSize);
  const startPage = (pageWindow - 1) * pagesPerWindow + 1;
  const endPage = Math.min(startPage + pagesPerWindow - 1, totalPages);
  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) visiblePages.push(i);

  const paginatedAgents = filteredAgents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
   <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-4">Agents</h2>

      <div className="flex flex-col md:flex-row justify-between mb-3 gap-3">
        <div className="flex gap-4 ">
          <input
            type="text"
            placeholder="Search Name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="rounded-full bg-neutral-900 border border-neutral-600 px-3 py-1.5 text-sm w-full md:w-64"
          />
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-1.5 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-black text-sm"
        >
          Add Agent
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl ">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-neutral-900/80  border-b border-neutral-600">
            <tr>
              <th className="px-3 py-2">No</th>
              <th className="px-3 py-2">Agent Code</th>
              <th className="px-3 py-2">Agent Name</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedAgents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-white/40">
                  No agents found
                </td>
              </tr>
            ) : (
              paginatedAgents.map((agent, idx) => {
                const d = new Date(agent.created_at);
                return (
                  <tr key={agent.id} className="hover:bg-neutral-900/50">
                    <td className="px-3 py-2">
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-3 py-2">{agent.id}</td>
                    <td className="px-3 py-2">{agent.name}</td>
                    <td className="px-3 py-2">
                      {d.toISOString().slice(0, 10)}
                    </td>
                    <td className="px-3 py-2">
                      {d.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => openDeleteModal(agent.id)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 rounded-xl text-white text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between px-4 py-2 text-sm text-neutral-400 gap-2 md:gap-0 mt-4">
          <p>
            Page {totalPages === 0 ? 0 : page} / {pageWindow}
          </p>

          <div className="flex gap-2 flex-wrap">
            <button
              disabled={page === 1}
              onClick={() => {
                const newPage = Math.max(1, page - 1);
                setPage(newPage);
                if (newPage < startPage) setPageWindow(pageWindow - 1);
              }}
              className={`px-3 py-1 rounded-md border border-neutral-700  ${
                page === 1
                  ? "text-neutral-500 cursor-not-allowed"
                  : "text-yellow-400 hover:bg-neutral-900"
              }`}
            >
              Prev
            </button>

            {visiblePages.map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`px-3 py-1 rounded-md border border-neutral-700 ${
                  page === n
                    ? "bg-yellow-500 text-black font-semibold"
                    : "text-yellow-400 hover:bg-neutral-900"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => {
                const newPage = Math.min(totalPages, page + 1);
                setPage(newPage);
                if (newPage > endPage) setPageWindow(pageWindow + 1);
              }}
              className={`px-3 py-1 rounded-md border border-neutral-700 ${
                page === totalPages
                  ? "text-neutral-500 cursor-not-allowed"
                  : "text-yellow-400 hover:bg-neutral-900"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onKeyDown={handleKeyDown}
        >
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button
              onClick={() => {
                setShowModal(false);
                setPendingAction(null);
                setPasscode("");
                setNewAgentId("");
                setNewAgentName("");
              }}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              {pendingAction?.type === "add" ? "Add Agent" : "Enter Passcode"}
            </h3>

            {pendingAction?.type === "add" && (
              <>
                <input
                  type="text"
                  ref={agentCodeRef}
                  value={newAgentId}
                  minLength={8}
                  maxLength={8}
                  onChange={(e) => setNewAgentId(e.target.value)}
                  placeholder="Agent Code "
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-3"
                />

                <input
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="Agent Name"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-3"
                />
              </>
            )}

            <input
              type="password"
              ref={passcodeRef}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4"
              placeholder="Enter passcode"
            />

            {/* ✅ CANCEL BUTTON ADDED — ONLY CHANGE */}
         <div className=" flex items-center justify-between gap-4">
             <button
              onClick={() => {
                setShowModal(false);
                setPendingAction(null);
                setPasscode("");
                setNewAgentId("");
                setNewAgentName("");
              }}
              className="w-full bg-neutral-700 text-white py-2 rounded-lg text-sm "
            >
              Cancel
            </button>

            <button
              onClick={verifyAndExecute}
              className="w-full bg-yellow-500 text-black py-2 rounded-lg text-sm"
            >
              {pendingAction?.type === "add" ? "Add Agent" : "Confirm"}
            </button>
         </div>
          </div>
        </div>
      )}
    </div>
  );
}
