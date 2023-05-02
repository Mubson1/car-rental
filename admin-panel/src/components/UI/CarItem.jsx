import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteCar } from "../../helper/useCars";

const CarItem = (props) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const { mutate: deleteCar, isLoading: deletingCar } = useDeleteCar();

  const { brand, status, ratePerDay, imageUrl, carName, id } = props.item;

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="car__item flex flex-col justify-between">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal text-white w-1/3">
            <div className="modal-header">
              <h2 className="text-2xl font-bold">Delete Car</h2>
              <button className="close-button" onClick={toggleModal}>
                &times;
              </button>
            </div>
            <div className="modal-content">
              <div className="flex flex-col">
                <span>
                  This car will be permanently removed from your database. Are
                  you sure you want to remove?
                </span>
                <button
                  onClick={() =>
                    deleteCar(id, {
                      onSuccess: () => {
                        setShowModal(false);
                      },
                    })
                  }
                  disabled={deletingCar}
                  className="bg-red-500 py-2 px-4 mt-4"
                  style={{
                    border: "none",
                    borderRadius: 20,
                    color: "white",
                    fontWeight: "600",
                  }}>
                  {deletingCar ? "Loading..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="car__item-top">
        <div className="car__item-tile">
          <h3>{carName}</h3>
          <span>
            <i className="ri-delete-bin-6-fill" onClick={toggleModal}></i>
          </span>
        </div>
        <p>{brand}</p>
      </div>

      <div className="car__img">
        <img src={imageUrl} alt="" />
      </div>

      <div className="flex flex-col">
        <div className="car__item-bottom">
          <div className="car__bottom-left">
            <p>
              <i class="ri-repeat-line"></i>
              {status}
            </p>
          </div>

          <p className="car__rent">Rs{ratePerDay}/d</p>
        </div>
        <div className="flex justify-between">
          <button
            className="bg-amber-500 rounded-md py-2 px-4 w-full"
            onClick={() => navigate(`/cars/${id}`)}
            style={{
              border: "none",
              color: "white",
              fontWeight: "600",
              marginTop: 24,
            }}>
            View
          </button>
          <button
            onClick={() => navigate(`/cars/edit/${id}`)}
            className="bg-slate-500 rounded-md py-2 px-4 w-full ml-2"
            style={{
              border: "none",
              color: "white",
              fontWeight: "600",
              marginTop: 24,
            }}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarItem;
