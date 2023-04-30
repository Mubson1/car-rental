import { useQuery } from "@tanstack/react-query";
import axios from "../../shared/axiosInstance";

async function getRentalHistory({ queryKey }) {
  const [, userId] = queryKey;
  return axios.get(`/api/RentalHistory/get_rental_history?userId=${userId}`);
}

export const useGetRentalHistory = (userId) =>
  useQuery(["rental-history", userId], {
    queryFn: getRentalHistory,
    enabled: !!userId,
  });
