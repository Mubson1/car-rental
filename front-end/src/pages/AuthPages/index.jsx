import React, { useState } from "react";
import * as Components from "./Component";
import { usePostLoginCustomer, usePostRegisterCustomer } from "./api";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate, useNavigation } from "react-router-dom";
import useToken from "../../helper/useToken";

const validationSchema = Yup.object({
  fullName: Yup.string().trim().required("Required"),
  username: Yup.string().trim().required("Required"),
  email: Yup.string().email("Invalid email!").required("Required"),
  password: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
      "Must contain at least 8 characters, one number and one special character"
    )
    .required("Required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be a number")
    .required("Required")
    .length(10, "Must be exactly 10 digits"),
  address: Yup.string().required("Required"),
});

const Login = () => {
  const navigate = useNavigate();

  const [, setToken] = useToken();

  const [signIn, toggle] = useState(true);

  // const info = {
  //   fullName: "",
  //   username: "",
  //   email: "",
  //   password: "",
  //   phoneNumber: "",
  //   address: "",
  // };

  const [values, setValues] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const [loginCred, setLoginCred] = useState({
    username: "",
    password: "",
  });

  const { mutate: login, isLoading: loginLoading } = usePostLoginCustomer();
  const { mutate: register, isLoading: registerLoading } =
    usePostRegisterCustomer();

  const handleOnChange = (text, input) => {
    setValues((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleOnCredChange = (text, input) => {
    setLoginCred((prevState) => ({ ...prevState, [input]: text }));
  };

  const onSignUpClicked = () => {
    const formData = new FormData();
    formData.append("FullName", values.fullName);
    formData.append("Username", values.username);
    formData.append("Email", values.email);
    formData.append("Password", values.password);
    formData.append("PhoneNumber", values.phoneNumber);
    formData.append("Address", values.address);
    console.log(formData);
    register(formData, {
      onSuccess: () => {
        navigate("/home", { showModal: true });
      },
    });
  };

  const onSignInClicked = () => {
    login(loginCred, {
      onSuccess: () => {
        navigate("/home");
      },
    });
  };

  return (
    <>
      <Components.SignUpContainer signIn={signIn}>
        <Components.FormContainer>
          <Components.Title>Create Account</Components.Title>
          <Components.Input
            value={values.fullName}
            onChange={(e) => handleOnChange(e.target.value, "fullName")}
            type="text"
            placeholder="Name"
          />
          <Components.Input
            value={values.username}
            onChange={(e) => handleOnChange(e.target.value, "username")}
            type="text"
            placeholder="Username"
          />
          <Components.Input
            value={values.email}
            onChange={(e) => handleOnChange(e.target.value, "email")}
            type="email"
            placeholder="Email"
          />
          <Components.Input
            value={values.phoneNumber}
            onChange={(e) => handleOnChange(e.target.value, "phoneNumber")}
            type="number"
            placeholder="PhoneNumber"
          />
          <Components.Input
            value={values.address}
            onChange={(e) => handleOnChange(e.target.value, "address")}
            type="text"
            placeholder="Address"
          />
          <Components.Input
            value={values.password}
            onChange={(e) => handleOnChange(e.target.value, "password")}
            type="password"
            placeholder="Password"
          />
          <Components.Button onClick={onSignUpClicked} type="button">
            Sign Up
          </Components.Button>
          <Components.Anchor href="/home">Continue as Guest</Components.Anchor>
        </Components.FormContainer>
      </Components.SignUpContainer>

      <Components.SignInContainer signIn={signIn}>
        <Components.FormContainer>
          <Components.Title>Sign in</Components.Title>
          <Components.Input
            value={loginCred.username}
            onChange={(e) => handleOnCredChange(e.target.value, "username")}
            type="text"
            placeholder="Username"
          />
          <Components.Input
            value={loginCred.password}
            onChange={(e) => handleOnCredChange(e.target.value, "password")}
            type="password"
            placeholder="Password"
          />
          <Components.Button onClick={onSignInClicked} type="button">
            Sign In
          </Components.Button>
          <Components.Anchor href="/home">Continue as Guest</Components.Anchor>
        </Components.FormContainer>
      </Components.SignInContainer>

      <Components.OverlayContainer signIn={signIn}>
        <Components.Overlay signIn={signIn}>
          <Components.LeftOverlayPanel signIn={signIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
              To keep connected with us please login with your personal info
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>
              Sign In
            </Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signIn={signIn}>
            <Components.Title>Hello, Friend!</Components.Title>
            <Components.Paragraph>
              Enter Your personal details and start journey with us
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(false)}>
              Sign Up
            </Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </>
  );
};

export default Login;
