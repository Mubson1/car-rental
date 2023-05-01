import React, { useEffect, useState } from "react";
import {
  useConfirmCarReturn,
  useConfirmRentPayment,
} from "../helper/usePayment";
import { useGetRentPayments } from "../helper/usePayment";
import { SpinnerComponent } from "../components/reuseable/Spinner";
import { Card } from "react-bootstrap";
import { Wrapper } from "../components/StyledComponents/StaffList";
import useToken from "../axios/useToken";
import "../styles/bookings.css";
import "../styles/modal.css";
import "../styles/settings.css";

const Payments = () => {
  const [token, setToken] = useToken();

  const [showRentPayModal, setShowRentPayModal] = useState(false);
  const [showCarReturnModal, setShowCarReturnModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState();
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [returnedDate, setReturnedDate] = useState();
  const [active, setActive] = useState("rentPayment");

  const { data: rentPayments, isLoading: rentPaymentsLoading } =
    useGetRentPayments({ paymentStatus: paymentStatus });
  const { mutate: confirmRentPayment, isLoading: confirmPaymentLoading } =
    useConfirmRentPayment();
  const { mutate: confirmCarReturn, isLoading: confirmReturnLoading } =
    useConfirmCarReturn();

  const handleOptionChange = (event) => {
    setPaymentStatus(event.target.value);
  };

  useEffect(() => {
    if (rentPayments) {
      setSelectedPayment(rentPayments?.data?.payments[0]);
    }
  }, [rentPayments]);

  if (rentPaymentsLoading) return <SpinnerComponent />;
  return (
    <div className="bookings">
      {showRentPayModal && (
        <div className="modal-overlay">
          <div className="modal text-white w-1/3">
            <div className="modal-header">
              <h2 className="text-2xl font-bold">
                Confirm Payment For Booking
              </h2>
              <button
                className="close-button"
                onClick={() => setShowRentPayModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-content">
              <span>
                Confirm this if the payment has been received. Car will be sent
                for rent.
              </span>
            </div>
            <button
              onClick={() =>
                confirmRentPayment(
                  {
                    paymentId: selectedPayment?.id,
                    userId: JSON.parse(token)?.user?.id,
                  },
                  {
                    onSuccess: () => setShowRentPayModal(false),
                  }
                )
              }
              className="bg-slate-500 py-2 px-4"
              disabled={confirmPaymentLoading}
              style={{
                border: "none",
                borderRadius: 20,
                color: "white",
                fontWeight: "600",
                marginTop: 16,
              }}>
              {confirmPaymentLoading ? "Loading..." : "Confirm"}
            </button>
          </div>
        </div>
      )}
      {showCarReturnModal && (
        <div className="modal-overlay">
          <div className="modal text-white w-1/3">
            <div className="modal-header">
              <h2 className="text-2xl font-bold">Confirm Return of Car</h2>
              <button
                className="close-button"
                onClick={() => setShowCarReturnModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-content">
              <span>
                Confirm this if the car has been returned. Car will be available
                for rent.
              </span>
              <div className="flex justify-between mt-4 items-center">
                <label>Return Date</label>
                <input
                  style={{
                    backgroundColor: "#181b3a",
                    borderColor: "white",
                    borderWidth: 0.5,
                  }}
                  value={returnedDate}
                  onChange={(e) => setReturnedDate(e.target.value)}
                  type="date"
                  placeholder="Select the date of return"
                  className="w-3/4 px-2 py-1 rounded-md"
                />
              </div>
            </div>
            <button
              onClick={() =>
                confirmCarReturn(
                  {
                    rentalId: selectedPayment?.rentalDetails?.id,
                    returnDate: returnedDate,
                  },
                  {
                    onSuccess: () => setShowRentPayModal(false),
                  }
                )
              }
              className="bg-slate-500 py-2 px-4"
              disabled={confirmReturnLoading}
              style={{
                border: "none",
                borderRadius: 20,
                color: "white",
                fontWeight: "600",
                marginTop: 16,
              }}>
              {confirmReturnLoading ? "Loading..." : "Confirm"}
            </button>
          </div>
        </div>
      )}
      <div className="w-full flex justify-between align-middle">
        <h2 className="booking__title">Payments</h2>
        <div className="settings__top">
          <button
            onClick={() => {
              setActive("rentPayment");
            }}
            className={`setting__btn ${
              active === "rentPayment" && "active__btn"
            }`}>
            Rental Payments
          </button>
          <button
            onClick={() => setActive("damagePayment")}
            className={`setting__btn ${
              active === "damagePayment" && "active__btn"
            }`}>
            Damage Payments
          </button>
        </div>
      </div>
      {active === "rentPayment" && (
        <div className="filter__widget-wrapper">
          <div className="filter__widget-01">
            <select onChange={handleOptionChange} value={paymentStatus}>
              <option></option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
      )}
      {active === "rentPayment" && (
        <Wrapper>
          <div className="grid-four-column">
            {rentPayments?.data?.payments?.map((curElm, index) => {
              return (
                <Card
                  key={index}
                  className={`px-4 pt-2 rounded-md w-full hover:bg-slate-400 transition-colors ease-in-out duration-300 mb-4
                ${curElm?.id === selectedPayment?.id && "bg-blue-950 "}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedPayment(curElm)}>
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
                          Rented By: {curElm?.rentalDetails?.customer?.name}
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
            {selectedPayment && (
              <Card className="w-full px-4 py-4 text-white">
                <div className="d-flex align-items-center ">
                  <div className="mt-4">
                    <span style={{ fontWeight: "300" }}>
                      ID: {selectedPayment?.id}
                    </span>
                  </div>
                </div>
                <div className="mt-8 w-full">
                  <span style={{ fontSize: 18, fontWeight: "600" }}>
                    Payment Details
                  </span>
                  <div className="flex mt-2 justify-between">
                    <span>Date:</span>
                    <span className="font-bold">{selectedPayment?.date}</span>
                  </div>
                  <div className="flex mt-2 justify-between">
                    <span>Amount:</span>
                    <span className="font-bold">{selectedPayment?.amount}</span>
                  </div>
                  <div className="flex mt-2 justify-between">
                    <span>Status:</span>
                    <span className="font-bold">
                      {selectedPayment?.paymentStatus}
                    </span>
                  </div>
                  <div className="flex mt-2 justify-between">
                    <span>Checked By:</span>
                    <span className="font-bold">
                      {selectedPayment?.checkedBy?.name || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="mt-8 w-full">
                  <span style={{ fontSize: 18, fontWeight: "600" }}>
                    Rental Details
                  </span>
                  <div className="flex mt-2 justify-between">
                    <span>Car Name:</span>
                    <span className="font-bold">
                      {selectedPayment?.rentalDetails?.car?.name}
                    </span>
                  </div>
                  <div className="flex mt-2 justify-between">
                    <span>Customer Name:</span>
                    <span className="font-bold">
                      {selectedPayment?.rentalDetails?.customer?.name}
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  {selectedPayment?.paymentStatus === "Paid" && (
                    <button
                      onClick={() => setShowCarReturnModal(true)}
                      className="bg-slate-500 py-2 px-4"
                      style={{
                        border: "none",
                        borderRadius: 20,
                        color: "white",
                        fontWeight: "600",
                      }}>
                      Confirm Return
                    </button>
                  )}
                  {selectedPayment?.paymentStatus === "Pending" && (
                    <button
                      onClick={() => setShowRentPayModal(true)}
                      className="bg-slate-500 py-2 px-4"
                      style={{
                        border: "none",
                        borderRadius: 20,
                        color: "white",
                        fontWeight: "600",
                      }}>
                      Confirm Payment
                    </button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </Wrapper>
      )}
    </div>
  );
};

export default Payments;
