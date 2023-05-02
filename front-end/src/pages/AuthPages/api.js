import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../shared/axiosInstance";
import { useContext } from "react";
import { ToastNotificationContext } from "../../context/toastNotificationContext";
import useToken from "../../helper/useToken";
import { useNavigate } from "react-router-dom";

async function postRegisterCustomer(payload) {
  return axios.post("/api/UserAuth/register_customer", payload);
}

async function postLoginCustomer(payload) {
  return axios.post("/api/UserAuth/login", payload);
}

async function uploadDocument(payload) {
  return axios.post("/api/UserAuth/upload_document", payload);
}

async function postLogout() {
  return axios.post("/api/UserAuth/logout");
}

async function changeMyPassword(payload) {
  return axios.post("/api/UserAuth/change_password", payload);
}

async function getOffers() {
  return axios.get("/api/SpecialOffer/get_offers");
}

export const usePostLoginCustomer = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  const [, setToken] = useToken();

  return useMutation({
    mutationFn: postLoginCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
      setToken(JSON.stringify(data.data));
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Authentication Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const usePostRegisterCustomer = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  const [, setToken] = useToken();

  return useMutation({
    mutationFn: postRegisterCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
      setToken(JSON.stringify(data.data));
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Authentication Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  const [, setToken] = useToken();

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
      setToken(JSON.stringify(data.data));
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Authentication Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const usePostLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
      localStorage.removeItem("token");
      navigate("/auth");
    },
  });
};

export const useUpdateMyPassword = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: changeMyPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
      showToast({
        id: new Date().toDateString(),
        title: "Password Change Success",
        type: "success",
        message: "Password has been successfully changed.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Password Change Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useGetOffers = () => useQuery(["offer-by-car"], getOffers);
