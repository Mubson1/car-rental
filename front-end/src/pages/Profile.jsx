import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import useToken from "../helper/useToken";
import { useUpdateMyPassword } from "./AuthPages/api";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import FormInput from "../components/UI/FormInput";

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

const Profile = () => {
  const [token, setToken] = useToken();

  const passwordDetail = {
    newPw: "",
    currentPw: "",
  };

  const { mutate: changeMyPassword, isLoading: changingMyPassword } =
    useUpdateMyPassword();

  const handlePasswordChange = (info) => {
    changeMyPassword({
      userId: JSON.parse(token)?.user?.id,
      currentPw: info?.currentPw,
      newPw: info?.newPw,
    });
  };

  return (
    <Helmet title="Profile">
      <CommonSection title="My Profile" />
      <section style={{ paddingRight: 250, paddingLeft: 250 }}>
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
              <div>
                <label
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 24,
                  }}>
                  Change Password
                </label>
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
                  className="bg-primary py-2 px-4"
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
      </section>
    </Helmet>
  );
};

export default Profile;
