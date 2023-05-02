import { useQuery } from "@tanstack/react-query";
import axios from "../axios/axiosInstance";

async function getStaffDetail() {
  return axios.get("/api/Admin/get_staff_details");
}

export const useGetStaffDetails = () =>
  useQuery(["staff-lists"], getStaffDetail);
