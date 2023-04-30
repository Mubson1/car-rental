import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axios/axiosInstance";
import useToken from "../../axios/useToken";
import { usePostLogin, usePostLoginCustomer } from "../../helper/useUser";

const Login = () => {
  const navigate = useNavigate();

  const [, setToken] = useToken();

  const [userName, setUserName] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [errMessage, setErrMessage] = useState("");

  const { mutate: postLogin, isLoading: loginLoading } = usePostLogin();

  const onLogInClicked = async () => {
    postLogin(
      {
        username: userName,
        password: passwordValue,
      },
      {
        onSuccess: () => {
          navigate("/");
        },
        // onError:() => {}
      }
    );
    // try {
    //   const response = await axios.post("/api/UserAuth/login", {
    //     username: userName,
    //     password: passwordValue,
    //   });
    //   setToken(JSON.stringify(response?.data));
    //   // console.log(response)
    // } catch (error) {
    //   setErrMessage("Invalid username or password");
    //   console.log(error);
    // }
  };
  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="grid grid-cols-2 items-center bg-white rounded-3xl shadow-2xl">
        <div className="righside">
          <img
            src={
              "https://img.freepik.com/premium-photo/modern-cars-are-studio-room-3d-illustration-3d-render_37416-244.jpg"
            }
            className="h-80 rounded-3xl w-full object-cover"
          />
        </div>
        <div className="grid gap-4 justify-evenly">
          <div className="grid gap-10 grid-cols-2 items-center">
            <h1>Sign In</h1>
          </div>
          {errMessage && (
            <div className="text-red-500 font-bold text-sm">{errMessage}</div>
          )}
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
            className="rounded-full py-3 px-6"
          />
          <input
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            type="password"
            placeholder="Password"
            className="rounded-full py-3 px-6"
          />
          <button
            disabled={!userName || !passwordValue || loginLoading}
            onClick={onLogInClicked}
            className="disabled:bg-blue-300 text-white border-none font-bold rounded-full py-3 px-10 transition ease-in-out delay-150 bg-blue-500 hover:bg-indigo-500 duration-300">
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
