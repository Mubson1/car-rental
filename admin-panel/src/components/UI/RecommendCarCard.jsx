import React from "react";
import { formatDate } from "../../helper/formatDate";

const RecommendCarCard = (props) => {
  const {
    carName,
    status,
    imgUrl,
    rentPrice,
    percentage,
    start,
    end,
    onClick,
  } = props.item;
  return (
    <div className="recommend__car-card" onClick={onClick}>
      <div className="recommend__car-top flex justify-between">
        <h5>
          <span>
            <i class="ri-refresh-line"></i>
          </span>
          {percentage}% Offer
        </h5>
        <span className="mt-1">
          {start} - {end}
        </span>
      </div>

      <div className="recommend__car-img">
        <img src={imgUrl} alt="" />
      </div>
      <div className="recommend__car-bottom">
        <h4>{carName}</h4>
        <div className="recommend__car-other">
          <div className="recommend__icons">
            <p>
              <i class="ri-repeat-line"></i>
              {status}
            </p>
            <p>
              <i class="ri-settings-2-line"></i>
            </p>
            <p>
              <i class="ri-timer-flash-line"></i>
            </p>
          </div>
          <span>Rs.{rentPrice}/d</span>
        </div>
      </div>
    </div>
  );
};

export default RecommendCarCard;
