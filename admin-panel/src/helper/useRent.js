import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../axios/axiosInstance";
import { ToastNotificationContext } from "../context/toastNotificationContext";
import { useContext } from "react";

async function getRentHistory({ queryKey }) {
  const [, params] = queryKey;
  return axios.get("/api/RentalHistory/get_rental_history", {
    params: params,
  });
}

async function getRentHistoryById({ queryKey }) {
  const [, id] = queryKey;
  return axios.get(`/api/RentalHistory/rent_request_details/${id}`);
}

async function confirmRequest(payload) {
  return axios.patch(
    `/api/RentalHistory/confirm_request?requestId=${payload.rentalId}&userId=${payload?.userId}`
  );
}

async function denyRequest(payload) {
  return axios.patch(
    `/api/RentalHistory/deny_request?requestId=${payload?.rentalId}&userId=${payload?.userId}`
  );
}



export const useGetRentHistory = (params) =>
  useQuery(["rent-history-list", params], getRentHistory);

export const useGetRentHistoryById = (id) =>
  useQuery(["rent-history-by-id", id], {
    queryFn: getRentHistoryById,
    enabled: !!id,
  });

export const useConfirmRequest = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: confirmRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rent-history-list"] });
      showToast({
        id: new Date().toDateString(),
        title: "Confirm Request Success",
        type: "success",
        message: "The car has been successfully rented.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Confirm Request Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useDenyRequest = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: denyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rent-history-list"] });
      showToast({
        id: new Date().toDateString(),
        title: "Deny Request Success",
        type: "success",
        message: "The request has been successfully denied.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Deny Request Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};


