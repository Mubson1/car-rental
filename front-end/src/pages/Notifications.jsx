import React from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { useGetNotifications } from "./RentRequestPage/api";
import useToken from "../helper/useToken";
import { SpinnerComponent } from "../components/UI/Spinner";
import "../styles/common-section.css";

const Notifications = () => {
  const [token, setToken] = useToken();
  const { data: notifications, isLoading: gettingNotifications } =
    useGetNotifications(JSON.parse(token)?.user?.id);
  console.log(notifications?.data?.history?.length);

  if (gettingNotifications) return <SpinnerComponent />;
  return (
    <Helmet title="Notifications">
      <CommonSection title="Notifications" />
      <section style={{ paddingRight: 250, paddingLeft: 250 }}>
        <span
          style={{
            color: "GrayText",
            fontSize: 20,
            fontWeight: "bold",
          }}>
          Notifications Lists
        </span>
        {notifications?.data?.history?.length === 0 ? (
          <div
            style={{
              width: "full",
              textAlign: "center",
            }}>
            <span
              style={{
                color: "GrayText",
                fontSize: 18,
                fontWeight: 500,
              }}>
              No Current Notifications
            </span>
          </div>
        ) : (
          notifications?.data?.history?.map((notification) => (
            <div className="formContainer">
              <span
                style={{ color: "GrayText", fontWeight: "bold", fontSize: 18 }}>
                Your rent request of car {notification?.car?.name} from
                {notification?.startDate} till {notification?.endDate} has been
                accepted for Rs. {notification?.totalCharge}.
              </span>
              <div
                style={{
                  fontSize: 16,
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 6,
                }}>
                <span>Authorized By: {notification?.authorizedBy?.name}</span>
              </div>
            </div>
          ))
        )}
      </section>
    </Helmet>
  );
};

export default Notifications;
