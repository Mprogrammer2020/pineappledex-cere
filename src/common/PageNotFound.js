import { Button, Col, Container, Row } from "react-bootstrap";

export function PageNotFound() {
  return (
    <>
      <div className="error-page">
          <Container>
            <Row className="justify-content-center">
            <Col md={7} lg={5}>
              <div className="no-found">
                <img src={require("../assets/images/error.png")} alt="img" />
                <h2>Page not found</h2>
                <p className="text-center">
                  We're sorry, the page you requested could not be found. Please
                  go back to the home page.
                </p>
                <Button type="button" variant="unset" onClick={(e) => window.location.href="/swap"}>Go Back</Button>
              </div>
            </Col>
            </Row>
            </Container>
      </div>
    </>
  );
}
export default PageNotFound;
