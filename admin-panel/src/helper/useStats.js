import { useQuery } from "@tanstack/react-query";
import axios from "../axios/axiosInstance";

async function getFrequentlyRentedCars() {
  return axios.get("/api/CarRental/get_frequently_rented_cars");
}
async function getNotFrequentlyRentedCars() {
  return axios.get("/api/CarRental/get_not_rented_cars");
}
async function getRegularCustomers() {
  return axios.get("/api/CarRental/get_regular_customers");
}
async function getInactiveCustomers() {
  return axios.get("/api/CarRental/get_inactive_customers");
}

export const useGetFrequentlyRentedCars = () =>
  useQuery(["frequently-rented"], getFrequentlyRentedCars);

export const useGetNotFrequentlyRentedCars = () =>
  useQuery(["frequently-not-rented"], getNotFrequentlyRentedCars);

export const useGetRegularCustomers = () =>
  useQuery(["active-users"], getRegularCustomers);

export const useGetInactiveCustomers = () =>
  useQuery(["inactive-users"], getInactiveCustomers);
