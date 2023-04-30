import { useQuery } from "@tanstack/react-query";
import axios from "../axios/axiosInstance";

async function getCars() {
  return axios.get("/api/Car/get_allcar_details");
}

export const useGetCars = () => useQuery(["car-lists"], getCars);
