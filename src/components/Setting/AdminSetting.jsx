// import { useState } from "react";

// export default function AdminSetting() {
//   const [activeTab, setActiveTab] = useState("Overview");

//   const tabs = [
//     "Overview",
//     "Edit Account",
//     "Security",
//     "Notifications",
//     "Preferences",
//   ];

//   const [formData, setFormData] = useState({
//     firstName: "Hazel",
//     lastName: "Moon",
//     email: "hazel23@gmail.com",
//     mobile: "+9912432156",
//     dob: "1999-01-24",
//     position: "Admin",
//     gender: "Female",
//     address: "123-456\n178 House St., San Jose, New York",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const [notificationSettings, setNotificationSettings] = useState({
//     securityAlerts: true,
//     tradingAlerts: true,
//     systemUpdates: false,
//     weeklyReports: true,
//     pushNotifications: true,
//     smsSecurity: false,
//   });

//   const handleToggle = (key) => {
//     setNotificationSettings((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-start p-8">
//       <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
//         {/* Profile Card */}
//         <div className="bg-neutral-900 shadow-md rounded-lg p-6 w-full lg:w-1/5 text-center h-[250px]  border-yellow-500">
//           <img
//             src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//             alt="user"
//             className="w-32 h-32 rounded-full mx-auto"
//           />
//           <h2 className="mt-4 text-lg font-semibold">Su Su Moon</h2>
//           <p className="text-sm text-neutral-400">Admin</p>
//         </div>

//         {/* Info Card */}
//         <div className="flex-1 bg-neutral-900 shadow-md rounded-lg p-6  border-yellow-500">
//           {/* Tabs */}
//           <div className="border-b border-neutral-800 flex gap-6 mb-4">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`pb-2 ${
//                   activeTab === tab
//                     ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
//                     : "text-neutral-400 hover:text-yellow-500"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Overview Tab */}
//           {activeTab === "Overview" && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4">
//                 Personal Information
//               </h3>
//               <div className="grid grid-cols-2 gap-y-6 text-sm">
//                 <p>
//                   <span className="font-medium block text-neutral-400">
//                     First Name
//                   </span>{" "}
//                   {formData.firstName}
//                 </p>
//                 <p>
//                   <span className="font-medium block text-neutral-400">
//                     Last Name
//                   </span>{" "}
//                   {formData.lastName}
//                 </p>
//                 <p>
//                   <span className="font-medium block text-neutral-400">
//                     Email Address
//                   </span>{" "}
//                   {formData.email}
//                 </p>
//                 <p>
//                   <span className="font-medium block text-neutral-400">
//                     Mobile Number
//                   </span>{" "}
//                   {formData.mobile}
//                 </p>
//                 <p>
//                   <span className="font-medium block text-neutral-400">
//                     Date of Birth
//                   </span>{" "}
//                   {formData.dob || "—"}
//                 </p>
//                 <p>
//                   <span className="font-medium block text-neutral-400">
//                     Position
//                   </span>{" "}
//                   {formData.position}
//                 </p>
//                 <p>
//                   <span className="font-medium block text-neutral-400">
//                     Gender
//                   </span>{" "}
//                   {formData.gender}
//                 </p>
//                 <p className="col-span-2">
//                   <span className="font-medium block text-neutral-400">
//                     Residential Address
//                   </span>{" "}
//                   {formData.address}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Edit Account Tab */}
//           {activeTab === "Edit Account" && (
//             <form className="space-y-6">
//               <h3 className="text-lg font-semibold">Edit Account</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {[
//                   "firstName",
//                   "lastName",
//                   "email",
//                   "mobile",
//                   "dob",
//                   "position",
//                 ].map((field, i) => (
//                   <div key={i}>
//                     <label className="block text-sm font-medium mb-1 text-neutral-400">
//                       {field.charAt(0).toUpperCase() + field.slice(1)}
//                     </label>
//                     <input
//                       type={field === "dob" ? "date" : "text"}
//                       name={field}
//                       value={formData[field]}
//                       onChange={handleChange}
//                       className="w-full border border-neutral-700 rounded-md p-2 text-sm bg-neutral-950 text-neutral-100"
//                     />
//                   </div>
//                 ))}
//               </div>

//               {/* Gender */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-neutral-400">
//                   Gender
//                 </label>
//                 <div className="flex gap-6 text-sm">
//                   {["Male", "Female", "Other"].map((g) => (
//                     <label key={g} className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name="gender"
//                         value={g}
//                         checked={formData.gender === g}
//                         onChange={handleChange}
//                         className="accent-yellow-500"
//                       />
//                       {g}
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Address */}
//               <div>
//                 <label className="block text-sm font-medium mb-1 text-neutral-400">
//                   Residential Address
//                 </label>
//                 <textarea
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   className="w-full border border-neutral-700 rounded-md p-2 text-sm h-20 bg-neutral-950 text-neutral-100"
//                 />
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-end gap-4">
//                 <button
//                   type="button"
//                   className="px-4 py-2 rounded-md border border-neutral-700 text-neutral-400 hover:bg-neutral-800"
//                   onClick={() => setActiveTab("Overview")}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded-md bg-yellow-500 text-neutral-950 hover:bg-yellow-600"
//                 >
//                   Update
//                 </button>
//               </div>
//             </form>
//           )}
// {/* Security Tab */}
// {activeTab === "Security" && (
//   <div className="space-y-8 text-neutral-400  p-6 rounded-lg shadow-sm">
//     {/* Change Password */}
//     <div>
//       <h3 className="text-lg font-semibold mb-4 text-white">Change Password</h3>
//       <div className="flex flex-col gap-4 items-start justify-center mb-4">
//         <div className="w-[350px]">
//           <label className="block text-sm font-medium  mb-1 text-white">Current Password*</label>
//           <input
//             type="password"
//             placeholder="Enter current password"
//             className="w-full border border-neutral-700 bg-neutral-950 text-neutral-100 rounded-md p-2 text-sm focus:ring-2  focus:outline-none"
//           />
//         </div>
//         <div className="flex gap-4 mb-2 w-full">
//           <div className="w-[350px]">
//             <label className="block text-sm font-medium  mb-1 text-white">New Password*</label>
//             <input
//               type="password"
//               placeholder="Enter new password"
//               className="w-full border border-neutral-700 bg-neutral-950 text-neutral-100 rounded-md p-2 text-sm focus:ring-2  focus:outline-none"
//             />
//           </div>
//           <div className="w-[350px]">
//             <label className="block text-sm font-medium  mb-1 text-white">Confirm New Password*</label>
//             <input
//               type="password"
//               placeholder="Enter confirm password"
//               className="w-full border border-neutral-700 bg-neutral-950 text-neutral-100 rounded-md p-2 text-sm focus:ring-2  focus:outline-none"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Password Requirements */}
//       <ul className="mt-4 text-xs text-neutral-400 list-disc pl-5 space-y-1">
//         <li>Minimum 8 characters long - the more, the better</li>
//         <li>At least one lowercase character</li>
//         <li>At least one number, symbol, or whitespace character</li>
//       </ul>

//       {/* Buttons */}
//       <div className="flex justify-end gap-4 mt-6">
//         <button className="px-4 py-1 rounded-md border border-neutral-700 text-neutral-400 hover:bg-neutral-800">
//           Reset
//         </button>
//         <button className="px-4 py-1 rounded-md bg-yellow-600 text-white hover:bg-yellow-700">
//           Save Changes
//         </button>
//       </div>
//     </div>

//     {/* Login Activity */}
//     <div>
//       <h3 className="text-lg font-semibold mb-4 text-white">Login Activity</h3>
//       <p className="text-sm mb-4 text-neutral-400">
//         Recent login attempts and active sessions
//       </p>
//       <div className="space-y-4 text-sm">
//         {/* Current Session */}
//         <div className="flex items-center justify-between p-3 bg-neutral-950 border-neutral-700 rounded-md">
//           <div>
//             <p className="font-medium text-white">Current Session</p>
//             <p className="text-gray-500 ">Chrome on Windows</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <span className="text-gray-500">Yangon, blah blah</span>
//             <span className="px-3 py-1 text-xs rounded-md bg-green-500 text-white">
//               Active
//             </span>
//           </div>
//         </div>

//         {/* Mobile App */}
//         <div className="flex items-center justify-between p-3 bg-neutral-950 border-neutral-700 rounded-md">
//           <div>
//             <p className="font-medium text-white">Mobile App</p>
//             <p className="text-gray-500">iPhone · 2 hours ago</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <span className="text-gray-500">Yangon, blah blah</span>
//             <button className="px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600">
//               Delete
//             </button>
//           </div>
//         </div>

//         {/* Safari */}
//         <div className="flex items-center justify-between p-3 bg-neutral-950 border-neutral-700 rounded-md">
//           <div>
//             <p className="font-medium text-white">Safari on macOS</p>
//             <p className="text-gray-500">Yesterday at 3:24 PM</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <span className="text-gray-500">Yangon, blah blah</span>
//             <button className="px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600">
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 flex justify-center">
//         <button className="py-2 rounded-md bg-yellow-600 text-white w-[300px] hover:bg-yellow-700">
//           View All Activity
//         </button>
//       </div>
//     </div>
//   </div>
// )}


//           {/* Notifications Tab */}
//           {activeTab === "Notifications" && (
//             <div className="space-y-8">
//               <div>
//                 {[
//                   {
//                     key: "securityAlerts",
//                     label: "Security Alerts",
//                     desc: "Login attempts, password changes",
//                   },
//                   {
//                     key: "tradingAlerts",
//                     label: "Trading Alerts",
//                     desc: "Large transactions, price changes",
//                   },
//                   {
//                     key: "systemUpdates",
//                     label: "System Updates",
//                     desc: "Maintenance, new features",
//                   },
//                   {
//                     key: "weeklyReports",
//                     label: "Weekly Reports",
//                     desc: "Platform performance summaries",
//                   },
//                 ].map((item) => (
//                   <div
//                     key={item.key}
//                     className="flex items-center justify-between"
//                   >
//                     <div className="mb-6">
//                       <p className="font-medium text-neutral-100">
//                         {item.label}
//                       </p>
//                       <p className="text-sm text-neutral-400">{item.desc}</p>
//                     </div>
//                     <button
//                       onClick={() => handleToggle(item.key)}
//                       className={`w-12 h-6 rounded-full relative transition ${
//                         notificationSettings[item.key]
//                           ? "bg-yellow-500"
//                           : "bg-neutral-700"
//                       }`}
//                     >
//                       <span
//                         className={`absolute top-1 w-4 h-4 bg-neutral-950 rounded-full transition ${
//                           notificationSettings[item.key] ? "right-1" : "left-1"
//                         }`}
//                       />
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               <div>
//                 {[
//                   {
//                     key: "pushNotifications",
//                     label: "Push Notifications",
//                     desc: "Mobile app notifications",
//                   },
//                   {
//                     key: "smsSecurity",
//                     label: "SMS Security Alerts",
//                     desc: "Critical security notifications",
//                   },
//                 ].map((item) => (
//                   <div
//                     key={item.key}
//                     className="flex items-center justify-between"
//                   >
//                     <div>
//                       <p className="font-medium text-neutral-100">
//                         {item.label}
//                       </p>
//                       <p className="text-sm text-neutral-400">{item.desc}</p>
//                     </div>
//                     <button
//                       onClick={() => handleToggle(item.key)}
//                       className={`w-12 h-6 rounded-full relative transition ${
//                         notificationSettings[item.key]
//                           ? "bg-yellow-500"
//                           : "bg-neutral-700"
//                       }`}
//                     >
//                       <span
//                         className={`absolute top-1 w-4 h-4 bg-neutral-950 rounded-full transition ${
//                           notificationSettings[item.key] ? "right-1" : "left-1"
//                         }`}
//                       />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Preferences Tab */}
//           {activeTab === "Preferences" && (
//             <div className="space-y-8">
//               <div>
//                 <h3 className="text-lg font-semibold text-neutral-100 mb-4">
//                   Regional Settings
//                 </h3>
//                 <p className="text-sm text-neutral-400 mb-4">
//                   Configure your language, timezone, and regional preferences
//                 </p>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <label className="font-medium text-neutral-100">
//                       Language
//                     </label>
//                     <select className="border border-neutral-700 rounded-md p-2 text-sm bg-neutral-950 text-neutral-100">
//                       <option>English</option>
//                       <option>Myanmar</option>
//                       <option>Chinese</option>
//                       <option>Spanish</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-lg font-semibold text-neutral-100 mb-4">
//                   Appearance
//                 </h3>
//                 <p className="text-sm text-neutral-400 mb-4">
//                   Customize the look and feel of your dashboard
//                 </p>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <label className="font-medium text-neutral-100">
//                       Theme
//                     </label>
//                     <select className="border border-neutral-700 rounded-md p-2 text-sm bg-neutral-950 text-neutral-100">
//                       <option>Light</option>
//                       <option>Dark</option>
//                       <option>System</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { X, Bell, ShieldCheck, User, SunMoon, Download, Shield, Activity, Mail, MessageSquare, Clock, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [account, setAccount] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarahjohnson@gmail.com",
    mobile: "+959 123-456-789",
    dob: "03/15/1990",
    gender: "Female",
    address: "123-456, 17B House St, San Jose, New York",
    position: "Senior Administrator",
    language: "English",
    theme: "Dark",
    timezone: "Asia/Yangon",
    region: "Myanmar"
  });

  const [security, setSecurity] = useState({
    twoFA: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    securityAlerts: true,
    tradingAlerts: false,
    systemUpdates: true,
    weeklyReports: false,
    pushNotifications: false,
    smsSecurityAlerts: true,
    emailNotifications: true,
    promotionEmails: false
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggle2FA = () => {
    setSecurity((prev) => ({ ...prev, twoFA: !prev.twoFA }));
  };

  const handleSecurityChange = (field, value) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  };

  const tabList = [
    { key: "overview", label: "Overview", icon: <User className="h-4 w-4" /> },
    { key: "edit", label: "Edit Account", icon: <User className="h-4 w-4" /> },
    { key: "security", label: "Security", icon: <ShieldCheck className="h-4 w-4" /> },
    { key: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { key: "preferences", label: "Preferences", icon: <SunMoon className="h-4 w-4" /> },
  ];

  const quickActions = [
    { icon: <Download className="h-4 w-4" />, label: "Export Data" },
    { icon: <Shield className="h-4 w-4" />, label: "Security Check" },
    { icon: <Activity className="h-4 w-4" />, label: "Activity Log" }
  ];

  return (
    <div className="bg-neutral-950 text-neutral-100 p-6 h-[85.5vh] mx-auto max-w-7xl">
 

      {/* Horizontal Tabs */}
      <div className="bg-neutral-900 rounded-2xl  border border-neutral-800 p-4 mb-6">
        <div className="flex space-x-2">
          {tabList.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === item.key 
                  ? "bg-amber-400 text-black" 
                  : "text-neutral-300 hover:bg-amber-500/20 hover:text-amber-300"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-4 gap-6">
        {/* Left Column - Profile and Quick Actions */}
        <div className="col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
            <h3 className="font-bold text-lg mb-4 text-center text-amber-400">Profile</h3>
            <div className="flex flex-col items-center text-center">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFByb2ZpbGV8ZW58MHx8MH" 
                alt="Profile" 
                className="rounded-full w-20 h-20 object-cover mb-3 border-2 border-amber-400"
              />
              <p className="font-semibold text-lg">Sarah Johnson</p>
              <p className="text-sm text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full mt-1">Admin</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
            <h3 className="font-bold text-lg mb-4 text-amber-400">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-amber-500/20 hover:text-amber-300 transition-colors text-neutral-300 text-sm"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="col-span-3">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
            {/* Overview Tab Content */}
            {activeTab === "overview" && (
              <div>
                <h3 className="font-bold text-2xl mb-6 text-amber-400">Personal Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-neutral-400 block mb-2">First Name</label>
                      <div className="bg-neutral-800 rounded-lg p-2 border border-neutral-700">
                        <p className="font-medium text-sm">{account.firstName}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400 block mb-2">Last Name</label>
                      <div className="bg-neutral-800 rounded-lg p-2 border border-neutral-700">
                        <p className="font-medium text-sm">{account.lastName}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400 block mb-2">Email Address</label>
                      <div className="bg-neutral-800 rounded-lg p-2 border border-neutral-700">
                        <p className="font-medium text-sm">{account.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-neutral-400 block mb-2">Mobile Number</label>
                      <div className="bg-neutral-800 rounded-lg p-2 border border-neutral-700">
                        <p className="font-medium text-sm">{account.mobile}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400 block mb-2">Date of Birth</label>
                      <div className="bg-neutral-800 rounded-lg p-2 border border-neutral-700">
                        <p className="font-medium text-sm">{account.dob}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400 block mb-2">Gender</label>
                      <div className="bg-neutral-800 rounded-lg p-2 border border-neutral-700">
                        <p className="font-medium text-sm">{account.gender}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 space-y-4">
                    <div>
                      <label className="text-sm text-neutral-400 block mb-2">Residential Address</label>
                      <div className="bg-neutral-800 rounded-lg p-2 border border-neutral-700">
                        <p className="font-medium text-sm">{account.address}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400 block mb-2">Position</label>
                      <div className="bg-neutral-800 rounded-lg p-2 border border-neutral-700">
                        <p className="font-medium text-sm">{account.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Account Tab Content */}
            {activeTab === "edit" && (
              <div>
                <h3 className="font-bold text-2xl mb-6 text-amber-400">Edit Account</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-neutral-400">First Name</label>
                      <input 
                        type="text" 
                        value={account.firstName}
                        onChange={(e) => setAccount(prev => ({...prev, firstName: e.target.value}))}
                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-neutral-400">Last Name</label>
                      <input 
                        type="text" 
                        value={account.lastName}
                        onChange={(e) => setAccount(prev => ({...prev, lastName: e.target.value}))}
                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-neutral-400">Email Address</label>
                      <input 
                        type="email" 
                        value={account.email}
                        onChange={(e) => setAccount(prev => ({...prev, email: e.target.value}))}
                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-neutral-400">Mobile Number</label>
                      <input 
                        type="text" 
                        value={account.mobile}
                        onChange={(e) => setAccount(prev => ({...prev, mobile: e.target.value}))}
                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-neutral-400">Date of Birth</label>
                      <input 
                        type="text" 
                        value={account.dob}
                        onChange={(e) => setAccount(prev => ({...prev, dob: e.target.value}))}
                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-neutral-400">Gender</label>
                      <div className="flex gap-4">
                        {["Female", "Male", "Other"].map(gender => (
                          <label key={gender} className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name="gender" 
                              checked={account.gender === gender}
                              onChange={() => setAccount(prev => ({...prev, gender}))}
                              className="text-amber-400 focus:ring-amber-400"
                            />
                            <span className="text-neutral-300 text-sm">{gender}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-neutral-400">Residential Address</label>
                      <input 
                        type="text" 
                        value={account.address}
                        onChange={(e) => setAccount(prev => ({...prev, address: e.target.value}))}
                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-neutral-400">Position</label>
                      <input 
                        type="text" 
                        value={account.position}
                        onChange={(e) => setAccount(prev => ({...prev, position: e.target.value}))}
                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button className="rounded-lg bg-amber-400 text-black px-5 py-2 hover:bg-amber-500 transition-colors font-medium text-sm">
                        Save Changes
                      </button>
                      <button className="rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 px-5 py-2 hover:bg-neutral-700 transition-colors text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab Content */}
            {activeTab === "security" && (
              <div>
                <h3 className="font-bold text-2xl mb-6 text-amber-400">Security Settings</h3>
                
                {/* Two-Step Verification Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Two-Step Verification</h4>
                    <button
                      onClick={toggle2FA}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        security.twoFA
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-700 text-neutral-400"
                      }`}
                    >
                      {security.twoFA ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                  <p className="text-neutral-400 text-sm mb-4">
                    Add an extra layer of security to your account by enabling two-step verification.
                  </p>
                  <button className="rounded-lg border border-amber-400 text-amber-400 px-4 py-2 hover:bg-amber-400/10 transition-colors text-sm">
                    Configure Two-Step Verification
                  </button>
                </div>

                {/* Change Password Section */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Change Password</h4>
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-neutral-400">Current Password</label>
                      <input 
                        type="password" 
                        value={security.currentPassword}
                        onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-neutral-400">New Password</label>
                      <input 
                        type="password" 
                        value={security.newPassword}
                        onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-neutral-400">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={security.confirmPassword}
                        onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button className="rounded-lg bg-amber-400 text-black px-5 py-2 hover:bg-amber-500 transition-colors font-medium text-sm">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab Content */}
            {activeTab === "notifications" && (
              <div>
                <h3 className="font-bold text-2xl mb-6 text-amber-400">Notification Settings</h3>
                
                <div className="grid grid-cols-2 gap-8">
                  {/* Email Notifications */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Notifications
                    </h4>
                    <div className="space-y-4">
                      {[
                        { key: "securityAlerts", label: "Security Alerts", desc: "Important security notifications" },
                        { key: "tradingAlerts", label: "Trading Alerts", desc: "Trading activity and updates" },
                        { key: "systemUpdates", label: "System Updates", desc: "Platform maintenance and updates" },
                        { key: "weeklyReports", label: "Weekly Reports", desc: "Weekly summary reports" },
                        { key: "promotionEmails", label: "Promotion Emails", desc: "Special offers and promotions" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                          <div>
                            <span className="block font-medium text-sm">{item.label}</span>
                            <span className="text-xs text-neutral-400">{item.desc}</span>
                          </div>
                          <button
                            onClick={() => toggleNotification(item.key)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              notifications[item.key] ? "bg-emerald-500" : "bg-neutral-600"
                            }`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              notifications[item.key] ? "transform translate-x-7" : "transform translate-x-1"
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile & SMS Notifications */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Mobile & SMS Notifications
                    </h4>
                    <div className="space-y-4">
                      {[
                        { key: "pushNotifications", label: "Push Notifications", desc: "App push notifications" },
                        { key: "smsSecurityAlerts", label: "SMS Security Alerts", desc: "Critical security alerts via SMS" },
                        { key: "emailNotifications", label: "Email Notifications", desc: "General email notifications" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                          <div>
                            <span className="block font-medium text-sm">{item.label}</span>
                            <span className="text-xs text-neutral-400">{item.desc}</span>
                          </div>
                          <button
                            onClick={() => toggleNotification(item.key)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              notifications[item.key] ? "bg-emerald-500" : "bg-neutral-600"
                            }`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              notifications[item.key] ? "transform translate-x-7" : "transform translate-x-1"
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab Content */}
            {activeTab === "preferences" && (
              <div>
                <h3 className="font-bold text-2xl mb-6 text-amber-400">Preferences</h3>
                
                <div className="grid grid-cols-2 gap-8">
                  {/* Language & Region */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Language & Region
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2 text-neutral-400">Language</label>
                        <select 
                          value={account.language}
                          onChange={(e) => setAccount(prev => ({...prev, language: e.target.value}))}
                          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                        >
                          <option>English</option>
                          <option>Myanmar</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-neutral-400">Timezone</label>
                        <select 
                          value={account.timezone}
                          onChange={(e) => setAccount(prev => ({...prev, timezone: e.target.value}))}
                          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                        >
                          <option>Asia/Yangon (UTC+6:30)</option>
                          <option>Asia/Bangkok (UTC+7:00)</option>
                          <option>Asia/Singapore (UTC+8:00)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-neutral-400">Region</label>
                        <select 
                          value={account.region}
                          onChange={(e) => setAccount(prev => ({...prev, region: e.target.value}))}
                          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                        >
                          <option>Myanmar</option>
                          <option>International</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Appearance */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <SunMoon className="h-5 w-5" />
                      Appearance
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2 text-neutral-400">Theme</label>
                        <select 
                          value={account.theme}
                          onChange={(e) => setAccount(prev => ({...prev, theme: e.target.value}))}
                          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                        >
                          <option>Dark</option>
                          <option>Light</option>
                          <option>Auto</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-neutral-400">Font Size</label>
                        <select className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
                          <option>Medium</option>
                          <option>Small</option>
                          <option>Large</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-neutral-400">Date Format</label>
                        <select className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
                          <option>DD/MM/YYYY</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}