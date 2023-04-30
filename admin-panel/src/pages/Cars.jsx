import React from "react";
import "../styles/bookings.css";

import carData from "../assets/dummy-data/booking-cars.js";
import CarItem from "../components/UI/CarItem";
import { useGetCars } from "../helper/useCars";
import { SpinnerComponent } from "../components/reuseable/Spinner";

const Cars = () => {
  const { data: carLists, isLoading: getCarLoading } = useGetCars();
  if (getCarLoading) return <SpinnerComponent />;
  return (
    <div className="bookings">
      <div className="booking__wrapper">
        <h2 className="booking__title">Cars</h2>

        <div className="filter__widget-wrapper">
          <div className="filter__widget-01">
            <select>
              <option value="New">New</option>
              <option value="Popular">Popular</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>

          <div className="filter__widget-01">
            <select>
              <option value="toyota">Toyota</option>
              <option value="bmw">Bmw</option>
              <option value="audi">Audi</option>
            </select>
          </div>
        </div>

        <div className="booking__car-list">
          {carLists?.data?.cars?.map((item) => (
            <CarItem item={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
