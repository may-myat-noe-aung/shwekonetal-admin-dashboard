import React from "react";

export default function Footer() {
  return (
    <footer className="sticky bottom-0 w-full bg-neutral-900 border-t border-neutral-800 h-16 text-center text-neutral-400 text-sm flex items-center justify-center">
      <p>&copy; {new Date().getFullYear()} Gold Exchange Admin.</p>
    </footer>
  );
}
