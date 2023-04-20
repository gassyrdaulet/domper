import cl from "./MyModal.module.css";
import { useOutsideAlerter } from "../hooks/useOutsideAlerter";
import { useRef } from "react";

function MyModal({ children, setModalVisible, modalVisible }) {
  const modal = useRef(null);
  useOutsideAlerter(modal, setModalVisible);
  return (
    <div className={modalVisible ? cl.modalActive : cl.modal}>
      <div ref={modal} className={cl.modalView}>
        {children}
      </div>
    </div>
  );
}

export default MyModal;
