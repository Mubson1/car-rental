import React, { useEffect, useState } from "react";
import "../styles/bookings.css";
import { useGetStaffDetails } from "../helper/useStaff";
import axios from "axios";
import useToken from "../axios/useToken";
import { Card } from "react-bootstrap";
import { Wrapper } from "../components/StyledComponents/StaffList";
import { SpinnerComponent } from "../components/reuseable/Spinner";
import "../styles/bookings.css";

const Staff = () => {
  const [token, setToken] = useToken();
  const { data: staffData, getStaffLoading } = useGetStaffDetails();

  const [selectedStaff, setSelectedStaff] = useState([]);

  useEffect(() => {
    if (staffData) {
      setSelectedStaff(staffData?.data?.users[0]);
    }
  }, [staffData]);

  if (getStaffLoading) return <SpinnerComponent />;

  return (
    <div className="bookings">
      <div className="w-full flex justify-between align-middle mb-4">
        <h2 className="booking__title">Staffs</h2>
        <button className="bg-blue-500 rounded-2xl px-4 h-12">
          Add New Staff
        </button>
      </div>
      <Wrapper>
        <div className="grid grid-four-column">
          {staffData?.data?.users?.map((curElm, index) => {
            return (
              <Card
                key={index}
                className={`px-4 pt-5 rounded-md w-full hover:bg-slate-400 transition-colors ease-in-out duration-300
                ${curElm?.id === selectedStaff?.id && "bg-blue-950 "}`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedStaff(curElm)}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {curElm?.fullName}
                    </h3>
                    <span className="text-white">{curElm?.role}</span>
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

        <div className="main-screen">
          <Card className="w-full px-4 py-4 text-white">
            <div className="d-flex align-items-center ">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  {selectedStaff?.fullName}
                </span>
                <span className="capitalize font-semibold">
                  {selectedStaff?.username}
                </span>
                <div className="mt-4">
                  <span style={{ fontWeight: "300" }}>
                    ID: {selectedStaff?.id}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8 w-full">
              <span style={{ fontSize: 18, fontWeight: "600" }}>Details</span>
              <div className="">
                <div className="flex mt-2 justify-between">
                  <span>Email:</span>
                  <span className="font-bold">{selectedStaff?.email}</span>
                </div>
                <div className="flex mt-2 justify-between">
                  <span>Phone Number:</span>
                  <span className="font-bold">
                    {selectedStaff?.phoneNumber}
                  </span>
                </div>
                <div className="flex mt-2 justify-between">
                  <span>Address:</span>
                  <span className="font-bold">{selectedStaff?.address}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                className="bg-slate-500 py-2 px-4"
                style={{
                  border: "none",
                  borderRadius: 20,
                  color: "white",
                  fontWeight: "600",
                }}>
                Edit
              </button>
              <button
                onClick={() => console.log("hello")}
                className="bg-red-800 py-2 px-4"
                style={{
                  border: "none",
                  borderRadius: 20,
                  color: "white",
                  fontWeight: "600",
                  marginLeft: 16,
                }}
                disabled={selectedStaff?.id === JSON.parse(token)?.user?.id}>
                Delete
              </button>
            </div>
          </Card>
        </div>
      </Wrapper>
    </div>
  );
};

export default Staff;
