import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/bookings.css";
import FormInput from "../components/reuseable/FormInput";
import { FormRadio } from "../components/reuseable/FormRadio";
import { useAddUser, useUpdateUser } from "../helper/useUser";

const validationSchema = Yup.object({
  fullName: Yup.string().trim().required("Required"),
  username: Yup.string().trim().required("Required"),
  email: Yup.string().email("Invalid email!").required("Required"),
  password: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
      "Must contain at least 8 characters, one number and one special character"
    )
    .required("Required")
    .trim(),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be a number")
    .required("Required")
    .length(10, "Must be exactly 10 digits"),
  address: Yup.string().required("Missing Field").trim(),
  // role: Yup.string().required("Missing Field"),
});

const UserForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;

  const path = location.pathname.split("/");
  const isEditMode = path.includes("edit");

  // const { userId } = useParams();

  const [selectedUser, setSelectedUser] = useState("Staff");

  const { mutate: addUser, isLoading: addingUser } = useAddUser();
  const { mutate: editUser, isLoading: editingUser } = useUpdateUser();

  const userDetail = {
    fullName: state?.detail?.fullName || "",
    username: state?.detail?.username || "",
    email: state?.detail?.email || "",
    password: "",
    phoneNumber: state?.detail?.phoneNumber || "",
    // role: state?.detail?.role || "",
    address: state?.detail?.address || "",
  };

  const handleRadioChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleClick = (info) => {
    if (isEditMode) {
      editUser(
        {
          id: state?.detail?.id,
          fullName: info?.fullName,
          username: info?.username,
          email: info?.email,
          phoneNumber: info?.phoneNumber.toString(),
          role: selectedUser,
          address: info?.address,
        },
        {
          onSuccess: () => {
            navigate("/users");
          },
        }
      );
    } else {
      addUser(
        {
          fullName: info?.fullName,
          username: info?.username,
          email: info?.email,
          password: info?.password,
          phoneNumber: info?.phoneNumber.toString(),
          role: selectedUser,
          address: info?.address,
        },
        {
          onSuccess: () => {
            navigate("/users");
          },
        }
      );
    }
  };

  return (
    <div className="bookings">
      <div className="w-full flex justify-between align-middle">
        <h2 className="booking__title">
          {isEditMode ? `Edit` : "Add New User"}
        </h2>
      </div>
      <Formik
        initialValues={userDetail}
        validationSchema={validationSchema}
        onSubmit={(values, formikActions) => {
          handleClick(values);
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
          const { address, email, fullName, password, phoneNumber, username } =
            values;
          return (
            <>
              <div className="formContainer">
                <FormInput
                  value={fullName}
                  error={touched.fullName && errors.fullName}
                  onBlur={handleBlur("fullName")}
                  label="Full Name"
                  placeholder="Enter the full name of the user"
                  onChange={handleChange("fullName")}
                />
                <FormInput
                  value={username}
                  error={touched.username && errors.username}
                  onBlur={handleBlur("username")}
                  label="Username"
                  placeholder="Enter the username of the user"
                  onChange={handleChange("username")}
                />
                <FormInput
                  value={email}
                  error={touched.email && errors.email}
                  onBlur={handleBlur("email")}
                  label="Email Address"
                  placeholder="Enter the email of the user"
                  onChange={handleChange("email")}
                />
                <FormInput
                  value={phoneNumber}
                  error={touched.phoneNumber && errors.phoneNumber}
                  onBlur={handleBlur("phoneNumber")}
                  label="Phone Number"
                  placeholder="Enter the phone number of the user"
                  onChange={handleChange("phoneNumber")}
                  type="number"
                  min={0}
                />
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
                <FormInput
                  value={address}
                  error={touched.address && errors.address}
                  onBlur={handleBlur("address")}
                  label="Address"
                  placeholder="Enter the address of the user"
                  onChange={handleChange("address")}
                  min={0}
                />
                <div>
                  <FormRadio
                    className="mb-4"
                    checked={selectedUser === "Staff"}
                    name="radio"
                    value="Staff"
                    label="Staff"
                    onChange={(e) => handleRadioChange(e)}
                  />
                  <FormRadio
                    checked={selectedUser === "Admin"}
                    name="radio"
                    value="Admin"
                    label="Admin"
                    onChange={(e) => handleRadioChange(e)}
                  />
                </div>
              </div>
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
                {isEditMode ? "Save User" : "Add User"}
              </button>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default UserForm;
