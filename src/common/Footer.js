import { useState } from "react";
import { Button, Col, Container, Form, Modal, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { pineappleDexService } from "../service/api.service";
import swal from 'sweetalert';

const Footer = ({ showSliceInsights }) => {
    const tooltip = (
        <Tooltip id="tooltip">
            The most recent block number on this network. Prices update on every block.
            {/* The most recent Unix timestamp on this network. */}
        </Tooltip>
    );
    let history = useNavigate();
    function ContactUs() {
        history("/contact-us");
    }
    const tooltipJuiced = (
        <Tooltip id="tooltip">
            The Pineapple Score and related data/analytics provided within Slice Insights are sourced from the Dextools API. This score evaluates coins based on trust and other metrics. Dextools retains all rights to the original data and metrics used in calculating the Pineapple Score.
        </Tooltip>
    );
    let data = JSON.parse(sessionStorage.getItem("sleepage"))
    const [showContact, setShowContact] = useState(false);
    const handleCloseContact = () => setShowContact(false);
    const handleShowContact = () => setShowContact(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value[0] === ' ') {
            // Prevent leading space
            setFormData({
                ...formData,
                [name]: value.trimStart()
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.name) newErrors.name = "Name is required.";
        if (!formData.email) newErrors.email = "Email is required.";
        if (!formData.subject) newErrors.subject = "Subject is required.";
        if (!formData.message) newErrors.message = "Message is required.";
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setErrors({});
            submitForm();
        }
    };

    const submitForm = async () => {
        saveContactusFeed()
    };

    async function saveContactusFeed() {
        try {
            const params = {
                name: formData?.name,
                email: formData?.email,
                subject: formData?.subject,
                message: formData.message
            }
            const response = await pineappleDexService.contactUs(params);
            if (response?.status === 200) {
                console.log("contactUs Deatil", response)
                swal({ icon: 'success', text: response?.data?.message, button: "OK" })
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
                setShowContact(false)
            }
        } catch (error) {
            console.log("error", error)
            errorSwal(error)

        }
    }
    function errorSwal(error) {
        console.log("error", error);
        if (error?.response?.status === 401) {
            swal({ icon: 'error', text: error?.response?.data?.message, button: "OK" }).then(() => {
                localStorage.clear();
                window.location.href = "/swap"

            });
        } else {
            swal({ icon: 'error', text: error?.response?.data?.message ? error?.response?.data?.message : error?.message, button: "OK" }).then(() => {
                console.log('OK button clicked after error alert');
            });
        }
    }

    return (
        <>
            <section className="footer">
                <Container fluid>
                    <Row className="align-items-end">
                        <Col sm={12} md={12} lg={3} xl={4}>
                            <div className="footer-left">
                                <h3>The Freshest<br /> <span>way to trade</span></h3>
                            </div>
                        </Col>
                        <Col className="col-12" sm={9} md={6} lg={6} xl={4}>

                            <div className="footer-mid">
                                <p>Do you need help before proceeding? <span>Click here</span></p>
                            </div>
                        </Col>
                        <Col className="col-12" sm={3} md={6} lg={3} xl={4}>
                            <div className="footer-right">
                                <p onClick={handleShowContact}>Contact Us</p>
                                <OverlayTrigger placement="top" overlay={tooltip}>
                                    {data?.lastSwap ? <p className="footer-end-content">{data?.lastSwap ? Math.floor(new Date(data?.lastSwap).getTime() / 1000) : ""} <div className="circle"></div></p> : <p></p>}
                                </OverlayTrigger>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* contact-us */}
            <Modal show={showContact} onHide={handleCloseContact} centered className="choose-token-popup contact-popup-area">
                <Modal.Header className="close-btn-bottom desktop" closeButton></Modal.Header>
                <Modal.Body>
                    <div className="contactus-inner">
                        <h2>Contact Us</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Name"
                                    name="name"
                                    value={formData.name}
                                    maxLength={50}
                                    onChange={handleChange}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicSubject">
                                <Form.Label>Subject</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Subject"
                                    name="subject"
                                    value={formData.subject}
                                    maxLength={100}
                                    onChange={handleChange}
                                    isInvalid={!!errors.subject}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.subject}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicMessage">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter Message"
                                    name="message"
                                    value={formData.message}
                                    maxLength={500}
                                    onChange={handleChange}
                                    isInvalid={!!errors.message}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Header className="close-btn-bottom mobile" closeButton></Modal.Header>
            </Modal>
        </>
    )
};
export default Footer