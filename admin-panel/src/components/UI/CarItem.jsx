import React from "react";

const CarItem = (props) => {
  const { brand, status, ratePerDay, imageUrl, carName } = props.item;
  return (
    <div className="car__item flex flex-col justify-between">
      <div className="car__item-top">
        <div className="car__item-tile">
          <h3>{carName}</h3>
          {/* <span>
            <i class="ri-heart-line"></i>
          </span> */}
        </div>
        <p>{brand}</p>
      </div>

      <div className="car__img">
        <img src={imageUrl} alt="" />
      </div>

      <div className="car__item-bottom">
        <div className="car__bottom-left">
          <p>
            <i class="ri-repeat-line"></i>
            {status}
          </p>
        </div>

        <p className="car__rent">Rs{ratePerDay}/d</p>
      </div>
    </div>
  );
};

export default CarItem;
