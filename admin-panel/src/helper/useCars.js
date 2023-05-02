import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../axios/axiosInstance";
import { ToastNotificationContext } from "../context/toastNotificationContext";
import { useContext } from "react";

async function getCars() {
  return axios.get("/api/Car/get_allcar_details");
}

async function getCarById({ queryKey }) {
  const [, carId] = queryKey;
  return axios.get(`/api/Car/car_details?id=${carId}`);
}

async function postCar(payload) {
  return axios.post("/api/Car/add_new_car", payload);
}

async function updateCar(payload) {
  return axios.put("/api/car/update_car_details", payload);
}

async function deleteCar(carId) {
  return axios.delete(`/api/Car/remove_car?id=${carId}`);
}

export const useGetCars = () => useQuery(["car-lists"], getCars);

export const useGetCarById = (carId) =>
  useQuery(["car-lists", carId], { queryFn: getCarById, enabled: !!carId });

export const usePostCar = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: postCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-lists"] });
      showToast({
        id: new Date().toDateString(),
        title: "Add Car Success",
        type: "success",
        message: "New car has been added successfully.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Add Car Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: updateCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-lists"] });
      showToast({
        id: new Date().toDateString(),
        title: "Update Car Detail Success",
        type: "success",
        message: "Car detail has been edited successfully.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Update Car Detail Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-lists"] });
      showToast({
        id: new Date().toDateString(),
        title: "Delete Car Success",
        type: "success",
        message: "Car has been deleted successfully.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Delete Car Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};
