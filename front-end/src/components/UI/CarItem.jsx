import React from "react";
import { Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/car-item.css";

const CarItem = (props) => {
  const navigate = useNavigate();

  const { id, imageUrl, brand, carName, fuelType, mileage, ratePerDay } =
    props?.item;

  return (
    <Col lg="4" md="4" sm="6" className="mb-5">
      <div className="car__item">
        <div className="car__img">
          <img src={imageUrl} alt="" className="w-100" />
        </div>

        <div className="car__item-content mt-4">
          <h4 className="section__title text-center">{carName}</h4>
          <h6 className="rent__price text-center mt-">
            Rs{ratePerDay} <span>/ Day</span>
          </h6>

          <div className="car__item-info d-flex align-items-center justify-content-between mt-3 mb-4">
            <span className=" d-flex align-items-center gap-1">
              <i class="ri-car-line"></i> {brand}
            </span>
            <span className=" d-flex align-items-center gap-1">
              <i class="ri-settings-2-line"></i> {fuelType}
            </span>
            <span className=" d-flex align-items-center gap-1">
              <i class="ri-timer-flash-line"></i> {mileage} kmpl
            </span>
          </div>

          <button
            onClick={() => navigate(`/cars/${id}`)}
            className=" w-100 car__item-btn car__btn-details">
            <Link>Details</Link>
          </button>
        </div>
      </div>
    </Col>
  );
};

export default CarItem;
