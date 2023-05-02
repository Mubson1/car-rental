import React from "react";
import Slider from "react-slick";

import "../../styles/testimonial.css";

import ava01 from "../../assets/all-images/ava-1.jpg";
import ava02 from "../../assets/all-images/ava-2.jpg";
import ava03 from "../../assets/all-images/ava-3.jpg";
import ava04 from "../../assets/all-images/ava-4.jpg";

const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      <div className="testimonial py-4 px-3">
        <p className="section__description">
          I recently used this car rental app for a weekend getaway and I was
          blown away by how easy it was to use. The app was user-friendly, and I
          was able to find the perfect car for my trip within minutes. The
          customer service was also excellent, and the team was very helpful
          when I had a question. Overall, a fantastic experience, and I will
          definitely be using this app again in the future.
        </p>

        <div className="mt-3 d-flex align-items-center gap-4">
          <img src={ava01} alt="" className="w-25 h-25 rounded-2" />

          <div>
            <h6 className="mb-0 mt-3">Ram Kumar</h6>
            <p className="section__description">Customer</p>
          </div>
        </div>
      </div>

      <div className="testimonial py-4 px-3">
        <p className="section__description">
          I had a great experience using this car rental app. The selection of
          cars was impressive, and I was able to find exactly what I needed for
          my business trip. The app was also very easy to use, and I appreciated
          the clear instructions and helpful tips throughout the booking
          process. The pickup and drop-off process were smooth, and the staff
          was very friendly and professional. Highly recommend!
        </p>

        <div className="mt-3 d-flex align-items-center gap-4">
          <img src={ava02} alt="" className="w-25 h-25 rounded-2" />

          <div>
            <h6 className="mb-0 mt-3">Hari Bahadur</h6>
            <p className="section__description">Customer</p>
          </div>
        </div>
      </div>

      <div className="testimonial py-4 px-3">
        <p className="section__description">
          I was a bit hesitant to use this car rental app at first, but I'm so
          glad I did. The app was incredibly user-friendly, and I was able to
          easily compare prices and features of different cars. The rental
          process was seamless, and the car was in excellent condition when I
          picked it up. I also appreciated the 24/7 customer service, which was
          very helpful when I had a question about extending my rental. Overall,
          a great experience!
        </p>

        <div className="mt-3 d-flex align-items-center gap-4">
          <img src={ava03} alt="" className="w-25 h-25 rounded-2" />

          <div>
            <h6 className="mb-0 mt-3">Shyam Poudel</h6>
            <p className="section__description">Customer</p>
          </div>
        </div>
      </div>

      <div className="testimonial py-4 px-3">
        <p className="section__description">
          I've used many car rental apps in the past, but this one is by far the
          best. The app is intuitive and easy to use, and the selection of cars
          is excellent. The customer service team was also very responsive and
          helpful, and I appreciated the ability to modify my reservation on the
          go. The pickup and drop-off process were straightforward, and the car
          was in great condition. Highly recommend this app to anyone looking
          for a reliable and hassle-free car rental experience.
        </p>

        <div className="mt-3 d-flex align-items-center gap-4">
          <img src={ava04} alt="" className="w-25 h-25 rounded-2" />

          <div>
            <h6 className="mb-0 mt-3">Ikku Pitang</h6>
            <p className="section__description">Customer</p>
          </div>
        </div>
      </div>
    </Slider>
  );
};

export default Testimonial;
