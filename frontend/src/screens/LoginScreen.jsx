import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Col, Form, Navbar, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("submit");
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="light" className="mt-2">
          Sign In
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          <Navbar.Text>
            Don't have an account? <Link to="/register"> Register</Link>
          </Navbar.Text>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
