import React from "react";

import HeroSlider from "../components/UI/HeroSlider";
import Helmet from "../components/Helmet/Helmet";

import { Container, Row, Col } from "reactstrap";
import FindCarForm from "../components/UI/FindCarForm";
import AboutSection from "../components/UI/AboutSection";
import ServicesList from "../components/UI/ServicesList";
import carData from "../assets/data/carData";
import CarItem from "../components/UI/CarItem";
import BecomeDriverSection from "../components/UI/BecomeDriverSection";
import Testimonial from "../components/UI/Testimonial";
import { useGetOffers } from "./AuthPages/api";
import { SpinnerComponent } from "../components/UI/Spinner";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const { data: offers, isLoading: loadingOffer } = useGetOffers();

  const validOffer = offers?.data?.offer?.filter((offer) => {
    const startDate = new Date(offer.startDate);
    const endDate = new Date(offer.endDate);
    const currentDate = new Date();

    return startDate <= currentDate && endDate >= currentDate;
  });

  if (loadingOffer) return <SpinnerComponent />;

  return (
    <Helmet title="Home">
      {/* ============= hero section =========== */}
      <section className="p-0 hero__slider-section">
        <HeroSlider />

        <div className="hero__form">
          <Container>
            <Row className="form__row">
              <Col lg="4" md="4">
                <div className="find__cars-left">
                  <h2>Find your best car here</h2>
                </div>
              </Col>

              <Col lg="8" md="8" sm="12">
                <FindCarForm />
              </Col>
            </Row>
          </Container>
        </div>
      </section>
      {/* =========== about section ================ */}
      <AboutSection />
      {/* ========== services section ============ */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5 text-center">
              <h6 className="section__subtitle">See our</h6>
              <h2 className="section__title">Popular Services</h2>
            </Col>

            <ServicesList />
          </Row>
        </Container>
      </section>
      {/* =========== car offer section ============= */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h6 className="section__subtitle">Come with</h6>
              <h2 className="section__title">Hot Offers</h2>
            </Col>

            {validOffer?.slice(0, 6)?.map((item) => {
              const date1 = new Date(item?.endDate);
              const date2 = new Date();

              const differenceInMs = date1 - date2;

              // Convert the difference to the desired unit of time
              const differenceInDays = Math.floor(
                differenceInMs / (1000 * 60 * 60 * 24)
              );

              return (
                <Col lg="4" md="4" sm="6" className="mb-5" key={item?.id}>
                  <div className="car__item">
                    <div className="car__img">
                      <img src={item?.carImage} alt="" className="w-100" />
                    </div>

                    <div className="car__item-content mt-4">
                      <h4 className="section__title text-center">
                        {item?.carName}
                      </h4>
                      <h6 className="rent__price text-center mt-">
                        Rs{item?.rentRate} <span>/ Day</span>
                      </h6>

                      <div className="car__item-info d-flex align-items-center justify-content-between mt-3 mb-4">
                        <span className=" d-flex align-items-center gap-1">
                          <i class="ri-car-line"></i> {item?.carStatus}
                        </span>
                        <span className=" d-flex align-items-center gap-1">
                          <i class="ri-settings-2-line"></i> {item?.discount} %
                        </span>
                        <span className=" d-flex align-items-center gap-1">
                          <i class="ri-timer-flash-line"></i> {differenceInDays}
                          days
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/cars/${item?.carId}`)}
                        className=" w-100 car__item-btn car__btn-details">
                        <Link>Details</Link>
                      </button>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>
      {/* =========== become a driver section ============ */}
      <BecomeDriverSection />

      {/* =========== testimonial section =========== */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-4 text-center">
              <h6 className="section__subtitle">Our clients says</h6>
              <h2 className="section__title">Testimonials</h2>
            </Col>

            <Testimonial />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Home;
