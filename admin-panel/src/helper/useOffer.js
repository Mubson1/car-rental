import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../axios/axiosInstance";
import { useContext } from "react";
import { ToastNotificationContext } from "../context/toastNotificationContext";

async function getOffers() {
  return axios.get("/api/SpecialOffer/get_offers");
}

async function getOfferByCar({ queryKey }) {
  const [, carId] = queryKey;
  return axios.get(`/api/SpecialOffer/offer_detail/${carId}`);
}

async function postNewOffer(payload) {
  return axios.post("/api/SpecialOffer/add_new_offer", payload);
}

async function updateOffer(payload) {
  return axios.put("/api/SpecialOffer/change_offer", payload);
}

async function deleteOffer(offerId) {
  return axios.delete(`/api/SpecialOffer/delete_offer?id=${offerId}`);
}

export const useGetOffers = () => useQuery(["offer-by-car"], getOffers);

export const useGetOfferByCar = (carId) =>
  useQuery(["offer-by-car", carId], {
    queryFn: getOfferByCar,
    enabled: !!carId,
  });

export const usePostNewOffer = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: postNewOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offer-by-car"] });
      showToast({
        id: new Date().toDateString(),
        title: "Add Offer Success",
        type: "success",
        message: "The offer has been added successfully",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Add Offer Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: updateOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offer-by-car"] });
      showToast({
        id: new Date().toDateString(),
        title: "Update Offer Success",
        type: "success",
        message: "The offer has been updated successfully",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Update Offer Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offer-by-car"] });
      showToast({
        id: new Date().toDateString(),
        title: "Remove Offer Success",
        type: "success",
        message: "The offer has been removed successfully",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Remove Offer Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};
