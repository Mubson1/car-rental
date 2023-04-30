import React, { useEffect, useState } from "react";

import carData from "../../assets/data/carData";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../../components/Helmet/Helmet";
import { useNavigate, useParams } from "react-router-dom";
import BookingForm from "../../components/UI/BookingForm";
import PaymentMethod from "../../components/UI/PaymentMethod";
import CommonSection from "../../components/UI/CommonSection";
import { useGetCarDetail, usePostRentRequest } from "./api";
import { Form, FormGroup } from "reactstrap";

import masterCard from "../../assets/all-images/master-card.jpg";
import paypal from "../../assets/all-images/paypal.jpg";
import "../../styles/payment-method.css";
import "../../styles/booking-form.css";

import useToken from "../../helper/useToken";
import {
  CloseButton,
  Modal,
  ModalContainer,
  ModalContent,
  ModalTitle,
} from "./Component";

const CarDetails = () => {
  const navigate = useNavigate();

  const { carId } = useParams();
  const [token, setToken] = useToken();

  const { data: singleCarItem } = useGetCarDetail(carId);
  const { mutate: makeRequest, isLoading: requesting } = usePostRentRequest();

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const starClassName =
        i <= singleCarItem?.data?.car?.safetyRating
          ? "ri-star-s-fill"
          : "ri-star-s-line";

      stars.push(<i className={starClassName} key={i} />);
    }

    return stars;
  };

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [showModal, setShowModal] = useState(false);
  const [hasDoc, setHasDoc] = useState(true);

  const submitHandler = (event) => {
    event.preventDefault();

    if (JSON.parse(token)) {
      if (JSON.parse(token).user?.hasDocument) {
        // makeRequest({
        //   startDate: startDate,
        //   endDate: endDate,
        //   customerId: JSON.parse(token)?.user?.id,
        //   carId: carId,
        // });
      } else {
        setShowModal(true);
        setHasDoc(false);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <Helmet title={singleCarItem?.data?.car?.carName}>
      <CommonSection title="Car Detail" />
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <img
                src={singleCarItem?.data?.car?.imageUrl}
                alt=""
                className="w-100"
              />
            </Col>

            <Col lg="6">
              <div className="car__info">
                <h2 className="section__title">
                  {singleCarItem?.data?.car?.carName}
                </h2>

                <div className=" d-flex align-items-center gap-5 mb-4 mt-3">
                  <h6 className="rent__price fw-bold fs-4">
                    Rs. {singleCarItem?.data?.car?.ratePerDay} / Day
                  </h6>

                  <span className=" d-flex align-items-center gap-2">
                    <span style={{ color: "#f9a826" }}>{renderStars()}</span>(
                    {singleCarItem?.data?.car?.safetyRating} ratings)
                  </span>
                </div>

                <p className="section__description">
                  {singleCarItem?.data?.car?.description}
                </p>

                <div
                  className=" d-flex align-items-center mt-3"
                  style={{ columnGap: "4rem" }}>
                  <span className=" d-flex align-items-center gap-1 section__description">
                    <i
                      class="ri-roadster-line"
                      style={{ color: "#f9a826" }}></i>{" "}
                    {singleCarItem?.data?.car?.color}
                  </span>

                  <span className=" d-flex align-items-center gap-1 section__description">
                    <i
                      class="ri-settings-2-line"
                      style={{ color: "#f9a826" }}></i>{" "}
                    {singleCarItem?.data?.car?.fuelType}
                  </span>

                  <span className=" d-flex align-items-center gap-1 section__description">
                    <i
                      class="ri-timer-flash-line"
                      style={{ color: "#f9a826" }}></i>{" "}
                    {singleCarItem?.data?.car?.mileage} kmpl
                  </span>
                </div>

                <div
                  className=" d-flex align-items-center mt-3"
                  style={{ columnGap: "2.8rem" }}>
                  <span className=" d-flex align-items-center gap-1 section__description">
                    <i class="ri-map-pin-line" style={{ color: "#f9a826" }}></i>{" "}
                    {singleCarItem?.data?.car?.status}
                  </span>

                  <span className=" d-flex align-items-center gap-1 section__description">
                    <i
                      class="ri-building-2-line"
                      style={{ color: "#f9a826" }}></i>{" "}
                    {singleCarItem?.data?.car?.brand}
                  </span>
                </div>
              </div>
            </Col>

            <Col lg="7" className="mt-5">
              <div className="booking-info mt-5">
                <h5 className="mb-4 fw-bold ">Booking Information</h5>
                <Form onSubmit={submitHandler}>
                  <FormGroup className="booking__form d-inline-block me-4 mb-4">
                    <span style={{ fontWeight: "600" }}>Start Date</span>
                    <input
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      type="date"
                      placeholder="Start Date"
                      className="mt-2"
                    />
                  </FormGroup>
                  <FormGroup className="booking__form d-inline-block me-4 mb-4">
                    <span style={{ fontWeight: "600" }}>End Date</span>
                    <input
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      type="date"
                      placeholder="End Date"
                      className="mt-2"
                    />
                  </FormGroup>
                </Form>
              </div>
            </Col>

            <Col lg="5" className="mt-5">
              <div className="payment__info mt-5">
                <h5 className="mb-4 fw-bold ">Payment Information</h5>
                <div className="payment">
                  <label htmlFor="" className="d-flex align-items-center gap-2">
                    <input type="radio" /> Direct Bank Transfer
                  </label>
                </div>

                <div className="payment mt-3">
                  <label htmlFor="" className="d-flex align-items-center gap-2">
                    <input type="radio" /> Cheque Payment
                  </label>
                </div>

                <div className="payment mt-3 d-flex align-items-center justify-content-between">
                  <label htmlFor="" className="d-flex align-items-center gap-2">
                    <input type="radio" /> Master Card
                  </label>

                  <img src={masterCard} alt="" />
                </div>

                <div className="payment mt-3 d-flex align-items-center justify-content-between">
                  <label htmlFor="" className="d-flex align-items-center gap-2">
                    <input type="radio" /> Paypal
                  </label>

                  <img src={paypal} alt="" />
                </div>
                <div className="payment text-end mt-5">
                  <button type="button" onClick={submitHandler}>
                    Reserve Now
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <ModalContainer visible={showModal}>
        <Modal>
          <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
          <ModalTitle>Cannot Reserve In Guest Mode</ModalTitle>
          <ModalContent>
            <div>
              {!JSON.parse(token) && (
                <div className="d-flex flex-column">
                  <span>
                    You are currently accessing the website in guest mode. You
                    need to create an account to reserve the car.
                  </span>
                  <button
                    onClick={() => navigate("/auth")}
                    className="bg-primary py-2 px-4 mt-2"
                    style={{
                      border: "none",
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "600",
                      marginLeft: 16,
                    }}>
                    Click here to Login / Register
                  </button>
                </div>
              )}
              {!hasDoc && (
                <div>
                  <span>Looks like you have not uploaded your document.</span>
                  <button
                    onClick={() => navigate("/upload-doc", { showModal: true })}
                    className="bg-primary py-2 px-4"
                    style={{
                      border: "none",
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "600",
                      marginLeft: 16,
                    }}>
                    Click here to Upload Document
                  </button>
                </div>
              )}
            </div>
          </ModalContent>
        </Modal>
      </ModalContainer>
    </Helmet>
  );
};

export default CarDetails;
