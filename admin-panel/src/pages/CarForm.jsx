import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/bookings.css";
import FormInput from "../components/reuseable/FormInput";
import { FormRadio } from "../components/reuseable/FormRadio";
import { useGetCarById, usePostCar, useUpdateCar } from "../helper/useCars";
import { SpinnerComponent } from "../components/reuseable/Spinner";

const validationSchema = Yup.object({
  carName: Yup.string().trim().required("Required"),
  description: Yup.string().trim().required("Required"),
  brand: Yup.string().trim().required("Required"),
  ratePerDay: Yup.number().required("Required").min(0),
  color: Yup.string().trim().required("Required"),
  mileage: Yup.number().required("Required").min(0),
});

const CarForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname.split("/");
  const isEditMode = path.includes("edit");

  const { carId } = useParams();

  const [selectedRating, setSelectedRating] = useState("5");
  const [fuelType, setFuelType] = useState("Petrol");
  const [file, setFile] = useState("");
  const [editImage, setEditImage] = useState(isEditMode);

  const { data: carDetail, isLoading: loadingCarDetail } = useGetCarById(carId);
  const { mutate: addCar, isLoading: addingCar } = usePostCar();
  const { mutate: editCar, isLoading: editingCar } = useUpdateCar();

  const initialCarDetail = {
    carName: carDetail?.data?.car?.carName || "",
    description: carDetail?.data?.car?.description || "",
    brand: carDetail?.data?.car?.brand || "",
    ratePerDay: carDetail?.data?.car?.ratePerDay || 0,
    color: carDetail?.data?.car?.color || "",
    mileage: carDetail?.data?.car?.mileage || 0,
  };

  const handleRadioChange = (e) => {
    setSelectedRating(e.target.value);
  };

  const handleFuelTypeChange = (e) => {
    setFuelType(e.target.value);
  };

  const handleClick = (info) => {
    if (isEditMode) {
      const formData = new FormData();
      formData.append("Id", carId);
      formData.append("CarName", info.carName);
      formData.append("Description", info.description);
      formData.append("Brand", info.brand);
      formData.append("RatePerDay", parseFloat(info.ratePerDay));
      formData.append("Color", info.color);
      formData.append("Mileage", parseFloat(info.mileage));
      formData.append("FuelType", fuelType);
      formData.append("SafetyRating", selectedRating);
      formData.append("Image", file);
      editCar(formData, {
        onSuccess: () => {
          navigate("/cars");
        },
      });
    } else {
      const formData = new FormData();
      formData.append("CarName", info.carName);
      formData.append("Description", info.description);
      formData.append("Brand", info.brand);
      formData.append("RatePerDay", parseFloat(info.ratePerDay));
      formData.append("Color", info.color);
      formData.append("Mileage", parseFloat(info.mileage));
      formData.append("FuelType", fuelType);
      formData.append("SafetyRating", selectedRating);
      formData.append("Image", file);
      addCar(formData, {
        onSuccess: () => {
          navigate("/cars");
        },
      });
    }
  };

  useEffect(() => {
    if (carDetail && isEditMode) {
      setFuelType(carDetail?.data?.car?.fuelType);
      setSelectedRating(carDetail?.data?.car?.safetyRating);
      setFile(carDetail?.data?.car?.imageUrl);
    }
  }, [isEditMode, loadingCarDetail]);

  if (isEditMode && loadingCarDetail) return <SpinnerComponent />;

  return (
    <div className="bookings">
      <div className="w-full flex justify-between align-middle">
        <h2 className="booking__title">
          {isEditMode ? `Edit` : "Add New Car"}
        </h2>
      </div>
      <Formik
        initialValues={initialCarDetail}
        validationSchema={validationSchema}
        onSubmit={(values, formikActions) => {
          handleClick(values);
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
          const { brand, carName, color, description, mileage, ratePerDay } =
            values;
          return (
            <>
              <div className="formContainer">
                <div className="mb-4">
                  <label
                    htmlFor="file"
                    className="font-bold text-lg cursor-pointer">
                    Upload Image
                    <span className="ri-chat-upload-line font-light text-lg ml-4" />
                  </label>
                  <input
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      setEditImage(false);
                    }}
                    type="file"
                    id="file"
                    style={{
                      display: "none",
                      backgroundColor: "red",
                    }}
                  />
                  {file && (
                    <img
                      src={editImage ? file : URL.createObjectURL(file)}
                      alt=""
                      className="h-28 w-28 rounded-full object-contain"
                    />
                  )}
                </div>
                <FormInput
                  value={carName}
                  error={touched.carName && errors.carName}
                  onBlur={handleBlur("carName")}
                  label="Car Name"
                  placeholder="Enter the name of the car"
                  onChange={handleChange("carName")}
                />
                <FormInput
                  value={brand}
                  error={touched.brand && errors.brand}
                  onBlur={handleBlur("brand")}
                  label="Brand"
                  placeholder="Enter the brand of the car"
                  onChange={handleChange("brand")}
                />
                <FormInput
                  value={color}
                  error={touched.color && errors.color}
                  onBlur={handleBlur("color")}
                  label="Color Variant"
                  placeholder="Enter the color of the car"
                  onChange={handleChange("color")}
                />
                <FormInput
                  value={ratePerDay}
                  error={touched.ratePerDay && errors.ratePerDay}
                  onBlur={handleBlur("ratePerDay")}
                  label="Rental Rate (per day)"
                  placeholder="Enter the rental rate of the car"
                  onChange={handleChange("ratePerDay")}
                  type="number"
                  min={0}
                />
                <FormInput
                  value={mileage}
                  error={touched.mileage && errors.mileage}
                  onBlur={handleBlur("mileage")}
                  label="Mileage"
                  placeholder="Enter the mileage given by the car"
                  onChange={handleChange("mileage")}
                  min={0}
                />
                <FormInput
                  isTextArea
                  value={description}
                  error={touched.description && errors.description}
                  onBlur={handleBlur("description")}
                  label="Description"
                  placeholder="Write a description about the car..."
                  rows={4}
                  onChange={handleChange("description")}
                />
                <div className="filter__widget-wrapper w-full">
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "gray",
                      marginBottom: 8,
                      width: 250,
                    }}>
                    Fuel Type
                  </span>
                  <div className="filter__widget-01 w-full">
                    <select
                      onChange={handleFuelTypeChange}
                      value={fuelType}
                      className="w-full">
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "gray",
                      marginBottom: 8,
                      width: 295,
                    }}>
                    Safety Rating
                  </span>
                  <div className="flex justify-between w-full">
                    <FormRadio
                      checked={selectedRating === "5"}
                      name="radio"
                      value="5"
                      label="5"
                      onChange={(e) => handleRadioChange(e)}
                    />
                    <FormRadio
                      checked={selectedRating === "4"}
                      name="radio"
                      value="4"
                      label="4"
                      onChange={(e) => handleRadioChange(e)}
                    />
                    <FormRadio
                      checked={selectedRating === "3"}
                      name="radio"
                      value="3"
                      label="3"
                      onChange={(e) => handleRadioChange(e)}
                    />
                    <FormRadio
                      checked={selectedRating === "2"}
                      name="radio"
                      value="2"
                      label="2"
                      onChange={(e) => handleRadioChange(e)}
                    />
                    <FormRadio
                      checked={selectedRating === "1"}
                      name="radio"
                      value="1"
                      label="1"
                      onChange={(e) => handleRadioChange(e)}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                type="submit"
                className="bg-slate-500 py-2 px-4"
                style={{
                  border: "none",
                  borderRadius: 20,
                  color: "white",
                  fontWeight: "600",
                  marginTop: 24,
                }}>
                {isEditMode ? "Save Car" : "Add Car"}
              </button>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default CarForm;
