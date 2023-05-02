import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../../components/Helmet/Helmet";
import CommonSection from "../../components/UI/CommonSection";
import CarItem from "../../components/UI/CarItem";
import carData from "../../assets/data/carData";
import { useGetCars } from "./api";
import { SpinnerComponent } from "../../components/UI/Spinner";

const CarListing = () => {
  const { data: carLists, isLoading: carListLoading } = useGetCars();

  const [selectedOption, setSelectedOption] = useState("");
  const [sortedCar, setSortedCar] = useState(carLists?.data?.cars);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    if (selectedOption === "high") {
      setSortedCar(
        carLists?.data?.cars?.sort((a, b) => a.ratePerDay - b.ratePerDay)
      );
    } else if (selectedOption === "low") {
      setSortedCar(
        carLists?.data?.cars?.sort((a, b) => b.ratePerDay - a.ratePerDay)
      );
    } else {
      setSortedCar(carLists?.data?.cars);
    }
  }, [selectedOption, carLists]);

  if (carListLoading) return <SpinnerComponent />;
  return (
    <Helmet title="Cars">
      <CommonSection title="Car Listing" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className=" d-flex align-items-center gap-3 mb-5">
                <span className=" d-flex align-items-center gap-2">
                  <i class="ri-sort-asc"></i> Sort By
                </span>

                <select
                  id="dropdown"
                  value={selectedOption}
                  onChange={handleOptionChange}>
                  <option>--Select--</option>
                  <option value="low">Low to High</option>
                  <option value="high">High to Low</option>
                </select>
              </div>
            </Col>

            {sortedCar?.map((item) => (
              <CarItem item={item} key={item.id} />
            ))}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default CarListing;
