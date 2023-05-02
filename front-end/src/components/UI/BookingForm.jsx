import React, { useState } from "react";
import "../../styles/booking-form.css";
import { Form, FormGroup } from "reactstrap";

const BookingForm = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  console.log(startDate, endDate);

  const submitHandler = (event) => {
    event.preventDefault();
  };
  return (
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
  );
};

export default BookingForm;
