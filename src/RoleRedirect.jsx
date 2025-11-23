import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RoleRedirect() {
  const role = localStorage.getItem("adminRole");
  const id = localStorage.getItem("adminId");

  const [valid, setValid] = useState(true);

  useEffect(() => {
    if (!id) {
      setValid(false);
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://38.60.244.74:3000/admin/${id}`);
        const json = await res.json();

        // ❌ data empty → logout immediately
        if (!json.success || !json.data || json.data.length === 0) {
          localStorage.clear();
          setValid(false);
        }
      } catch (error) {
        console.error(error)
      }
    }, 500); // ← 500ms တစ်ခါစစ်မယ်

    // interval cleanup
    return () => clearInterval(interval);
  }, [id]);

  if (!valid) return <Navigate to="/login" replace />;

  if (!role) return <Navigate to="/login" replace />;

  // ✅ roles
  if (role === "owner") return <Navigate to="/dashboard" replace />;
  if (role === "manager") return <Navigate to="/sale" replace />;
  if (role === "seller") return <Navigate to="/sale" replace />;

  return <Navigate to="/404" replace />;
}
