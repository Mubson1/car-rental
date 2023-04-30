import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Modal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import { useUploadDocument } from "../../pages/AuthPages/api";
import { SpinnerComponent } from "./Spinner";
import useToken from "../../helper/useToken";

Modal.setAppElement("#root");

const PopupModal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useToken();

  const { mutate: uploadDocument, isLoading: uploadingDocument } =
    useUploadDocument();

  const [file, setFile] = useState();
  const [showModal, setShowModal] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleDocUpload = (event) => {
    event.preventDefault();
    if (JSON.parse(token)) {
      const formData = new FormData();
      formData.append("UserId", JSON.parse(token)?.user?.id);
      formData.append("Document", file);
      formData.append("DocType", selectedOption);
      console.log(formData);
      uploadDocument(
        // {
        //   UserId: JSON.parse(token).user.id,
        //   Document: file,
        //   DocType: selectedOption,
        // },

        formData,
        {
          onSuccess: () => {
            navigate(-1);
          },
        }
      );
    }
  };

  const onClose = () => {
    navigate(-1);
    setShowModal(false);
  };

  if (uploadingDocument) return <SpinnerComponent />;

  return (
    <Modal
      style={{ height: 300, width: 600 }}
      isOpen={showModal}
      onRequestClose={onClose}>
      <form onSubmit={handleDocUpload}>
        <h2>Upload Your Document</h2>
        <Row className="mt-4">
          <Col sm={10} md={4} className="mb-sm-4 border-end border-2">
            <div className="d-flex flex-column">
              <span className="h5">Select Document Type</span>
              <select
                className="py-1 px-2"
                id="dropdown"
                value={selectedOption}
                onChange={handleOptionChange}>
                <option>--Select--</option>
                <option value="license">License</option>
                <option value="citizenship">Citizenship</option>
              </select>
            </div>
            <div className="mt-4">
              <label
                className="h5"
                htmlFor="file"
                style={{
                  cursor: "pointer",
                  color: "teal",
                  marginBottom: 14,
                }}>
                Click To Select Image
              </label>
              <input
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
                type="file"
                id="file"
                style={{
                  display: "none",
                  backgroundColor: "red",
                }}
              />
            </div>

            <div className="mt-2">
              <button
                type="submit"
                className="bg-secondary py-2 px-4"
                style={{
                  border: "none",
                  borderRadius: 20,
                  color: "white",
                  fontWeight: "600",
                  marginRight: 16,
                }}>
                Upload
              </button>
              <button
                type="button"
                className="bg-danger py-2 px-4"
                style={{
                  border: "none",
                  borderRadius: 20,
                  color: "white",
                  fontWeight: "600",
                }}
                onClick={onClose}>
                Cancel
              </button>
            </div>
          </Col>
          <Col sm={10} md={8}>
            <img
              style={{ objectFit: "fill", height: "70vh" }}
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://media.istockphoto.com/vectors/default-image-icon-vector-missing-picture-page-for-website-design-or-vector-id1357365823?k=20&m=1357365823&s=612x612&w=0&h=ZH0MQpeUoSHM3G2AWzc8KkGYRg4uP_kuu0Za8GFxdFc="
              }
              alt=""
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

export default PopupModal;
