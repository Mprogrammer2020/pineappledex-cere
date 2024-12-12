
import { useState } from "react";
import { Accordion, Button, Col, Container, Dropdown, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";

const ErrorModals = ({ showError, setShowError, errorData }) => {
    return (
        <Modal show={showError} onHide={() => setShowError(false)} centered className="choose-token-popup success-popup error-popup">
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <div className="success-content">
                    <div className="success-tick">
                        <img src={require("../assets/images/error-image.png")} alt="img" />
                    </div>
                    <h5>Something went wrong</h5>
                    <div className="success-content-inner">
                        <p>Try increasing your slippage tolerance.
                           </p>
                    </div>
                    <div className="main-value-bottom error-info">
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    <p>
                                        <img className="me-2" src={require("../assets/images/error.svg").default} alt="img" />
                                        Error details
                                    </p>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="error-details-content">
                                        <p><strong>Error:</strong> <span> {errorData?.error}</span></p>
                                        <p><strong>Transaction Type:</strong>  <span>{errorData?.transactionType}</span></p>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>

                    <Button variant="unset" onClick={() => setShowError(false)}>
                        Dismiss
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ErrorModals;
