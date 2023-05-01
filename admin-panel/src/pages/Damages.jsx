import React, { useEffect, useState } from "react";
import "../styles/bookings.css";
import { useGetDamageRequest, usePostDamagePayment } from "../helper/useDamage";
import axios from "axios";
import useToken from "../axios/useToken";
import { Card } from "react-bootstrap";
import { Wrapper } from "../components/StyledComponents/StaffList";
import { SpinnerComponent } from "../components/reuseable/Spinner";
import "../styles/bookings.css";
import "../styles/modal.css";
import { useNavigate } from "react-router-dom";

const Damages = () => {
  const navigate = useNavigate();

  const [token, setToken] = useToken();

  const [selectedRequest, setSelectedRequest] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(0);

  const { data: damageDetail, isLoading: getDamageDetailLoading } =
    useGetDamageRequest();
  const { mutate: applyPayment, isLoading: applyingPayment } =
    usePostDamagePayment();

  console.log(amount);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (damageDetail) {
      setSelectedRequest(damageDetail?.data?.damageRequests[0]);
    }
  }, [damageDetail]);

  if (getDamageDetailLoading) return <SpinnerComponent />;

  return (
    <div className="bookings">
      <div>
        <button onClick={toggleModal}>Open Modal</button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal text-white w-1/3">
              <div className="modal-header">
                <h2 className="text-2xl font-bold">Apply Damage Payment</h2>
                <button className="close-button" onClick={toggleModal}>
                  &times;
                </button>
              </div>
              <div className="modal-content">
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="Damage Repair Amount"
                  className="w-full bg-blue-950 h-14 px-3 py-1 text-lg mb-4 mt-5 rounded-lg"
                  min={0}></input>
                <button
                  onClick={() =>
                    applyPayment(
                      {
                        amount: parseFloat(amount),
                        damageRecordId: selectedRequest?.id,
                        checkedBy: JSON.parse(token)?.user?.id,
                      },
                      {
                        onSuccess: () => {
                          setShowModal(false);
                          setAmount(0);
                        },
                      }
                    )
                  }
                  disabled={applyingPayment}
                  className="bg-slate-500 py-2 px-4"
                  style={{
                    border: "none",
                    borderRadius: 20,
                    color: "white",
                    fontWeight: "600",
                  }}>
                  {applyingPayment ? "Loading..." : "Apply"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex justify-between align-middle">
        <h2 className="booking__title">Damage Requests</h2>
      </div>
      <Wrapper>
        <div className="grid grid-four-column">
          {damageDetail?.data?.damageRequests?.map((curElm, index) => {
            return (
              <Card
                key={index}
                className={`px-4 pt-3 rounded-md w-full hover:bg-slate-400 transition-colors ease-in-out duration-300
                ${curElm?.id === selectedRequest?.id && "bg-blue-950 "}`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedRequest(curElm)}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  <div className="flex">
                    <div>
                      <img
                        src={curElm?.rentalDetails?.car?.image}
                        alt=""
                        className="w-12 h-12 rounded-full mr-4 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {curElm?.rentalDetails?.car?.name}
                      </h3>
                      <span className="text-white text-xs">
                        Rented By: {curElm?.rentalDetails?.customer?.username}
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
              <div className="mt-4">
                <span style={{ fontSize: 18, fontWeight: "600" }}>
                  Damage Details
                </span>
                <div className="flex flex-col mt-4 mb-8">
                  <span style={{ fontWeight: "300" }}>
                    ID: {selectedRequest?.id}
                  </span>
                  <span>Description: {selectedRequest?.damageDescription}</span>
                </div>
                <button
                  onClick={() =>
                    navigate("/bookings", {
                      state: {
                        id: selectedRequest?.rentalDetails?.id,
                      },
                    })
                  }
                  className="bg-blue-500 py-2 px-4"
                  style={{
                    border: "none",
                    borderRadius: 20,
                    color: "white",
                    fontWeight: "600",
                  }}>
                  View Booking
                </button>
              </div>
            </div>
            <div className="mt-8 w-full">
              <div className="flex mt-2 justify-between">
                <span>Reported Date:</span>
                <span className="font-bold">{selectedRequest?.reportDate}</span>
              </div>
              <div className="flex mt-2 justify-between">
                <span>Request Status:</span>
                <span className="font-bold">
                  {selectedRequest?.requestStatus}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={toggleModal}
                className="bg-slate-500 py-2 px-4"
                style={{
                  border: "none",
                  borderRadius: 20,
                  color: "white",
                  fontWeight: "600",
                }}>
                Add Payment
              </button>
            </div>
          </Card>
        </div>
      </Wrapper>
    </div>
  );
};

export default Damages;
