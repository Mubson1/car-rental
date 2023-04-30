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
import { useGetRentalHistory } from "./api";
import useToken from "../../helper/useToken";
import { SpinnerComponent } from "../../components/UI/Spinner";
import axios from "axios";

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

const MyRequest = async () => {
  const [token, setToken] = useToken();

  const { data: request, isLoading: requestLoading } = useGetRentalHistory(
    JSON.parse(token)?.user?.id.toString()
  );

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
    if (request) {
      setMainRequest(request[0]);
    }
  }, [request]);

  if (requestLoading) return <SpinnerComponent />;

  return (
    <>
      <Helmet title="About">
        <CommonSection title="My Requests" />
        <Wrapper>
          <div className="grid grid-four-column">
            {request?.map((curElm, index) => {
              return (
                <Card
                  key={index}
                  className={[
                    "w-full h-4 px-4 py-1 mb-3 grid-content",
                    curElm?.Id === mainRequest?.Id && "bg-info",
                  ]}
                  style={{ cursor: "pointer" }}
                  onClick={() => setMainRequest(curElm)}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <div>
                      <h3>{curElm?.CarId}</h3>
                      <span>
                        {curElm?.StartDate} - {curElm?.EndDate}
                      </span>
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
            <Card className="w-full px-4 py-4">
              <div className="d-flex align-items-center">
                <img
                  src="https://hips.hearstapps.com/hmg-prod/images/2023-mclaren-artura-101-1655218102.jpg?crop=1.00xw:0.847xh;0,0.153xh&resize=1200:*"
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 100,
                    objectFit: "cover",
                    marginRight: 20,
                  }}
                />
                <div>
                  <h1>Car Name</h1>
                  <span>{mainRequest?.CarId}</span>
                  <div>
                    <span style={{ fontWeight: "300" }}>
                      Status: {mainRequest?.RequestStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <span style={{ fontSize: 18, fontWeight: "600" }}>
                  Request Date
                </span>
                <div className="d-flex flex-column mt-2">
                  <span style={{ fontWeight: "300" }}>
                    Start Date: {mainRequest?.StartDate}
                  </span>
                  <span style={{ fontWeight: "300" }}>
                    End Date: {mainRequest?.EndDate}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="d-flex justify-content-between">
                  <span style={{ fontSize: 18, fontWeight: "600" }}>
                    Total Charge
                  </span>
                  <span style={{ fontSize: 18, fontWeight: "600" }}>
                    {mainRequest?.TotalCharge}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ fontSize: 18, fontWeight: "600" }}>
                    Approved By
                  </span>
                  <span style={{ fontSize: 18, fontWeight: "600" }}>
                    {mainRequest?.CheckedBy || "N/A"}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <button
                  className="bg-danger py-2 px-4"
                  style={{
                    border: "none",
                    borderRadius: 20,
                    color: "white",
                    fontWeight: "600",
                  }}>
                  Cancel Request
                </button>
                {mainRequest?.CheckedBy && (
                  <button
                    onClick={handleModalOpen}
                    className="bg-warning py-2 px-4"
                    style={{
                      border: "none",
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "600",
                      marginLeft: 16,
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
          </ModalContent>
        </Modal>
      </ModalContainer>
    </>
  );
};

export default MyRequest;
