import { Toast } from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const toastMessageType = {
  success: "toast-message__bg--success",
  danger: "toast-message__bg--danger",
  orange: "toast-message__bg--orange",
};

export const ToastItem = ({ id, title, message, type, onClose }) => (
  <Toast onClose={onClose} delay={5000} autohide key={id}>
    <div className={["d-flex toast-message", toastMessageType[type]].join(" ")}>
      <div className="toast-message__toastIcon">
        <span
          className={["icon-toast-logo-bo", toastMessageType[type]].join(" ")}
        />
      </div>
      <div className="toast-message__content py-3">
        <div className="toast-message__content__text toast-message__content__text--title">
          {title}
        </div>
        <div className="toast-message__content__text toast-message__content__text--message">
          {message}
        </div>
      </div>
      <div
        className="toast-message__circleItem d-flex flex-column justify-content-around py-1"
        role="presentation"
        onClick={onClose}>
        <CountdownCircleTimer
          isPlaying
          duration={5}
          colors="#FFFFFF"
          trailColor="transparent"
          onComplete={() => [true, 1000]}
          size={25}
          strokeWidth={2}
          rotation="counterclockwise">
          <div className="text-sm mt-1">
            <span className="icon-times-solid" />
          </div>
        </CountdownCircleTimer>
      </div>
    </div>
  </Toast>
);
