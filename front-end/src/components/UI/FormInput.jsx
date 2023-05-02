import React from "react";

const FormInput = (props) => {
  const { placeholder, error, label, isTextArea, className } = props;
  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", marginBottom: 24 }}>
      {/* <div style={{ flexDirection: "row", justifyContent: "space-between" }}> */}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "gray",
            marginBottom: 8,
          }}>
          {label}
        </span>
        {error ? (
          <span style={{ color: "red", fontSize: 16 }}>{error}</span>
        ) : null}
      </div>
      {/* </div> */}
      {isTextArea ? (
        <textarea
          {...props}
          placeholder={placeholder}
          style={{
            backgroundColor: "#b7ffe913",
            padding: 8,
            borderColor: "gray",
            borderWidth: 0.5,
            borderRadius: 5,
            color: "black",
          }}
        />
      ) : (
        <input
          {...props}
          placeholder={placeholder}
          style={{
            backgroundColor: "#b7ffe913",
            padding: 8,
            borderColor: "gray",
            borderWidth: 0.5,
            borderRadius: 5,
            color: "black",
          }}
        />
      )}
    </div>
  );
};

export default FormInput;
