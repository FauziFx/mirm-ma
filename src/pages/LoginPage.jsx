import React from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

function LoginPage() {
  return (
    <section className="h-100">
      <Container className="h-100">
        <Row className="justify-content-sm-center h-100">
          <Col sm={9} md={7} lg={5} xl={5} xxl={4}>
            <div className="text-center my-5">
              <img src="/public/header.png" alt="" className="img-fluid" />
            </div>
            <Card className="shadow-lg">
              <Card.Body className="p-5">
                <h1 className="fs-4 card-title fw-bold mb-4">Please Login</h1>
                <Form autoComplete="off">
                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      name="email"
                      required
                      autoFocus
                      placeholder="Email"
                    />
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 w-100">
                      <label className="text-muted" htmlFor="password">
                        Password
                      </label>
                    </div>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      name="password"
                      required
                      placeholder="******"
                    />
                  </div>

                  <div className="d-flex align-items-center">
                    <input type="submit" className="btn btn-indigo ms-auto" />
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <div className="text-center mt-5 text-muted">
              Copyright &copy; 2024 Murti Aji
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default LoginPage;
