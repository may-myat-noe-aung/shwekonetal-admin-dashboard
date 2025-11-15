
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function ServerToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const API_BASE = "http://38.60.244.74:3000/open-server";

  // ✅ Fetch server status
  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const res = await axios.get(API_BASE);
        if (res.data && res.data.data) {
          setIsOpen(res.data.data.server === 1);
        }
      } catch (error) {
        console.error("Failed to fetch server status:", error);
        setAlertMessage("Failed to load server status.");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };
    fetchServerStatus();
  }, []);

  // ✅ Update server after password + timer
  const toggleServer = async (newStatus) => {
    try {
      await axios.post(API_BASE, { server: newStatus ? 1 : 0 });
      setIsOpen(newStatus);
      setAlertMessage(`Server is now ${newStatus ? "Open" : "Closed"}!`);
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to update server status.");
      setShowAlert(true);
    }
  };

  // ✅ Open modal
  const handleClick = (status) => {
    setPassword("");
    setCountdown(10);
    setShowModal(true);
    setIsDropdownOpen(false);
    setPendingStatus(status); // new state to track desired status
  };

  const [pendingStatus, setPendingStatus] = useState(isOpen); // track selected option

  // ✅ Cancel modal
  const cancelUpdate = () => {
    setShowModal(false);
    setPassword("");
    setCountdown(10);
  };

  // ✅ Handle password confirm
  const handlePasswordSubmit = () => {
    if (password.trim() === "") {
      setAlertMessage("Please enter passcode!");
      setShowAlert(true);
      return;
    }
    // Start countdown
    let timeLeft = 10;
    const timer = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft === 0) {
        clearInterval(timer);
        setShowModal(false);
        toggleServer(pendingStatus);
      }
    }, 1000);
  };

  // ✅ Close alert
  const closeAlert = () => setShowAlert(false);

  return (
    <div className="flex flex-col items-start gap-3 relative">
      <div className="text-center">
        <div className="font-semibold text-lg text-neutral-300 mb-2">
          Server Status
        </div>

        {loading ? (
          <span className="text-neutral-400 text-sm">Loading...</span>
        ) : (
          <div className="relative w-32">
            {/* Dropdown button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-semibold 
              ${isOpen ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"} 
              border ${isOpen ? "border-green-500" : "border-red-500"} hover:border-yellow-500 transition-colors duration-300`}
            >
              <span>{isOpen ? "Open" : "Closed"}</span>
              <svg
                className="h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown options */}
            {isDropdownOpen && (
              <ul className="absolute mt-1 w-full bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
                <li
                  onClick={() => handleClick(true)}
                  className="px-3 py-2 cursor-pointer hover:bg-green-600 hover:text-white rounded-t-lg text-green-400"
                >
                  Open
                </li>
                <li
                  onClick={() => handleClick(false)}
                  className="px-3 py-2 cursor-pointer hover:bg-red-600 hover:text-white rounded-b-lg text-red-400"
                >
                  Closed
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* ✅ Passcode + Countdown Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button
              onClick={cancelUpdate}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center text-white">
              {countdown === 10
                ? `Enter Passcode to ${pendingStatus ? "Open" : "Close"} Server`
                : `Processing in ${countdown}s...`}
            </h3>

            {countdown === 10 ? (
              <>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm mb-4 text-white"
                />
                <div className="flex justify-between">
                  <button
                    onClick={cancelUpdate}
                    className="bg-neutral-700 text-white px-3 py-2 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSubmit}
                    className="bg-yellow-500 text-black px-3 py-2 rounded-md text-sm"
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-full bg-neutral-800 rounded-full h-2 mb-3">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(countdown / 10) * 100}%` }}
                  ></div>
                </div>
                <button
                  onClick={cancelUpdate}
                  className="bg-red-500 text-black px-3 py-2 rounded-md text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ Modern Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-80 relative">
            <button
              onClick={closeAlert}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              {alertMessage.includes("Failed") ? "Error" : "Notice"}
            </h3>

            <p
              className={`text-center mb-6 ${
                alertMessage.includes("Failed")
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {alertMessage}
            </p>

            <div className="flex justify-center">
              <button
                onClick={closeAlert}
                className={`px-4 py-2 rounded-md text-sm font-semibold ${
                  alertMessage.includes("Failed")
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
