import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredCoupons, setFeaturedCoupons] = useState([]);

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

  // Process coupons to get featured ones whenever coupons state changes
  useEffect(() => {
    if (coupons.length > 0) {
      const availableCoupons = coupons.filter((coupon) => coupon.status);

      // Sort by discount value (highest first)
      const sorted = [...availableCoupons].sort((a, b) => {
        // Check if discount property exists and contains a percentage
        const discountA =
          a.discount && typeof a.discount === "string"
            ? parseInt(a.discount.replace("%", ""))
            : 0;
        const discountB =
          b.discount && typeof b.discount === "string"
            ? parseInt(b.discount.replace("%", ""))
            : 0;
        return discountB - discountA;
      });

      // Get top 3 coupons
      setFeaturedCoupons(sorted.slice(0, 3));
    }
  }, [coupons]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Admin Login Button - Added at the top right */}
        <div className="flex justify-end mb-4">
          <Link to="http://localhost:5173/admin/login">
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              Login as Admin
            </button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="p-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Exclusive <span className="text-indigo-600">Discounts</span>
              <br />
              Just For You
            </h1>

            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Unlock amazing savings with our premium coupon collection. We have{" "}
              {loading ? "..." : coupons.filter((c) => c.status).length}{" "}
              {coupons.filter((c) => c.status).length === 1
                ? "coupon"
                : "coupons"}{" "}
              available right now.
            </p>

            <div className="mt-8">
              <Link to="/claim" className="inline-block">
                <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  Claim Your Coupon
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Coupons Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Featured Deals
        </h2>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : featuredCoupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCoupons.map((coupon, index) => (
              <div
                key={coupon.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden relative h-full transform transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="absolute top-4 right-4">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {index === 0
                      ? "BEST DEAL"
                      : index === 1
                      ? "POPULAR"
                      : "FEATURED"}
                  </span>
                </div>

                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 mt-7 text-center">
                    {coupon.code}
                  </h3>

                  <div className="border-t border-b border-gray-100 py-4 my-4">
                    <p className="text-gray-600 text-center">
                      {coupon.description || "Special offer"}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <Link to="/claim" className="block">
                      <button className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-md hover:opacity-90 transition-opacity">
                        Get This Deal
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Coupons Available
            </h3>
            <p className="text-gray-600">
              Check back soon for new discount offers!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponList;
