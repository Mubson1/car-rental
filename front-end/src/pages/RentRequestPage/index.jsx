import React, { useEffect, useState } from "react";
import Helmet from "../../components/Helmet/Helmet";
import CommonSection from "../../components/UI/CommonSection";
import AboutSection from "../../components/UI/AboutSection";
import {
  ModalContainer,
  Wrapper,
  CloseButton,
  Modal,
  ModalContent,
  ModalTitle,
  TextAreaContainer,
  TextAreaLabel,
  TextAreaStyled,
} from "./Component";
import { Card } from "react-bootstrap";
import {
  useCancelRentRequest,
  useGetRentalHistory,
  usePostDamageRequest,
} from "./api";
import useToken from "../../helper/useToken";
import { SpinnerComponent } from "../../components/UI/Spinner";
import axios from "axios";
import "../../styles/common-section.css";

// const request = [
//   {
//     Id: "934343",
//     StartDate: "3rd Jun, 2022",
//     EndDate: "3rd Jul 2022",
//     RequestStatus: "Pending",
//     NotificationStatus: "",
//     TotalCharge: "Rs 2000",
//     CustomerId: "",
//     CheckedBy: "",
//     CarId: "9849392223",
//   },
//   {
//     Id: "2349823",
//     StartDate: "3rd Jun, 2022",
//     EndDate: "3rd Jul 2022",
//     RequestStatus: "Approved",
//     NotificationStatus: "",
//     TotalCharge: "Rs 2000",
//     CustomerId: "",
//     CheckedBy: "Test Staff",
//     CarId: "243284234",
//   },
// ];

const MyRequest = () => {
  const [token, setToken] = useToken();

  const { data: request, isLoading: requestLoading } = useGetRentalHistory(
    JSON.parse(token)?.user?.id
  );
  const { mutate: requestDamage, isLoading: requestingDamage } =
    usePostDamageRequest();
  const { mutate: cancelRent, isLoading: cancelRentLoading } =
    useCancelRentRequest();

  const [mainRequest, setMainRequest] = useState([]);
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [damageDesc, setDamageDesc] = useState("");

  const handleModalOpen = () => {
    setShowDamageModal(true);
  };

  const handleModalClose = () => {
    setShowDamageModal(false);
  };

  useEffect(() => {
    if (request?.data?.history) {
      setMainRequest(request?.data?.history[0]);
    }
  }, [request]);

  if (requestLoading) return <SpinnerComponent />;

  return (
    <>
      <Helmet title="About">
        <CommonSection title="My Requests" />
        <Wrapper>
          <div className="grid grid-four-column">
            {request?.data?.history?.map((curElm, index) => {
              return (
                <Card
                  key={index}
                  className={
                    curElm?.id === mainRequest?.id
                      ? "bg-info formContainer"
                      : "formContainer"
                  }
                  style={{ cursor: "pointer", marginBottom: 12 }}
                  onClick={() => setMainRequest(curElm)}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <div className="d-flex" style={{ alignItems: "center" }}>
                      <div>
                        <img
                          src={curElm?.car?.image}
                          alt=""
                          style={{
                            width: 100,
                            height: 100,
                            marginRight: 20,
                            borderRadius: 100,
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-black">
                          {curElm?.car?.name}
                        </h4>
                        <span className="text-secondary text-xs">
                          {curElm?.startDate} - {curElm?.endDate}
                        </span>
                      </div>
                    </div>
                    <i
                      class="ri-arrow-drop-right-line"
                      style={{ fontSize: 20 }}
                    />
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="main-screen">
            <Card
              className="w-full px-4 py-4 formContainer"
              style={{ height: 420 }}>
              <div className="d-flex align-items-center">
                <img
                  src={mainRequest?.car?.image}
                  alt="car"
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 100,
                    objectFit: "cover",
                    marginRight: 20,
                  }}
                />
                <div>
                  <h1>{mainRequest?.car?.name}</h1>
                  <span>{mainRequest?.car?.brand}</span>
                  <div>
                    <span style={{ fontWeight: "300" }}>
                      Status: {mainRequest?.requestStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <span style={{ fontSize: 18, fontWeight: "600" }}>
                  Request Date
                </span>
                <div className="d-flex flex-column mt-2">
                  <span style={{ fontWeight: "400" }}>
                    Start Date: {mainRequest?.startDate}
                  </span>
                  <span style={{ fontWeight: "400" }}>
                    End Date: {mainRequest?.endDate}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="d-flex justify-content-between">
                  <span style={{ fontSize: 18, fontWeight: "600" }}>
                    Total Charge
                  </span>
                  <span style={{ fontSize: 18, fontWeight: "600" }}>
                    {mainRequest?.totalCharge}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ fontSize: 18, fontWeight: "600" }}>
                    Approved By
                  </span>
                  <span style={{ fontSize: 18, fontWeight: "600" }}>
                    {mainRequest?.authorizedBy?.name || "N/A"}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                {(mainRequest?.requestStatus === "Approved" ||
                  mainRequest?.requestStatus === "Pending") && (
                  <button
                    onClick={() => cancelRent(mainRequest?.id)}
                    className="bg-danger py-2 px-4"
                    style={{
                      border: "none",
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "600",
                      marginRight: 16,
                    }}>
                    {cancelRentLoading ? "Loading..." : "Cancel Request"}
                  </button>
                )}
                {mainRequest?.requestStatus === "Paid" && (
                  <button
                    onClick={handleModalOpen}
                    className="bg-warning py-2 px-4"
                    style={{
                      border: "none",
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "600",
                    }}>
                    Damage Request
                  </button>
                )}
              </div>
            </Card>
          </div>
        </Wrapper>
      </Helmet>
      <ModalContainer visible={showDamageModal}>
        <Modal>
          <CloseButton onClick={handleModalClose}>&times;</CloseButton>
          <ModalTitle>Request Damage</ModalTitle>
          <ModalContent>
            <TextAreaContainer>
              <TextAreaStyled
                placeholder="Describe the damage done..."
                onChange={(e) => setDamageDesc(e.target.value)}
                value={damageDesc}
              />
            </TextAreaContainer>
            <button
              onClick={() =>
                requestDamage(
                  {
                    damageDescription: damageDesc,
                    rentalId: mainRequest?.id,
                  },
                  {
                    onSuccess: () => {
                      setDamageDesc("");
                      setShowDamageModal(false);
                    },
                  }
                )
              }
              className="bg-primary py-2 px-4"
              style={{
                border: "none",
                borderRadius: 20,
                color: "white",
                fontWeight: "600",
              }}>
              {requestLoading ? "Loading..." : "Confirm"}
            </button>
          </ModalContent>
        </Modal>
      </ModalContainer>
    </>
  );
};

export default MyRequest;
