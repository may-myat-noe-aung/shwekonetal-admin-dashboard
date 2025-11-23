import React from "react";
import { Outlet } from "react-router-dom";
import Aside from "./Aside";
import Footer from "./Footer";
import Header from "./Header";
import RoleRedirect from "../RoleRedirect";   // ⭐ Import this

const Layout = () => {
  return (
    <main className="w-full relative ">
      <RoleRedirect />   {/* ⭐ Always running session checker */}

      <section className="flex">
        <Aside />
        <div className="w-full flex flex-col min-h-screen bg-neutral-950 text-neutral-100">
          <Header />
          <Outlet />
          <Footer />
        </div>
      </section>
    </main>
  );
};

export default Layout;
