import { ReactNode } from "react";
import { Offcanvas } from "react-bootstrap";

interface drawerProps {
  title: string;
  show: boolean;
  handleClose: () => void;
  children: ReactNode;
}

const Drawer = ({ title, show, handleClose, children }: drawerProps) => {
  return (
    <Offcanvas show={show} onHide={handleClose}>
      <Offcanvas.Header closeButton>
      <Offcanvas.Title>{ title }</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        { children }
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Drawer;