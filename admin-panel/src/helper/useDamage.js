import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../axios/axiosInstance";
import { useContext } from "react";
import { ToastNotificationContext } from "../context/toastNotificationContext";

async function getDamageRequest() {
  return axios.get("/api/DamageRequest/get_all_request");
}

async function postDamagePayment(payload) {
  return axios.post("/api/DamagePayment/create_payment", payload);
}

export const useGetDamageRequest = () =>
  useQuery(["damage-request-list"], getDamageRequest);

export const usePostDamagePayment = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: postDamagePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["damage-request-list"] });
      showToast({
        id: new Date().toDateString(),
        title: "Add Damage Payment Success",
        type: "success",
        message: "The damage repair payment has been set.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Add Damage Payment Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};
