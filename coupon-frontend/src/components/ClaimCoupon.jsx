import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
const ClaimCoupon = () => {
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const navigate = useNavigate();

  // Fetch available coupons on component mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://round-robin-ebge.onrender.com/coupons"
        );
        setCoupons(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load available coupons",
          confirmButtonColor: "#4f46e5",
        });
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Automatically fetch the user's IP address
  const fetchUserIp = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip; // Returns the user's IP address
    } catch (error) {
      console.error("Failed to fetch IP address:", error);
      return null;
    }
  };

  // Generate a random session ID
  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15); // Random alphanumeric string
  };

  const handleClaim = async () => {
    if (!selectedCoupon) {
      Swal.fire({
        icon: "warning",
        title: "Selection Required",
        text: "Please select a coupon first",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    try {
      setLoading(true);
      const userIp = await fetchUserIp(); // Get the user's IP address
      const userSession = generateSessionId(); // Generate a session ID

      const response = await axios.post(
        "https://round-robin-ebge.onrender.com/claim",
        {
          userIp,
          userSession,
          couponId: selectedCoupon.id,
        }
      );

      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
        confirmButtonColor: "#4f46e5",
        timer: 2000,
        timerProgressBar: true,
        didClose: () => {
          navigate("/");
        },
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Claim Failed",
        text: error.response?.data?.message || "Failed to claim coupon",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Claim Your Coupon
            </h1>
            <p className="text-md text-gray-600 mb-8">
              Select a coupon below and click the claim button to redeem it.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {coupons.length > 0 ? (
                <div className="grid gap-4 mb-8">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedCoupon?.id === coupon.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                      onClick={() => setSelectedCoupon(coupon)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {coupon.code}
                          </h3>
                          <p className="text-gray-600">{coupon.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-indigo-600 font-bold text-xl">
                            {coupon.discount}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No coupons available at the moment.
                </div>
              )}

              <button
                onClick={handleClaim}
                disabled={!selectedCoupon || loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  !selectedCoupon || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Processing..." : "Claim Coupon"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimCoupon;
