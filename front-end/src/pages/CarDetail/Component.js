import styled from "styled-components";

export const ModalContainer = styled.div`
  display: ${(props) => (props.visible ? "flex" : "none")};
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
`;

export const Modal = styled.div`
  background-color: #fefefe;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

export const ModalContent = styled.p`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
`;

export const CloseButton = styled.span`
  color: #aaaaaa;
  float: right;
  position: relative;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
`;
