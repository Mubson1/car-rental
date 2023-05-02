import Spinner, { SpinnerProps } from "react-bootstrap/Spinner";

export const SpinnerComponent = (props) => {
  const { ...rest } = props;
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ width: "100%", height: "100vh" }}>
      <div aria-label="loader">
        <Spinner {...rest} />
      </div>
    </div>
  );
};

SpinnerComponent.defaultProps = {
  animation: "border",
  variant: "primary",
};
