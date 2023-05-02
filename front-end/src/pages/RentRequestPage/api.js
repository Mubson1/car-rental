import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../shared/axiosInstance";
import { useContext } from "react";
import { ToastNotificationContext } from "../../context/toastNotificationContext";
import useToken from "../../helper/useToken";

async function getRentalHistory({ queryKey }) {
  const [, userId] = queryKey;
  return axios.get(`/api/RentalHistory/get_rental_history?userId=${userId}`);
}

async function getNotifications({ queryKey }) {
  const [, userId] = queryKey;
  return axios.get(
    `/api/RentalHistory/get_rental_history?userId=${userId}&status=Approved`
  );
}

async function requestDamage(payload) {
  return axios.post("/api/DamageRequest/post_request", payload);
}

async function cancelRentalRequest(rentId) {
  return axios.post(`/api/Customer/cancel_request?id=${rentId}`);
}

export const useGetRentalHistory = (userId) =>
  useQuery(["rental-history", userId], {
    queryFn: getRentalHistory,
    enabled: !!userId,
  });

export const useGetNotifications = (userId) =>
  useQuery(["approval-notification", userId], {
    queryFn: getNotifications,
    enabled: !!userId,
  });

export const usePostDamageRequest = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: requestDamage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental-history"] });

      showToast({
        id: new Date().toDateString(),
        title: "Damage Request Success",
        type: "success",
        message: "Damage request has been done successfully posted.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Damage Request Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useCancelRentRequest = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: cancelRentalRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental-history"] });

      showToast({
        id: new Date().toDateString(),
        title: "Cancel Request Success",
        type: "success",
        message: "Rental request has been successfully cancelled.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Cancel Request Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};
