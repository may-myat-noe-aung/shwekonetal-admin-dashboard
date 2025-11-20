

import React, { useEffect, useState } from "react";
import ChangePasscodeForm from "./ChangePasscodeForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function SecurityTab() {
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("adminEmail");
    if (email) setAdminEmail(email);
  }, []);

  return (
    <div className="">
      <h3 className="font-bold text-xl mb-6 text-amber-400 text-center md:text-left">
        Security Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <ChangePasscodeForm email={adminEmail} />
        <ChangePasswordForm email={adminEmail} />
      </div>
    </div>
  );
}
