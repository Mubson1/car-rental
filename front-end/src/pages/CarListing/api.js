import { useQuery } from "@tanstack/react-query";
import axios from "../../shared/axiosInstance";

async function getCars() {
  return axios.get("/api/Car/get_allcar_details");
}

export const useGetCars = () => useQuery(["car-lists"], getCars);
