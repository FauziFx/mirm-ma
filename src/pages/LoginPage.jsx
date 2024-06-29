import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import useDocumentTitle from "../utils/useDocumentTitle";

function LoginPage() {
  useDocumentTitle("Login");
  const API_URL = import.meta.env.VITE_API_URL;
  const [isError, setIsError] = useState("");
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [dataLogin, setDataLogin] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setDataLogin((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL + "login", {
        username: dataLogin.username,
        password: dataLogin.password,
      });
      if (response.data.success) {
        const token = response.data.token;
        cookies.set("rm-ma-token", token, {
          maxAge: 2628000,
        });
        setTimeout(() => {
          window.location.replace("/");
        }, 500);
      } else {
        setIsError(response.data.message);
        setTimeout(() => {
          setIsError("");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const cookies = new Cookies();
    const userToken = cookies.get("rm-ma-token");
    if (userToken) {
      return navigate("/");
    }
  }, []);

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
                {isError && (
                  <Alert variant="danger" className="py-2">
                    <FontAwesomeIcon
                      icon={faCircleExclamation}
                      className="me-1"
                    />
                    {isError}
                  </Alert>
                )}
                <h1 className="fs-4 card-title fw-bold mb-4">Please Login</h1>
                <Form autoComplete="off" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <Form.Control
                      autoComplete="off"
                      id="email"
                      type="email"
                      name="username"
                      placeholder="email@domain.com"
                      value={dataLogin.username}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div className="mb-3">
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Form.Control
                      autoComplete="off"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="*****"
                      value={dataLogin.password}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>

                  <div className="d-flex align-items-center">
                    <input
                      type="submit"
                      className="btn btn-indigo ms-auto w-100"
                      value="Login"
                      disabled={
                        dataLogin.username.length == 0 ||
                        dataLogin.password.length == 0
                      }
                    />
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
