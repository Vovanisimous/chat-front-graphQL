import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import {useHistory} from "react-router";
import {Link} from "react-router-dom";

const REGISTER_USER = gql`
    mutation Register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            username: $username
            email: $email
            password: $password
            confirmPassword: $confirmPassword
        ) {
            username
            email
            createdAt
        }
    }
`;

export const Register = () => {
    const history = useHistory();

    const [variables, setVariables] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<any>({});

    const [register, { loading }] = useMutation(REGISTER_USER, {
        update(_, __) {
            history.push('login')
        },
        onError(err) {
            if (err.graphQLErrors[0].extensions) {
                setErrors(err.graphQLErrors[0].extensions.errors);
            }
        },
    });

    const submitRegisterForm = (event: any) => {
        event.preventDefault();

        console.log(variables);

        register({ variables });
    };

    return (
        <Row className={"bg-white py-5 justify-content-center"}>
            <Col sm={8} md={6} lg={4}>
                <h1 className={"text-center"}>Register</h1>
                <Form onSubmit={submitRegisterForm}>
                    <Form.Group>
                        <Form.Label className={errors.email && "text-danger"}>
                            {errors.email ?? "Email address"}
                        </Form.Label>
                        <Form.Control
                            className={errors.email && 'is-invalid'}
                            type="email"
                            value={variables.email}
                            onChange={(e) => setVariables({ ...variables, email: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className={errors.username && "text-danger"}>
                            {errors.username ?? "Username"}
                        </Form.Label>
                        <Form.Control
                            className={errors.username && 'is-invalid'}
                            type="text"
                            value={variables.username}
                            onChange={(e) =>
                                setVariables({ ...variables, username: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className={errors.password && "text-danger"}>
                            {errors.password ?? "Password"}
                        </Form.Label>
                        <Form.Control
                            className={errors.password && 'is-invalid'}
                            type="password"
                            value={variables.password}
                            onChange={(e) =>
                                setVariables({ ...variables, password: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className={errors.confirmPassword && "text-danger"}>
                            {errors.confirmPassword ?? "Confirm password"}
                        </Form.Label>
                        <Form.Control
                            className={errors.confirmPassword && 'is-invalid'}
                            type="password"
                            value={variables.confirmPassword}
                            onChange={(e) =>
                                setVariables({ ...variables, confirmPassword: e.target.value })
                            }
                        />
                    </Form.Group>
                    <div className="text-center">
                        <Button variant="success" type="submit" disabled={loading}>
                            {loading ? "Loading registration..." : "Register"}
                        </Button>
                    </div>
                    <div>
                        <Link to={"/login"}>Login</Link>
                    </div>
                </Form>
            </Col>
        </Row>
    );
};
