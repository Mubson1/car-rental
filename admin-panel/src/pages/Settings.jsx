import React, { useState } from "react";
import "../styles/settings.css";
import {
  useGetUserById,
  useUpdateMyPassword,
  useUploadDocument,
} from "../helper/useUser";
import useToken from "../axios/useToken";
import { SpinnerComponent } from "../components/reuseable/Spinner";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../components/reuseable/FormInput";
import "../styles/bookings.css";
import { useNavigate } from "react-router-dom";
import { FormRadio } from "../components/reuseable/FormRadio";

const validationSchema = Yup.object({
  newPw: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
      "Must contain at least 8 characters, one number and one special character"
    )
    .required("Required")
    .trim(),
  currentPw: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
      "Must contain at least 8 characters, one number and one special character"
    )
    .required("Required")
    .trim(),
});

const Settings = () => {
  const navigate = useNavigate();

  const [token, setToken] = useToken();

  const passwordDetail = {
    newPw: "",
    currentPw: "",
  };

  const [active, setActive] = useState("myDetails");
  const [file, setFile] = useState("");
  const [selectedType, setSelectedType] = useState("license");

  const { data: profileDetail, isLoading: profileDetailLoading } =
    useGetUserById(JSON.parse(token)?.user?.id);
  const { mutate: changeMyPassword, isLoading: changingMyPassword } =
    useUpdateMyPassword();
  const { mutate: uploadDocument, isLoading: uploadingDocument } =
    useUploadDocument();

  const handleRadioChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handlePasswordChange = (info) => {
    changeMyPassword({
      userId: JSON.parse(token)?.user?.id,
      currentPw: info?.currentPw,
      newPw: info?.newPw,
    });
  };

  const handleDocUpload = () => {
    const formData = new FormData();
    formData.append("UserId", JSON.parse(token)?.user?.id);
    formData.append("Document", file);
    formData.append("DocType", selectedType);
    uploadDocument(formData, {
      onSuccess: () => {
        setFile("");
        navigate("/settings");
      },
    });
  };

  if (profileDetailLoading) return <SpinnerComponent />;

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Settings</h2>

        <div className="settings__top">
          <button
            onClick={() => {
              setActive("myDetails");
            }}
            className={`setting__btn ${
              active === "myDetails" && "active__btn"
            }`}>
            My Details
          </button>
          <button
            onClick={() => setActive("editProfile")}
            className={`setting__btn ${
              active === "editProfile" && "active__btn"
            }`}>
            Edit Profile
          </button>
        </div>

        {active === "myDetails" && (
          <div className="details__form">
            <h2 className="profile__title">Profile</h2>
            <p className="profile__desc">
              This detail will be displayed in your profile
            </p>
            {/* <form> */}
            <div className="form__group">
              <div>
                <label>Full Name</label>
                <input
                  value={JSON.parse(token)?.user?.fullName}
                  type="text"
                  disabled
                />
              </div>

              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={profileDetail?.data?.userName}
                  disabled
                />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Email</label>
                <input
                  type="email"
                  disabled
                  value={profileDetail?.data?.email}
                />
              </div>

              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  disabled
                  value={JSON.parse(token)?.user?.phoneNumber}
                />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Address</label>
                <input
                  type="text"
                  disabled
                  value={JSON.parse(token)?.user?.address}
                />
              </div>

              <div>
                <label>Role</label>
                <input type="text" disabled value={profileDetail?.data?.role} />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Your Photo</label>
                <p className="profile-img__desc">
                  This will be your document to request for rent
                </p>
                {JSON.parse(token)?.user?.hasDocument ? (
                  <img
                    src={JSON.parse(token)?.user?.document}
                    alt=""
                    className="h-fit object-contain"
                  />
                ) : (
                  <label>N/A</label>
                )}
              </div>
            </div>
          </div>
        )}

        {active === "editProfile" && (
          <>
            <Formik
              initialValues={passwordDetail}
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
                const { currentPw, newPw } = values;
                return (
                  <div className="formContainer">
                    <label className="font-bold text-xl">Change Password</label>
                    <div className="mt-8">
                      <FormInput
                        value={currentPw}
                        error={touched.currentPw && errors.currentPw}
                        onBlur={handleBlur("currentPw")}
                        label="Current Password"
                        placeholder="Enter your current password"
                        onChange={handleChange("currentPw")}
                        type="password"
                        min={0}
                      />
                      <FormInput
                        value={newPw}
                        error={touched.newPw && errors.newPw}
                        onBlur={handleBlur("newPw")}
                        label="New Password"
                        placeholder="Enter a strong password"
                        onChange={handleChange("newPw")}
                        type="password"
                        min={0}
                      />
                    </div>
                    <button
                      onClick={handleSubmit}
                      type="submit"
                      className="bg-slate-500 py-2 px-4"
                      disabled={changingMyPassword}
                      style={{
                        border: "none",
                        borderRadius: 20,
                        color: "white",
                        fontWeight: "600",
                        marginTop: 24,
                      }}>
                      {changingMyPassword ? "Loading..." : "Confirm"}
                    </button>
                  </div>
                );
              }}
            </Formik>
            <div className="formContainer mt-8">
              <label
                htmlFor="file"
                className="font-bold text-xl cursor-pointer">
                Upload Document
                <span className="ri-chat-upload-line font-light text-lg ml-4" />
              </label>
              <input
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
                type="file"
                id="file"
                style={{
                  display: "none",
                  backgroundColor: "red",
                }}
              />
              {file && (
                <>
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-fit object-contain mx-4"
                  />
                  <div>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        color: "gray",
                        marginBottom: 8,
                      }}>
                      Select Document Type
                    </span>
                    <FormRadio
                      className="mb-4"
                      checked={selectedType === "license"}
                      name="radio"
                      value="license"
                      label="License"
                      onChange={(e) => handleRadioChange(e)}
                    />
                    <FormRadio
                      checked={selectedType === "citizenship"}
                      name="radio"
                      value="citizenship"
                      label="CitizenShip"
                      onChange={(e) => handleRadioChange(e)}
                    />
                  </div>
                  <button
                    onClick={handleDocUpload}
                    type="button"
                    className="bg-slate-500 py-2 px-4"
                    style={{
                      border: "none",
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "600",
                      marginTop: 24,
                    }}>
                    {uploadingDocument ? "Uploading..." : "Upload"}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
