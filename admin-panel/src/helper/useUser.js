import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../axios/axiosInstance";
import useToken from "../axios/useToken";
import { ToastNotificationContext } from "../context/toastNotificationContext";
import { useContext } from "react";

async function postLoginCustomer(payload) {
  return axios.post("/api/UserAuth/login", payload);
}

export const usePostLogin = () => {
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
