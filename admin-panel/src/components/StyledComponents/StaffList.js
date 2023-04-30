import styled from "styled-components";

export const Wrapper = styled.section`
  display: grid;
  grid-template-columns: 0.4fr 1fr;
  padding: 0px 100px 50px 100px;
  gap: 1rem;
  .grid {
    width: 100%;
    gap: 1rem;
    /* order: 2; */
    img {
      max-width: 100%;
      max-height: 100%;
      background-size: cover;
      object-fit: contain;
      cursor: pointer;
      box-shadow: ${({ theme }) => theme.colors.shadow};
    }
  }
  .main-screen {
    background-color: #181b3a;

    display: grid;
    order: 1;
    img {
      max-width: 100%;
      height: auto;
      box-shadow: ${({ theme }) => theme.colors.shadow};
    }
  }
  .grid-four-column {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }
  .grid-content {
    background-color: #181b3a;
    padding: 10px 20px;
    border-radius: 5px;
    transition: background-color 0.2s ease-in-out;
    width: 100%;

    &:hover {
      background-color: #aaa;
    }

    &:active {
      background-color: #aaa;
    }
  }
  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    display: flex;
    flex-direction: column;
    order: 1;
    .grid-four-column {
      grid-template-rows: 1fr;
      grid-template-columns: repeat(4, 1fr);
    }
  }
`;

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

export const TextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const TextAreaLabel = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const TextAreaStyled = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 2px solid #ccc;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;
