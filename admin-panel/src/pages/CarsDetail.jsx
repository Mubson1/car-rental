import React, { useState } from "react";
import sellCar from "../assets/images/sell-car.png";
import "../styles/sell-car.css";
import TrackingChart from "../charts/TrackingChart";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useParams } from "react-router-dom";
import { useGetCarById } from "../helper/useCars";
import { SpinnerComponent } from "../components/reuseable/Spinner";
import "../styles/bookings.css";
import {
  useDeleteOffer,
  useGetOfferByCar,
  usePostNewOffer,
  useUpdateOffer,
} from "../helper/useOffer";
import { formatDate, formatDateTwo } from "../helper/formatDate";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../components/reuseable/FormInput";

const validationSchema = Yup.object({
  offerTitle: Yup.string().required("Required").trim(),
  offerDescription: Yup.string().required("Required").trim(),
  startDate: Yup.date().required("Required"),
  endDate: Yup.date()
    .required("Required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  discount: Yup.number().required("Required").min(10).max(90),
});

const CarDetails = () => {
  const { carId } = useParams();

  const { data: carDetail, isLoading: gettingCarDetail } = useGetCarById(carId);
  const { data: carOffers } = useGetOfferByCar(carDetail?.data?.car?.id);
  const { mutate: addNewOffer, isLoading: addingOffer } = usePostNewOffer();
  const { mutate: updateOffer, isLoading: updatingOffer } = useUpdateOffer();
  const { mutate: removeOffer, isLoading: removingOffer } = useDeleteOffer();

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDetails, setEditDetails] = useState();

  const handleSubmit = (info) => {
    if (isEditMode) {
      updateOffer(
        {
          ...info,
          carId: carDetail?.data?.car?.id,
          id: editDetails?.id,
        },
        {
          onSuccess: () => {
            setShowModal(false);
            setEditDetails();
            setIsEditMode(false);
          },
        }
      );
    } else {
      addNewOffer(
        {
          ...info,
          carId: carDetail?.data?.car?.id,
        },
        {
          onSuccess: () => {
            setShowModal(false);
          },
        }
      );
    }
  };

  const initialOfferDetail = {
    offerTitle: isEditMode ? editDetails?.offerTitle : "",
    offerDescription: isEditMode ? editDetails?.offerDescription : "",
    discount: isEditMode ? editDetails?.discount : 10,
    startDate: isEditMode ? formatDateTwo(editDetails?.startDate) : "",
    endDate: isEditMode ? formatDateTwo(editDetails?.endDate) : "",
  };

  if (gettingCarDetail) return <SpinnerComponent />;

  return (
    <div className="sell__car">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal text-white w-1/3">
            <div className="modal-header">
              <h2 className="text-2xl font-bold">Add New Offer For This Car</h2>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-content">
              <Formik
                initialValues={initialOfferDetail}
                validationSchema={validationSchema}
                onSubmit={(values, formikActions) => {
                  handleSubmit(values);
                  formikActions.resetForm();
                  formikActions.setSubmitting(false);
                }}>
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => {
                  const {
                    discount,
                    endDate,
                    offerDescription,
                    offerTitle,
                    startDate,
                  } = values;
                  return (
                    <>
                      <FormInput
                        value={offerTitle}
                        error={touched.offerTitle && errors.offerTitle}
                        onBlur={handleBlur("offerTitle")}
                        label="Offer Title"
                        placeholder="Enter the title of the offer"
                        onChange={handleChange("offerTitle")}
                      />
                      <FormInput
                        value={discount}
                        error={touched.discount && errors.discount}
                        onBlur={handleBlur("discount")}
                        label="Discount"
                        placeholder="Enter discount offer"
                        onChange={handleChange("discount")}
                        type="number"
                        min={10}
                        max={90}
                      />
                      <FormInput
                        value={startDate}
                        error={touched.startDate && errors.startDate}
                        onBlur={handleBlur("startDate")}
                        label="Valid From"
                        placeholder="Enter the offer start date"
                        onChange={handleChange("startDate")}
                        type="date"
                      />
                      <FormInput
                        value={endDate}
                        error={touched.endDate && errors.endDate}
                        onBlur={handleBlur("endDate")}
                        label="Valid Till"
                        placeholder="Enter the offer end date"
                        onChange={handleChange("endDate")}
                        type="date"
                      />
                      <FormInput
                        isTextArea
                        value={offerDescription}
                        error={
                          touched.offerDescription && errors.offerDescription
                        }
                        onBlur={handleBlur("offerDescription")}
                        label="Offer Description"
                        placeholder="Write the offer description..."
                        onChange={handleChange("offerDescription")}
                        rows={4}
                      />
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-slate-500 py-2 px-4"
                        // disabled={confirmPaymentLoading}
                        style={{
                          border: "none",
                          borderRadius: 20,
                          color: "white",
                          fontWeight: "600",
                          marginTop: 16,
                        }}>
                        {addingOffer || updatingOffer
                          ? "Loading..."
                          : "Confirm"}
                      </button>
                    </>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      )}
      <div className="sell__car-wrapper">
        <h2 className="sell__car-title">My Car Detail</h2>
        <div className="sell__car-top ">
          <div className="sell__car-img formContainer">
            <h2 className="text-2xl">{carDetail?.data?.car?.carName}</h2>
            <h2 style={{ color: "GrayText", fontSize: 14 }}>
              {carDetail?.data?.car?.id}
            </h2>

            <img src={carDetail?.data?.car?.imageUrl} alt="" />
            <div>
              <span className="text-sm font-semibold text-gray-500 mr-2">
                Status:
              </span>
              <span className="text-sm font-semibold text-white">
                {carDetail?.data?.car?.status}
              </span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-500 mr-2">
                Rate Per Day:
              </span>
              <span className="text-sm font-semibold text-white">
                Rs. {carDetail?.data?.car?.ratePerDay}
              </span>
            </div>
          </div>

          <div className="tracking__history formContainer text-white">
            <h2 className="text-lg font-bold mb-2">Details</h2>

            <div className="flex justify-between">
              <span>Brand:</span>
              <span>{carDetail?.data?.car?.brand}</span>
            </div>

            <div className="flex justify-between">
              <span>Color:</span>
              <span>{carDetail?.data?.car?.color}</span>
            </div>
            <div className="flex justify-between">
              <span>Mileage:</span>
              <span>{carDetail?.data?.car?.mileage}</span>
            </div>
            <div className="flex justify-between">
              <span>Fuel Type:</span>
              <span>{carDetail?.data?.car?.fuelType}</span>
            </div>
            <div className="flex justify-between">
              <span>Safety Rating:</span>
              <span>{carDetail?.data?.car?.safetyRating}</span>
            </div>
            <h2 className="text-lg font-bold mt-8 my-2">About This Car</h2>
            <div>
              <span>{carDetail?.data?.car?.description}</span>
            </div>
          </div>
        </div>

        <div className="offer__wrapper">
          <div className="offer__top">
            <h2 className="sell__car-title mb-0">Offers</h2>

            <div className="filter__widget-01">
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-500 py-2 px-4"
                style={{
                  border: "none",
                  borderRadius: 20,
                  color: "white",
                  fontWeight: "600",
                }}>
                Add New Offer
              </button>
            </div>
          </div>

          <div className="offer__list">
            {carOffers?.data?.offer.length !== 0 ? (
              carOffers?.data?.offer?.map((offer) => (
                <div className="offer__item formContainer">
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="text-xl text-white">
                        {offer?.offerTitle}
                      </span>
                      <span className="text-sm text-gray-500">{offer?.id}</span>
                    </div>

                    <div className="box__03 text-center">
                      <h6 className="spend__amount">
                        {formatDate(offer?.startDate)}
                      </h6>
                      <p className="spend__title">Valid From</p>
                    </div>

                    <div className="box__04 text-center">
                      <h6 className="spend__amount">
                        {formatDate(offer?.endDate)}
                      </h6>
                      <p className="spend__title">Valid Till</p>
                    </div>

                    <div className="box__05 text-center">
                      <h6 className="spend__amount flex">
                        <span className="model__spend-icon mr-3">
                          <i class="ri-money-dollar-circle-line"></i>
                        </span>
                        {offer?.discount}%
                      </h6>
                      <p className="spend__title">Discount Offer</p>
                    </div>
                  </div>
                  <div>
                    <div className="text-white flex flex-col mt-4">
                      <span>Offer Description</span>
                      <span className="text-gray-500 text-lg">
                        {offer?.offerDescription}
                      </span>
                    </div>
                    <div className="flex mt-8">
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setIsEditMode(true);
                          setEditDetails(offer);
                        }}
                        className="py-2 px-4"
                        style={{
                          backgroundColor: "#ef621c",
                          border: "none",
                          borderRadius: 20,
                          color: "white",
                          fontWeight: "600",
                        }}>
                        Edit Offer
                      </button>

                      <button
                        onClick={() => removeOffer(offer?.id)}
                        disabled={removingOffer}
                        className="bg-red-500 py-2 px-4"
                        style={{
                          border: "none",
                          borderRadius: 20,
                          color: "white",
                          fontWeight: "600",
                          marginLeft: 14,
                        }}>
                        {removingOffer ? "Loading..." : "Remove Offer"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col w-full text-center mt-18">
                <span className="text-white text-xl font-semibold">
                  No Existing Offer
                </span>
                <span className="text-white text-sm mt-2">
                  Click the <i>Add New Offer</i> button to add offer
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
