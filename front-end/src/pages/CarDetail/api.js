import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../shared/axiosInstance";
import { ToastNotificationContext } from "../../context/toastNotificationContext";
import { useContext } from "react";
import useToken from "../../helper/useToken";

async function getCarDetail({ queryKey }) {
  const [, carId] = queryKey;
  return axios.get(`/api/Car/car_details?id=${carId}`);
}

async function postRentRequest(payload) {
  return axios.post("/api/Customer/post_request", payload);
}

export const useGetCarDetail = (carId) =>
  useQuery(["car-lists", carId], { queryFn: getCarDetail, enabled: !!carId });

export const usePostRentRequest = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: postRentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      showToast({
        id: new Date().toDateString(),
        title: "Request Successful",
        type: "success",
        message: "Your request to rent the car has been successfully placed.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Request Failed!",
        type: "danger",
        message: error.message,
      });
    },
  });
};
