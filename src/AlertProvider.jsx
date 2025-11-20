import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  // -------------------------
  // ALERT STATE
  // -------------------------
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });

  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });

    setTimeout(() => {
      setAlert({ show: false, message: "", type: "info" });
    }, 3000);
  };

  // -------------------------
  // CONFIRM STATE
  // -------------------------
  const [confirmState, setConfirmState] = useState({
    open: false,
    message: "",
    resolve: null,
  });

  const confirm = (message) => {
    return new Promise((resolve) => {
      setConfirmState({
        open: true,
        message,
        resolve,
      });
    });
  };

  const handleYes = () => {
    confirmState.resolve(true);
    setConfirmState({ ...confirmState, open: false });
  };

  const handleNo = () => {
    confirmState.resolve(false);
    setConfirmState({ ...confirmState, open: false });
  };

  return (
    <AlertContext.Provider value={{ showAlert, confirm }}>
      {children}

      {/* ------------------ ALERT UI ------------------ */}
      {alert.show && (
        <div
          className="
            fixed top-6 left-1/2 z-50
            -translate-x-1/2
            px-4 py-3 rounded-lg shadow-lg
            text-white
            animate-slideIn
          "
          style={{
            backgroundColor:
              alert.type === "success"
                ? "#16a34a"
                : alert.type === "error"
                ? "#dc2626"
                : alert.type === "warning"
                ? "#ea580c"
                : "#3b82f6",
          }}
        >
          {alert.message}
        </div>
      )}

      {/* ------------------ CONFIRM UI ------------------ */}
      {confirmState.open && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-[400px] text-center animate-fadeIn scale-95">
                    <p className="text-gray-200 text-xl font-medium mb-6">
                        {confirmState.message}
                    </p>

                    <div className="flex justify-center gap-4">
                        <button
                        onClick={handleYes}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500
                                    text-white font-semibold shadow-md hover:scale-105 
                                    transition-all duration-200"
                        >
                        Yes
                        </button>

                        <button
                        onClick={handleNo}
                        className="px-5 py-2.5 rounded-xl bg-neutral-700 text-gray-200 
                                    hover:bg-neutral-600 hover:scale-105 transition-all duration-200"
                        >
                        No
                        </button>
                    </div>
                </div>
            </div>
        )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
