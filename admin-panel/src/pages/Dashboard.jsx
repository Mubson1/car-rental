import React from "react";
import "../styles/dashboard.css";
import "../styles/bookings.css";
import SingleCard from "../components/reuseable/SingleCard";

import MileChart from "../charts/MileChart";
import CarStatsChart from "../charts/CarStatsChart";
import RecommendCarCard from "../components/UI/RecommendCarCard";
import { useGetAllUser } from "../helper/useUser";
import { useGetCars } from "../helper/useCars";

import recommendCarsData from "../assets/dummy-data/recommendCars";
import { useNavigate } from "react-router-dom";
import { useGetRentPayments } from "../helper/usePayment";
import { useGetRentHistory } from "../helper/useRent";
import { useGetOffers } from "../helper/useOffer";
import {
  useGetFrequentlyRentedCars,
  useGetInactiveCustomers,
  useGetNotFrequentlyRentedCars,
  useGetRegularCustomers,
} from "../helper/useStats";
import useToken from "../axios/useToken";

const carObj = {
  title: "Total Cars",
  totalNumber: 750,
  icon: "ri-police-car-line",
};

const tripObj = {
  title: "Daily Trips",
  totalNumber: 1697,
  icon: "ri-steering-2-line",
};

const clientObj = {
  title: "Clients Annually",
  totalNumber: "85k",
  icon: "ri-user-line",
};

const distanceObj = {
  title: "Kilometers Daily",
  totalNumber: 2167,
  icon: "ri-timer-flash-line",
};

const Dashboard = () => {
  const [token, setToken] = useToken();
  const navigate = useNavigate();
  const { data: allUser, isLoading: userLoading } = useGetAllUser();
  const { data: allCars, isLoading: carLoading } = useGetCars();
  const { data: paidPayments, isLoading: paymentsLoading } = useGetRentPayments(
    { paymentId: "Paid" }
  );
  const { data: rentRequests, isLoading: requestsLoading } =
    useGetRentHistory();
  const { data: carOffers, isLoading: offersLoading } = useGetOffers();
  const { data: frequentlyRented, isLoading: getFrequentLoading } =
    useGetFrequentlyRentedCars();
  const { data: notFrequentlyRented, isLoading: getNotFrequentLoading } =
    useGetNotFrequentlyRentedCars();
  const { data: regularCustomers, isLoading: getRegularLoading } =
    useGetRegularCustomers();
  const { data: inactiveCustomers, isLoading: getInactiveLoading } =
    useGetInactiveCustomers();

  const rentedData = frequentlyRented?.data?.rentedCars?.slice(0, 3);
  const notRentedData = notFrequentlyRented?.data?.notRentedCars?.slice(0, 3);
  const activeData = regularCustomers?.data?.regularCustomers?.slice(0, 3);
  const inactiveData = inactiveCustomers?.data?.inactiveCustomers?.slice(0, 3);
  return (
    <div className="dashboard">
      <div className="dashboard__wrapper">
        <div className="dashboard__cards">
          <SingleCard
            item={{
              title: "Total Cars",
              totalNumber: allCars?.data?.cars?.length || 0,
              icon: "ri-police-car-line",
              onClick: () => navigate("/cars"),
              isLoading: carLoading,
            }}
          />
          <SingleCard
            item={{
              title: "Total Users",
              totalNumber: allUser?.data?.users?.length || 0,
              icon: "ri-user-line",
              onClick: () => {
                JSON.parse(token)?.user?.role === "Admin" && navigate("/users");
              },
              isLoading: userLoading,
            }}
          />
          <SingleCard
            item={{
              title: "Total Requests",
              totalNumber: rentRequests?.data?.history?.length || 0,
              icon: "ri-file-list-3-line",
              onClick: () => navigate("/bookings"),
              isLoading: requestsLoading,
            }}
          />
          <SingleCard
            item={{
              title: "Total Sales",
              totalNumber: paidPayments?.data?.payments?.length || 0,
              icon: "ri-hand-coin-line",
              onClick: () => navigate("/payments"),
              isLoading: paymentsLoading,
            }}
          />
        </div>
        <div className="statics">
          <div className="stats">
            <h3 className="stats__title">Top 3 Cars</h3>
            <div className="flex justify-between gap-8">
              <div className="w-full flex flex-col">
                <span className="text-gray-500">Most Rented</span>
                {rentedData?.length === 0 ? (
                  <span className="text-white text-sm font-semibold mt-4">
                    N/A
                  </span>
                ) : (
                  rentedData?.map((data) => (
                    <div
                      className="dashboardListContainer"
                      onClick={() => navigate(`/cars/${data?.car?.carId}`)}>
                      <span className="text-white text-sm font-semibold mt-4">
                        {data?.car?.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="w-full flex flex-col">
                <span className="text-gray-500">Least Rented</span>
                {notRentedData?.length === 0 ? (
                  <span className="text-white text-sm font-semibold mt-4">
                    N/A
                  </span>
                ) : (
                  notRentedData?.map((data) => (
                    <div
                      className="dashboardListContainer"
                      onClick={() => navigate(`/cars/${data?.id}`)}>
                      <span className="text-white text-sm font-semibold mt-4">
                        {data?.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="stats">
            <h3 className="stats__title">Top 3 Users</h3>
            <div className="flex justify-between gap-8">
              <div className="w-full flex flex-col">
                <span className="text-gray-500">Active</span>
                {activeData?.length === 0 ? (
                  <span className="text-white text-sm font-semibold mt-4">
                    N/A
                  </span>
                ) : (
                  activeData?.map((data) => (
                    <div
                      className="dashboardListContainer"
                      onClick={() => navigate(`/users/detail/${data?.id}`)}>
                      <span className="text-white text-sm font-semibold mt-4">
                        {data?.username}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="w-full flex flex-col">
                <span className="text-gray-500">Inactive</span>
                {inactiveData?.length === 0 ? (
                  <span className="text-white text-sm font-semibold mt-4">
                    N/A
                  </span>
                ) : (
                  inactiveData?.map((data) => (
                    <div
                      className="dashboardListContainer"
                      onClick={() => navigate(`/users/detail/${data?.id}`)}>
                      <span className="text-white text-sm font-semibold mt-4">
                        {data?.username}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <h2 className="sell__car-title mt-8">Special Offers</h2>
        {carOffers?.data?.offer?.length !== 0 ? (
          <div className="recommend__cars-wrapper">
            {carOffers?.data?.offer[0] && (
              <RecommendCarCard
                item={{
                  carName: carOffers?.data?.offer[0]?.carName,
                  status: carOffers?.data?.offer[0]?.carStatus,
                  imgUrl: carOffers?.data?.offer[0]?.carImage,
                  rentPrice: carOffers?.data?.offer[0]?.rentRate,
                  percentage: carOffers?.data?.offer[0]?.discount,
                  start: carOffers?.data?.offer[0]?.startDate,
                  end: carOffers?.data?.offer[0]?.endDate,
                  onClick: () =>
                    navigate(`/cars/${carOffers?.data?.offer[0]?.carId}`),
                }}
              />
            )}
            {carOffers?.data?.offer[1] && (
              <RecommendCarCard
                item={{
                  carName: carOffers?.data?.offer[1]?.carName,
                  status: carOffers?.data?.offer[1]?.carStatus,
                  imgUrl: carOffers?.data?.offer[1]?.carImage,
                  rentPrice: carOffers?.data?.offer[1]?.rentRate,
                  percentage: carOffers?.data?.offer[1]?.discount,
                  start: carOffers?.data?.offer[1]?.startDate,
                  end: carOffers?.data?.offer[1]?.endDate,
                  onClick: () =>
                    navigate(`/cars/${carOffers?.data?.offer[1]?.carId}`),
                }}
              />
            )}
            {carOffers?.data?.offer[3] && (
              <RecommendCarCard
                item={{
                  carName: carOffers?.data?.offer[2]?.carName,
                  status: carOffers?.data?.offer[2]?.carStatus,
                  imgUrl: carOffers?.data?.offer[2]?.carImage,
                  rentPrice: carOffers?.data?.offer[2]?.rentRate,
                  percentage: carOffers?.data?.offer[2]?.discount,
                  start: carOffers?.data?.offer[2]?.startDate,
                  end: carOffers?.data?.offer[2]?.endDate,
                  onClick: () =>
                    navigate(`/cars/${carOffers?.data?.offer[2]?.carId}`),
                }}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col w-full text-center mt-8">
            <span className="text-white text-xl font-semibold">
              No Existing Offers
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
