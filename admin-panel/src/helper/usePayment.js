import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../axios/axiosInstance";
import { ToastNotificationContext } from "../context/toastNotificationContext";
import { useContext } from "react";

async function getRentPayments({ queryKey }) {
  const [, params] = queryKey;
  return axios.get("/api/RentalPayment/get_rent_payment", {
    params: params,
  });
}

async function getDamagePayments({ queryKey }) {
  const [, params] = queryKey;
  return axios.get("/api/DamagePayment/get_damage_payments", {
    params: params,
  });
}

async function confirmRentPayment(payload) {
  return axios.put(
    `/api/RentalPayment/confirm_rent_payment?paymentId=${payload.paymentId}&userId=${payload.userId}`
  );
}

async function confirmCarReturn(payload) {
  return axios.put("/api/RentalHistory/return_car", payload);
}

async function confirmDamagePayment(payload) {
  return axios.put(
    `/api/DamagePayment/confirm_damage_payment?paymentId=${payload.paymentId}&userId=${payload.userId}`
  );
}

export const useGetRentPayments = (params) =>
  useQuery(["rent-payment-list", params], getRentPayments);

export const useGetDamagePayments = (params) =>
  useQuery(["damage-payment-list", params], {
    queryFn: getDamagePayments,
    enabled: params?.paymentStatus !== "Cancelled",
  });

export const useConfirmRentPayment = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: confirmRentPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rent-payment-list"] });
      queryClient.invalidateQueries({ queryKey: ["rent-history-list"] });
      showToast({
        id: new Date().toDateString(),
        title: "Confirm Payment Success",
        type: "success",
        message: "The payment for booking has been successful.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Confirm Payment Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useConfirmCarReturn = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: confirmCarReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rent-payment-list"] });
      queryClient.invalidateQueries({ queryKey: ["rent-history-list"] });
      showToast({
        id: new Date().toDateString(),
        title: "Car Return Success",
        type: "success",
        message: "The car has been returned successfully.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Car Return Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useConfirmDamagePayment = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: confirmDamagePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["damage-payment-list"] });
      queryClient.invalidateQueries({ queryKey: ["rent-history-list"] });
      showToast({
        id: new Date().toDateString(),
        title: "Damage Payment Success",
        type: "success",
        message: "The payment for damage has been successfully received.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Damage Payment Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};
