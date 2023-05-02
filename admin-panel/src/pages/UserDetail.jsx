import React, { useEffect, useState } from "react";
import "../styles/bookings.css";
import { useLocation, useParams } from "react-router-dom";
import { useGetRentTransactions } from "../helper/useUser";
import { SpinnerComponent } from "../components/reuseable/Spinner";

const UserDetail = () => {
  const { state } = useLocation();

  const { userId } = useParams();

  const [startDate, setStartDate] = useState("2000-01-01");
  const [endDate, setEndDate] = useState("2999-12-30");

  const {
    mutate: getTransaction,
    data: transactions,
    isLoading: gettingTransactions,
  } = useGetRentTransactions();

  useEffect(() => {
    getTransaction({
      customerId: userId,
      startDate: startDate,
      endDate: endDate,
    });
  }, [startDate, endDate, userId]);

  if (gettingTransactions) return <SpinnerComponent />;

  return (
    <div className="bookings">
      <div className="w-full flex justify-between align-middle">
        <h2 className="booking__title">
          {state?.userData?.fullName || "User Detail"}
        </h2>
      </div>
      <div>
        <div className="flex justify-between mb-8 items-center">
          <label>From</label>
          <input
            style={{
              backgroundColor: "#181b3a",
              borderColor: "white",
              borderWidth: 0.5,
              color: "white",
            }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
            className="w-3/4 px-2 py-1 rounded-md"
          />
        </div>
        <div className="flex justify-between mb-8 items-center">
          <label>Till</label>
          <input
            style={{
              backgroundColor: "#181b3a",
              borderColor: "white",
              borderWidth: 0.5,
              color: "white",
            }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            type="date"
            className="w-3/4 px-2 py-1 rounded-md"
          />
        </div>
      </div>
      {transactions?.data?.rentalData?.length === 0 && (
        <div className="flex flex-col w-full text-center mt-28">
          <span className="text-white text-xl font-semibold">
            No Sales Data
          </span>
          <span className="text-white text-sm mt-2">
            Adjust Your Search Filter
          </span>
        </div>
      )}
      {transactions?.data?.rentalData?.map((sales) => (
        <div className="formContainer mx-8 text-white">
          <div className="flex mb-2">
            <img
              src={sales?.car?.image}
              style={{
                height: 120,
                width: 120,
                borderRadius: 100,
                objectFit: "contain",
                marginRight: 20,
              }}
              alt=""
            />
            <div className="mt-6">
              <span className="text-2xl">{sales?.car?.name}</span>
              <div>
                <span className="text-sm">{sales?.car?.brand}</span>
              </div>
            </div>
          </div>
          <span style={{ fontSize: 18, fontWeight: "600" }}>Sales Detail</span>
          <div className="flex justify-evenly mt-4">
            <div className="flex flex-col text-center">
              <span className="text-gray-500 font-bold mb-2">Rented From</span>
              <span className="text-lg">{sales?.startDate}</span>
            </div>
            <div className="flex flex-col  text-center">
              <span className="text-gray-500 font-bold mb-2">Rented Till</span>
              <span>{sales?.endDate}</span>
            </div>
            <div className="flex flex-col  text-center">
              <span className="text-gray-500 font-bold mb-2">Rental Cost</span>
              <span>Rs. {sales?.totalCharge}</span>
            </div>
            <div className="flex flex-col  text-center">
              <span className="text-gray-500 font-bold mb-2">
                Authorized By
              </span>
              <span>{sales?.authorizedBy?.name || "N/A"}</span>
            </div>
            <div className="flex flex-col  text-center">
              <span className="text-gray-500 font-bold mb-2">
                Request Status
              </span>
              <span>{sales?.requestStatus}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserDetail;
