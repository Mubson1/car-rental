import React, { useEffect, useState } from "react";
import "../styles/bookings.css";
import { useGetStaffDetails } from "../helper/useStaff";
import axios from "axios";
import useToken from "../axios/useToken";
import { Card } from "react-bootstrap";
import { Wrapper } from "../components/StyledComponents/StaffList";
import { SpinnerComponent } from "../components/reuseable/Spinner";
import "../styles/bookings.css";
import {
  useDeleteUser,
  useGetAllUser,
  useUpdatePassword,
} from "../helper/useUser";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../components/reuseable/FormInput";

const validationSchema = Yup.object({
  password: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
      "Must contain at least 8 characters, one number and one special character"
    )
    .required("Required")
    .trim(),
});

const User = () => {
  const navigate = useNavigate();

  const [token, setToken] = useToken();
  const { data: userData, isLoading: getUserLoading } = useGetAllUser();
  const { mutate: deleteUser, isLoading: deletingUser } = useDeleteUser();
  const { mutate: changePassword, isLoading: changingPassword } =
    useUpdatePassword();

  const [selectedUser, setSelectedUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sortCategory, setSortCategory] = useState("");
  const [sortedList, setSortedList] = useState(userData?.data?.users);

  const value = { password: "" };

  const handleOptionChange = (event) => {
    setSortCategory(event.target.value);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handlePasswordChange = (info) => {
    changePassword(
      {
        userId: selectedUser?.id,
        newPassword: info?.password,
      },
      { onSuccess: () => setShowModal(false) }
    );
  };

  useEffect(() => {
    if (sortCategory === "user") {
      setSortedList(
        userData?.data?.users?.filter((user) => user.role === "Customer")
      );
    } else if (sortCategory === "staff") {
      setSortedList(
        userData?.data?.users?.filter((user) => user.role === "Staff")
      );
    } else if (sortCategory === "admin") {
      setSortedList(
        userData?.data?.users?.filter((user) => user.role === "Admin")
      );
    } else {
      setSortedList(userData?.data?.users);
    }
  }, [sortCategory, userData]);

  useEffect(() => {
    if (userData) {
      setSelectedUser(userData?.data?.users[0]);
    }
  }, [userData]);

  if (getUserLoading) return <SpinnerComponent />;

  return (
    <div className="bookings">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal text-white w-1/3">
            <div className="modal-header">
              <h2 className="text-2xl font-bold">Change User Password</h2>
              <button className="close-button" onClick={toggleModal}>
                &times;
              </button>
            </div>
            <div className="modal-content">
              <Formik
                initialValues={value}
                validationSchema={validationSchema}
                onSubmit={(values, formikActions) => {
                  handlePasswordChange(values);
                  formikActions.resetForm();
                  formikActions.setSubmitting(false);
                }}>
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => {
                  const { password } = values;
                  return (
                    <>
                      <FormInput
                        value={password}
                        error={touched.password && errors.password}
                        onBlur={handleBlur("password")}
                        label="Password"
                        placeholder="Enter a strong password"
                        onChange={handleChange("password")}
                        type="password"
                        min={0}
                      />
                      <button
                        onClick={handleSubmit}
                        type="submit"
                        className="bg-slate-500 py-2 px-4"
                        style={{
                          border: "none",
                          borderRadius: 20,
                          color: "white",
                          fontWeight: "600",
                          marginTop: 24,
                        }}>
                        Change Password
                      </button>
                    </>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      )}
      <div className="w-full flex justify-between align-middle">
        <h2 className="booking__title">Users</h2>
        <button
          className="bg-blue-500 rounded-2xl px-4 h-12"
          onClick={() => navigate("/users/new")}>
          Add New User
        </button>
      </div>
      <div className="filter__widget-wrapper">
        <div className="filter__widget-01">
          <select onChange={handleOptionChange} value={sortCategory}>
            <option>All</option>
            <option value="user">User</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <Wrapper>
        <div className="grid grid-four-column">
          {sortedList?.map((curElm, index) => {
            return (
              <Card
                key={index}
                className={`px-4 pt-5 rounded-md w-full hover:bg-slate-400 transition-colors ease-in-out duration-300
                ${curElm?.id === selectedUser?.id && "bg-blue-950 "}`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedUser(curElm)}>
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

        <div className="main-screen h-fit">
          <Card className="w-full px-4 py-4 text-white">
            <div className="d-flex align-items-center ">
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">
                      {selectedUser?.fullName}
                    </span>
                    <span className="capitalize font-semibold">
                      {selectedUser?.username}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/users/detail/${selectedUser?.id}`, {
                        state: { userData: selectedUser },
                      })
                    }
                    className="bg-amber-500 py-1 h-fit px-4"
                    style={{
                      border: "none",
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "600",
                    }}>
                    View Rental Transactions
                  </button>{" "}
                </div>
                <div className="mt-4">
                  <span style={{ fontWeight: "300" }}>
                    ID: {selectedUser?.id}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8 w-full">
              <span style={{ fontSize: 18, fontWeight: "600" }}>Details</span>
              <div className="">
                <div className="flex mt-2 justify-between">
                  <span>Email:</span>
                  <span className="font-bold">{selectedUser?.email}</span>
                </div>
                <div className="flex mt-2 justify-between">
                  <span>Phone Number:</span>
                  <span className="font-bold">{selectedUser?.phoneNumber}</span>
                </div>
                <div className="flex mt-2 justify-between">
                  <span>Address:</span>
                  <span className="font-bold">{selectedUser?.address}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() =>
                  navigate(`/users/edit/${selectedUser?.id}`, {
                    state: { detail: selectedUser },
                  })
                }
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
                onClick={() => setShowModal(true)}
                className="bg-emerald-500 py-2 px-4"
                style={{
                  border: "none",
                  borderRadius: 20,
                  color: "white",
                  fontWeight: "600",
                  marginLeft: 16,
                }}>
                Change Password
              </button>
              <button
                onClick={() => deleteUser(selectedUser?.id)}
                className="bg-red-800 py-2 px-4"
                style={{
                  border: "none",
                  borderRadius: 20,
                  color: "white",
                  fontWeight: "600",
                  marginLeft: 16,
                }}
                disabled={
                  selectedUser?.id === JSON.parse(token)?.user?.id ||
                  deletingUser
                }>
                {deletingUser ? "Loading..." : "Delete"}
              </button>
            </div>
          </Card>
        </div>
      </Wrapper>
    </div>
  );
};

export default User;
