
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-6">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-10 w-full max-w-md shadow-xl text-center">
        <h1 className="text-6xl font-bold text-yellow-400 mb-3">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-neutral-400 text-sm mb-8">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white rounded-lg px-4 py-2 text-sm transition"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>

          <button
            onClick={() => navigate('/')} 
            className="bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-medium px-4 py-2 rounded-lg transition text-sm"
          >
            Go Home
          </button>
        </div>

        <p className="text-xs text-neutral-500 mt-8">
          {/* If you believe this is an error, please contact support. */}
        </p>
      </div>
    </div>
  );
}

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ArrowLeft, TriangleAlert } from "lucide-react";

// export default function NotFoundPage() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-6">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-neutral-900 border border-neutral-700 rounded-2xl p-10 w-full max-w-md shadow-xl text-center relative overflow-hidden"
//       >
//         <motion.div
//           animate={{ y: [0, -8, 0] }}
//           transition={{ repeat: Infinity, duration: 2 }}
//           className="flex justify-center mb-4"
//         >
//           <TriangleAlert className="h-10 w-10 text-yellow-400" />
//         </motion.div>

//         <motion.h1
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="text-6xl font-bold text-yellow-400 mb-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]"
//         >
//           404
//         </motion.h1>

//         <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
//         <p className="text-neutral-400 text-sm mb-8">
//           The page you’re looking for doesn’t exist or may have been moved.
//         </p>

//         <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center justify-center gap-2 bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white rounded-lg px-4 py-2 text-sm transition"
//           >
//             <ArrowLeft className="h-4 w-4" /> Go Back
//           </button>

//           <button
//             onClick={() => navigate('/')} 
//             className="bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-medium px-4 py-2 rounded-lg transition text-sm"
//           >
//             Go Home
//           </button>
//         </div>

//         <p className="text-xs text-neutral-500 mt-8">
//           If you believe this is an error, please contact support.
//         </p>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: [0.2, 0.6, 0.2] }}
//           transition={{ repeat: Infinity, duration: 3 }}
//           className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent pointer-events-none rounded-2xl"
//         />
//       </motion.div>
//     </div>
//   );
// }