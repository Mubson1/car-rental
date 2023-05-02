import React, { useEffect, useState } from "react";
import "../styles/bookings.css";

import carData from "../assets/dummy-data/booking-cars.js";
import CarItem from "../components/UI/CarItem";
import { useGetCars } from "../helper/useCars";
import { SpinnerComponent } from "../components/reuseable/Spinner";
import { useNavigate } from "react-router-dom";

const Cars = () => {
  const navigate = useNavigate();

  const { data: carLists, isLoading: getCarLoading } = useGetCars();

  const [sortCategory, setSortCategory] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [sortedList, setSortedList] = useState(carLists?.data?.cars);

  const handleOptionChange = (event) => {
    setSortCategory(event.target.value);
  };

  const handleOrderChange = (event) => {
    setSelectedOrder(event.target.value);
  };

  useEffect(() => {
    if (sortCategory === "Available") {
      setSortedList(
        carLists?.data?.cars?.filter((car) => car.status === "Available")
      );
    } else if (sortCategory === "Damaged") {
      setSortedList(
        carLists?.data?.cars?.filter((car) => car.status === "Damaged")
      );
    } else if (sortCategory === "Rented") {
      setSortedList(
        carLists?.data?.cars?.filter((car) => car.status === "Rented")
      );
    } else if (sortCategory === "Unavailable") {
      setSortedList(
        carLists?.data?.cars?.filter((car) => car.status === "Unavailable")
      );
    } else {
      setSortedList(carLists?.data?.cars);
    }
  }, [sortCategory, carLists]);

  useEffect(() => {
    if (selectedOrder === "desc") {
      setSortedList(
        carLists?.data?.cars?.sort((a, b) => a.ratePerDay - b.ratePerDay)
      );
    } else if (selectedOrder === "asc") {
      setSortedList(
        carLists?.data?.cars?.sort((a, b) => b.ratePerDay - a.ratePerDay)
      );
    } else {
      setSortedList(carLists?.data?.cars);
    }
  }, [selectedOrder, carLists]);

  if (getCarLoading) return <SpinnerComponent />;

  return (
    <div className="bookings">
      <div className="booking__wrapper">
        <div className="flex justify-between">
          <h2 className="booking__title">Cars</h2>
          <button
            className="bg-blue-500 rounded-2xl px-4 h-12"
            onClick={() => navigate("/cars/new")}>
            Add New Car
          </button>
        </div>

        <div className="filter__widget-wrapper">
          <div className="filter__widget-01">
            <select onChange={handleOptionChange} value={sortCategory}>
              <option>Car Status</option>
              <option value="Available">Available</option>
              <option value="Damaged">Damaged</option>
              <option value="Unavailable">Unavailable</option>
              <option value="Rented">Rented</option>
            </select>
          </div>

          <div className="filter__widget-01">
            <select value={selectedOrder} onChange={handleOrderChange}>
              <option>Sort Price</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {sortedList?.length === 0 && (
          <div className="flex flex-col w-full text-center mt-28">
            <span className="text-white text-xl font-semibold">No Cars</span>
            <span className="text-white text-sm mt-2">
              Adjust Your Search Filter
            </span>
          </div>
        )}
        <div className="booking__car-list">
          {sortedList?.map((item) => (
            <CarItem item={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
