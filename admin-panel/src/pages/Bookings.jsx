import React, { useEffect, useState } from "react";
import "../styles/bookings.css";
import {
  useConfirmRequest,
  useDenyRequest,
  useGetRentHistory,
  useGetRentHistoryById,
} from "../helper/useRent";
import axios from "axios";
import useToken from "../axios/useToken";
import { Card } from "react-bootstrap";
import { Wrapper } from "../components/StyledComponents/StaffList";
import { SpinnerComponent } from "../components/reuseable/Spinner";
import "../styles/bookings.css";
import { useLocation } from "react-router-dom";

const Bookings = () => {
  const [token, setToken] = useToken();

  const { state } = useLocation();

  const { data: rentDetails, getRentDetailLoading } = useGetRentHistory();
  const { data: rentDetailById, getRentDetailByIdLoading } =
    useGetRentHistoryById(state?.id || null);
  const { mutate: confirmRequest, isLoading: confirmRequestLoading } =
    useConfirmRequest();
  const { mutate: denyRequest, isLoading: denyRequestLoading } =
    useDenyRequest();

  const [selectedRent, setSelectedRent] = useState([]);

  useEffect(() => {
    if (rentDetails && !state?.id) {
      setSelectedRent(rentDetails?.data?.history[0]);
    }
  }, [rentDetails]);

  useEffect(() => {
    if (rentDetailById && state?.id) {
      setSelectedRent(rentDetailById?.data?.history);
    }
  }, [rentDetailById, state?.id]);

  if (getRentDetailLoading) return <SpinnerComponent />;

  return (
    <div className="bookings">
      <div className="w-full flex justify-between align-middle">
        <h2 className="booking__title">Bookings</h2>
      </div>
      <Wrapper>
        <div className="grid-four-column">
          {rentDetails?.data?.history?.map((curElm, index) => {
            return (
              <Card
                key={index}
                className={`px-4 pt-2 rounded-md w-full hover:bg-slate-400 transition-colors ease-in-out duration-300 mb-4
                ${curElm?.id === selectedRent?.id && "bg-blue-950 "}`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedRent(curElm)}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  <div className="flex">
                    <div>
                      <img
                        src={curElm?.car?.image}
                        alt=""
                        className="w-12 h-12 rounded-full mr-4 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {curElm?.car?.name}
                      </h3>
                      <span className="text-white text-xs">
                        {curElm?.startDate} - {curElm?.endDate}
                      </span>
                    </div>
                  </div>
                  <i
                    class="ri-arrow-drop-right-line"
                    style={{ fontSize: 20 }}
                  />
                </div>
              </Card>
            );
          })}
        </div>

        <div className="main-screen h-fit">
          <Card className="w-full px-4 py-4 text-white">
            <div className="d-flex align-items-center ">
              <span style={{ fontSize: 18, fontWeight: "600" }}>
                Car Detail
              </span>

              <div className="flex">
                <img
                  src={selectedRent?.car?.image}
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
                  <span className="text-2xl">{selectedRent?.car?.name}</span>
                  <div>
                    <span className="text-sm">{selectedRent?.car?.brand}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 w-full">
              <span style={{ fontSize: 18, fontWeight: "600" }}>
                Customer Detail
              </span>
              <div className="">
                <div className="flex mt-2 justify-between">
                  <span>Username:</span>
                  <span className="font-bold">
                    {selectedRent?.customer?.username}
                  </span>
                </div>
                <div className="flex mt-2 justify-between">
                  <span>Full Name:</span>
                  <span className="font-bold">
                    {selectedRent?.customer?.name}
                  </span>
                </div>
                <div className="flex mt-2 justify-between">
                  <span>Phone Number:</span>
                  <span className="font-bold">
                    {selectedRent?.customer?.phoneNumber}
                  </span>
                </div>
                <div className="flex mt-2 justify-between">
                  <span>Email:</span>
                  <span className="font-bold">
                    {selectedRent?.customer?.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 w-full">
              <span style={{ fontSize: 18, fontWeight: "600" }}>
                Rent Detail
              </span>
              <div className="">
                <div className="flex mt-2 justify-between">
                  <span>Start Date:</span>
                  <span className="font-bold">{selectedRent?.startDate}</span>
                </div>
                <div className="flex mt-2 justify-between">
                  <span>End Date:</span>
                  <span className="font-bold">{selectedRent?.endDate}</span>
                </div>
                <div className="flex mt-2 justify-between">
                  <span>Total Charge:</span>
                  <span className="font-bold">{selectedRent?.totalCharge}</span>
                </div>
                <div className="flex mt-2 justify-between">
                  <span>Returned Date:</span>
                  <span className="font-bold">
                    {selectedRent?.returnDate || "N/A"}
                  </span>
                </div>
                <div className="flex mt-2 justify-between">
                  <span>Rent Status:</span>
                  <span className="font-bold">
                    {selectedRent?.requestStatus}
                  </span>
                </div>
                <div className="flex mt-2 justify-between">
                  <span>Approved By:</span>
                  <span className="font-bold">
                    {selectedRent?.authorizedBy?.name || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => window.open(selectedRent?.customer?.documentUrl)}
                className="bg-blue-500 py-2 px-4"
                style={{
                  border: "none",
                  borderRadius: 20,
                  color: "white",
                  fontWeight: "600",
                }}>
                View Document
              </button>
              {selectedRent?.requestStatus === "Pending" && (
                <>
                  <button
                    onClick={() =>
                      confirmRequest({
                        rentalId: selectedRent?.id,
                        userId: JSON.parse(token)?.user?.id,
                      })
                    }
                    className="bg-slate-500 py-2 px-4"
                    style={{
                      border: "none",
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "600",
                      marginLeft: 16,
                    }}>
                    {confirmRequestLoading ? "Loading..." : "Approve"}
                  </button>
                  <button
                    onClick={() =>
                      denyRequest({
                        rentalId: selectedRent?.id,
                        userId: JSON.parse(token)?.user?.id,
                      })
                    }
                    className="bg-red-800 py-2 px-4"
                    style={{
                      border: "none",
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "600",
                      marginLeft: 16,
                    }}>
                    {denyRequestLoading ? "Loading..." : "Reject"}
                  </button>
                </>
              )}
            </div>
          </Card>
        </div>
      </Wrapper>
    </div>
  );
};

export default Bookings;
