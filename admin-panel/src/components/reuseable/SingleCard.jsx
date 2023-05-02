import React from "react";
import { SpinnerComponent } from "./Spinner";

const SingleCard = (props) => {
  const { title, totalNumber, icon, onClick, isLoading } = props.item;
  if (isLoading) return <SpinnerComponent />;
  return (
    <div className="single__card" onClick={onClick}>
      <div className="card__content">
        <h4>{title}</h4>
        <span>{totalNumber}+</span>
      </div>

      <span className="card__icon">
        <i class={icon}></i>
      </span>
    </div>
  );
};

export default SingleCard;
