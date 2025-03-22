// import React, { useEffect, useState } from "react";
// import {
//   PlusCircle,
//   Clipboard,
//   RefreshCw,
//   Check,
//   X,
//   Upload,
//   FileText,
//   Edit,
//   Save,
// } from "lucide-react";

// const AdminPanel = () => {
//   const [coupons, setCoupons] = useState([]);
//   const [claims, setClaims] = useState([]);
//   const [newCouponCode, setNewCouponCode] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [bulkCoupons, setBulkCoupons] = useState("");
//   const [showBulkUpload, setShowBulkUpload] = useState(false);
//   const [editingCoupon, setEditingCoupon] = useState(null);
//   const [editedCode, setEditedCode] = useState("");

//   useEffect(() => {
//     // Fetch all coupons and claims
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const couponsResponse = await fetch(
//           "https://round-robin-ebge.onrender.com/admin/coupons"
//         );
//         const claimsResponse = await fetch(
//           "https://round-robin-ebge.onrender.com/admin/claims"
//         );

//         if (couponsResponse.ok && claimsResponse.ok) {
//           const couponsData = await couponsResponse.json();
//           const claimsData = await claimsResponse.json();

//           setCoupons(couponsData);
//           setClaims(claimsData);
//         }
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleAddCoupon = async () => {
//     if (!newCouponCode.trim()) return;

//     try {
//       // Add a new coupon
//       const response = await fetch(
//         "https://round-robin-ebge.onrender.com/admin/coupons",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             code: newCouponCode,
//             status: true,
//           }),
//         }
//       );

//       if (response.ok) {
//         setNewCouponCode("");

//         // Refresh the coupon list
//         const couponsResponse = await fetch(
//           "https://round-robin-ebge.onrender.com/admin/coupons"
//         );
//         const couponsData = await couponsResponse.json();
//         setCoupons(couponsData);
//       }
//     } catch (error) {
//       console.error("Failed to add coupon:", error);
//     }
//   };

//   const toggleCouponStatus = async (id, status) => {
//     try {
//       // Toggle coupon status
//       const response = await fetch(
//         `https://round-robin-ebge.onrender.com/admin/coupons/${id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             status: !status,
//           }),
//         }
//       );

//       if (response.ok) {
//         // Refresh the coupon list
//         const couponsResponse = await fetch(
//           "https://round-robin-ebge.onrender.com/admin/coupons"
//         );
//         const couponsData = await couponsResponse.json();
//         setCoupons(couponsData);
//       }
//     } catch (error) {
//       console.error("Failed to update coupon status:", error);
//     }
//   };

//   const handleBulkUpload = async () => {
//     if (!bulkCoupons.trim()) return;

//     const couponCodes = bulkCoupons
//       .split("\n")
//       .map((code) => code.trim())
//       .filter((code) => code.length > 0);

//     if (couponCodes.length === 0) return;

//     setIsLoading(true);
//     try {
//       // Add multiple coupons
//       const response = await fetch(
//         "https://round-robin-ebge.onrender.com/admin/coupons/bulk",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             codes: couponCodes,
//           }),
//         }
//       );

//       if (response.ok) {
//         setBulkCoupons("");
//         setShowBulkUpload(false);

//         // Refresh the coupon list
//         const couponsResponse = await fetch(
//           "https://round-robin-ebge.onrender.com/admin/coupons"
//         );
//         const couponsData = await couponsResponse.json();
//         setCoupons(couponsData);
//       }
//     } catch (error) {
//       console.error("Failed to add bulk coupons:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const content = e.target.result;
//       setBulkCoupons(content);
//     };
//     reader.readAsText(file);
//   };

//   const startEditing = (coupon) => {
//     setEditingCoupon(coupon.id);
//     setEditedCode(coupon.code);
//   };

//   const cancelEditing = () => {
//     setEditingCoupon(null);
//     setEditedCode("");
//   };

//   const updateCouponCode = async (id) => {
//     if (
//       !editedCode.trim() ||
//       editedCode === coupons.find((c) => c.id === id).code
//     ) {
//       cancelEditing();
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://round-robin-ebge.onrender.com/admin/coupons/${id}/code`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             code: editedCode,
//           }),
//         }
//       );

//       if (response.ok) {
//         // Refresh the coupon list
//         const couponsResponse = await fetch(
//           "https://round-robin-ebge.onrender.com/admin/coupons"
//         );
//         const couponsData = await couponsResponse.json();
//         setCoupons(couponsData);
//         cancelEditing();
//       }
//     } catch (error) {
//       console.error("Failed to update coupon code:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         <header className="bg-white shadow-sm rounded-lg p-6 mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//             <Clipboard className="mr-3 text-indigo-600" />
//             Admin Dashboard
//           </h1>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Add New Coupon Card */}
//           <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                 Add New Coupon
//               </h2>
//               <div className="flex mb-4">
//                 <input
//                   type="text"
//                   placeholder="Enter coupon code"
//                   value={newCouponCode}
//                   onChange={(e) => setNewCouponCode(e.target.value)}
//                   className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 <button
//                   onClick={handleAddCoupon}
//                   className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   <PlusCircle className="h-5 w-5 mr-2" />
//                   Add
//                 </button>
//               </div>
//               <div className="mt-4">
//                 <button
//                   onClick={() => setShowBulkUpload(!showBulkUpload)}
//                   className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full justify-center"
//                 >
//                   <Upload className="h-5 w-5 mr-2" />
//                   {showBulkUpload ? "Hide Bulk Upload" : "Bulk Upload Coupons"}
//                 </button>
//               </div>

//               {showBulkUpload && (
//                 <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
//                   <h3 className="text-md font-medium text-gray-700 mb-2">
//                     Bulk Upload
//                   </h3>

//                   <div className="mb-3">
//                     <label
//                       htmlFor="file-upload"
//                       className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
//                     >
//                       <FileText className="h-5 w-5 mr-2" />
//                       Upload File
//                       <input
//                         id="file-upload"
//                         name="file-upload"
//                         type="file"
//                         accept=".txt,.csv"
//                         className="sr-only"
//                         onChange={handleFileUpload}
//                       />
//                     </label>
//                     <p className="mt-1 text-xs text-gray-500">
//                       Upload a .txt or .csv file with one coupon code per line
//                     </p>
//                   </div>

//                   <textarea
//                     placeholder="Or paste coupon codes here (one per line)"
//                     value={bulkCoupons}
//                     onChange={(e) => setBulkCoupons(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-32 text-sm"
//                   />

//                   <button
//                     onClick={handleBulkUpload}
//                     disabled={!bulkCoupons.trim()}
//                     className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
//                   >
//                     Upload Coupons
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Coupons List Card */}
//           <div className="bg-white overflow-hidden shadow-sm rounded-lg col-span-1 lg:col-span-2">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold text-gray-900">
//                   All Coupons
//                 </h2>
//                 <span className="text-sm font-medium text-gray-500">
//                   {coupons.length} coupons
//                 </span>
//               </div>

//               {isLoading ? (
//                 <div className="flex justify-center items-center py-10">
//                   <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
//                 </div>
//               ) : (
//                 <div className="overflow-hidden overflow-x-auto border border-gray-200 rounded-lg">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th
//                           scope="col"
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           Coupon Code
//                         </th>
//                         <th
//                           scope="col"
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           Status
//                         </th>
//                         <th
//                           scope="col"
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {coupons.length > 0 ? (
//                         coupons.map((coupon) => (
//                           <tr key={coupon.id} className="hover:bg-gray-50">
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                               {editingCoupon === coupon.id ? (
//                                 <input
//                                   type="text"
//                                   value={editedCode}
//                                   onChange={(e) =>
//                                     setEditedCode(e.target.value)
//                                   }
//                                   className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                   autoFocus
//                                 />
//                               ) : (
//                                 coupon.code
//                               )}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm">
//                               {coupon.status ? (
//                                 <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                                   Available
//                                 </span>
//                               ) : (
//                                 <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                                   Claimed
//                                 </span>
//                               )}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm">
//                               {editingCoupon === coupon.id ? (
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => updateCouponCode(coupon.id)}
//                                     className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
//                                   >
//                                     <Save className="h-4 w-4 mr-1" />
//                                     Save
//                                   </button>
//                                   <button
//                                     onClick={cancelEditing}
//                                     className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
//                                   >
//                                     <X className="h-4 w-4 mr-1" />
//                                     Cancel
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => startEditing(coupon)}
//                                     className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
//                                   >
//                                     <Edit className="h-4 w-4 mr-1" />
//                                     Edit
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       toggleCouponStatus(
//                                         coupon.id,
//                                         coupon.status
//                                       )
//                                     }
//                                     className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded ${
//                                       coupon.status
//                                         ? "text-red-700 bg-red-100 hover:bg-red-200"
//                                         : "text-green-700 bg-green-100 hover:bg-green-200"
//                                     }`}
//                                   >
//                                     {coupon.status ? (
//                                       <>
//                                         <X className="h-4 w-4 mr-1" />
//                                         Disable
//                                       </>
//                                     ) : (
//                                       <>
//                                         <Check className="h-4 w-4 mr-1" />
//                                         Enable
//                                       </>
//                                     )}
//                                   </button>
//                                 </div>
//                               )}
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan={3}
//                             className="px-6 py-10 text-center text-sm text-gray-500"
//                           >
//                             No coupons found. Add your first coupon above.
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Claims History Card */}
//           <div className="bg-white overflow-hidden shadow-sm rounded-lg col-span-1 lg:col-span-3">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold text-gray-900">
//                   Claim History
//                 </h2>
//                 <span className="text-sm font-medium text-gray-500">
//                   {claims.length} claims
//                 </span>
//               </div>

//               {isLoading ? (
//                 <div className="flex justify-center items-center py-10">
//                   <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
//                 </div>
//               ) : (
//                 <div className="overflow-hidden overflow-x-auto border border-gray-200 rounded-lg">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th
//                           scope="col"
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           Coupon Code
//                         </th>
//                         <th
//                           scope="col"
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           Claimed By
//                         </th>
//                         <th
//                           scope="col"
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           Claimed At
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {claims.length > 0 ? (
//                         claims.map((claim) => (
//                           <tr key={claim.id} className="hover:bg-gray-50">
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                               {claim.coupon.code}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {claim.userIp}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {new Date(claim.claimedAt).toLocaleString()}
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan={3}
//                             className="px-6 py-10 text-center text-sm text-gray-500"
//                           >
//                             No claims found yet. Claims will appear here once
//                             coupons are used.
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;
import React, { useEffect, useState } from "react";
import {
  PlusCircle,
  Clipboard,
  RefreshCw,
  Check,
  X,
  Edit,
  Save,
} from "lucide-react";

const AdminPanel = () => {
  const [coupons, setCoupons] = useState([]);
  const [claims, setClaims] = useState([]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editedCode, setEditedCode] = useState("");

  useEffect(() => {
    // Fetch all coupons and claims
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const couponsResponse = await fetch(
          "https://round-robin-ebge.onrender.com/admin/coupons"
        );
        const claimsResponse = await fetch(
          "https://round-robin-ebge.onrender.com/admin/claims"
        );

        if (couponsResponse.ok && claimsResponse.ok) {
          const couponsData = await couponsResponse.json();
          const claimsData = await claimsResponse.json();

          setCoupons(couponsData);
          setClaims(claimsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCoupon = async () => {
    if (!newCouponCode.trim()) return;

    try {
      // Add a new coupon
      const response = await fetch(
        "https://round-robin-ebge.onrender.com/admin/coupons",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: newCouponCode,
            status: true,
          }),
        }
      );

      if (response.ok) {
        setNewCouponCode("");

        // Refresh the coupon list
        const couponsResponse = await fetch(
          "https://round-robin-ebge.onrender.com/admin/coupons"
        );
        const couponsData = await couponsResponse.json();
        setCoupons(couponsData);
      }
    } catch (error) {
      console.error("Failed to add coupon:", error);
    }
  };

  const toggleCouponStatus = async (id, status) => {
    try {
      // Toggle coupon status
      const response = await fetch(
        `https://round-robin-ebge.onrender.com/admin/coupons/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: !status,
          }),
        }
      );

      if (response.ok) {
        // Refresh the coupon list
        const couponsResponse = await fetch(
          "https://round-robin-ebge.onrender.com/admin/coupons"
        );
        const couponsData = await couponsResponse.json();
        setCoupons(couponsData);
      }
    } catch (error) {
      console.error("Failed to update coupon status:", error);
    }
  };

  const startEditing = (coupon) => {
    setEditingCoupon(coupon.id);
    setEditedCode(coupon.code);
  };

  const cancelEditing = () => {
    setEditingCoupon(null);
    setEditedCode("");
  };

  const updateCouponCode = async (id) => {
    if (
      !editedCode.trim() ||
      editedCode === coupons.find((c) => c.id === id).code
    ) {
      cancelEditing();
      return;
    }

    try {
      const response = await fetch(
        `https://round-robin-ebge.onrender.com/admin/coupons/${id}/code`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: editedCode,
          }),
        }
      );

      if (response.ok) {
        // Refresh the coupon list
        const couponsResponse = await fetch(
          "https://round-robin-ebge.onrender.com/admin/coupons"
        );
        const couponsData = await couponsResponse.json();
        setCoupons(couponsData);
        cancelEditing();
      }
    } catch (error) {
      console.error("Failed to update coupon code:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <header className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Clipboard className="mr-3 text-indigo-600" />
            Admin Dashboard
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Coupon Card */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add New Coupon
              </h2>
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={handleAddCoupon}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Coupons List Card */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg col-span-1 lg:col-span-2">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  All Coupons
                </h2>
                <span className="text-sm font-medium text-gray-500">
                  {coupons.length} coupons
                </span>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="overflow-hidden overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Coupon Code
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {coupons.length > 0 ? (
                        coupons.map((coupon) => (
                          <tr key={coupon.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {editingCoupon === coupon.id ? (
                                <input
                                  type="text"
                                  value={editedCode}
                                  onChange={(e) =>
                                    setEditedCode(e.target.value)
                                  }
                                  className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  autoFocus
                                />
                              ) : (
                                coupon.code
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {coupon.status ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Available
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Claimed
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {editingCoupon === coupon.id ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => updateCouponCode(coupon.id)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                                  >
                                    <Save className="h-4 w-4 mr-1" />
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => startEditing(coupon)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      toggleCouponStatus(
                                        coupon.id,
                                        coupon.status
                                      )
                                    }
                                    className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded ${
                                      coupon.status
                                        ? "text-red-700 bg-red-100 hover:bg-red-200"
                                        : "text-green-700 bg-green-100 hover:bg-green-200"
                                    }`}
                                  >
                                    {coupon.status ? (
                                      <>
                                        <X className="h-4 w-4 mr-1" />
                                        Disable
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-4 w-4 mr-1" />
                                        Enable
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-10 text-center text-sm text-gray-500"
                          >
                            No coupons found. Add your first coupon above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Claims History Card */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg col-span-1 lg:col-span-3">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Claim History
                </h2>
                <span className="text-sm font-medium text-gray-500">
                  {claims.length} claims
                </span>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="overflow-hidden overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Coupon Code
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Claimed By
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Claimed At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {claims.length > 0 ? (
                        claims.map((claim) => (
                          <tr key={claim.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {claim.coupon.code}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {claim.userIp}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(claim.claimedAt).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-10 text-center text-sm text-gray-500"
                          >
                            No claims found yet. Claims will appear here once
                            coupons are used.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
