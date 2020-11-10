import React, {useState} from "react";
import {useHistory} from "react-router";
import {useLazyQuery, gql} from "@apollo/client";
import {Button, Col, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useAuthDispatch} from "../context/auth";

const LOGIN_USER = gql`
    query login(
        $username: String!
        $password: String!
    ) {
        login(
            username: $username
            password: $password
        ){
            username
            email
            createdAt
            token
        }
    }
`

export const Login = () => {
    const history = useHistory();

    const [variables, setVariables] = useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState<any>({});

    const dispatch: any = useAuthDispatch()

    const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
        onError(err) {
            if (err.graphQLErrors[0].extensions) {
                setErrors(err.graphQLErrors[0].extensions.errors);
            }
        },
        onCompleted(data){
            dispatch({type: 'LOGIN', payload: data.login})
            window.location.href = "/"
        }
    });

    const submitLoginForm = (event: any) => {
        event.preventDefault();

        console.log(variables);

        loginUser({ variables });
    };

    return (
        <Row className={"bg-white py-5 justify-content-center"}>
            <Col sm={8} md={6} lg={4}>
                <h1 className={"text-center"}>Login</h1>
                <Form onSubmit={submitLoginForm}>
                    <Form.Group>
                        <Form.Label className={errors?.username && "text-danger"}>
                            {errors?.username ?? "Username"}
                        </Form.Label>
                        <Form.Control
                            className={errors?.username && 'is-invalid'}
                            type="text"
                            value={variables.username}
                            onChange={(e) =>
                                setVariables({ ...variables, username: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className={errors?.password && "text-danger"}>
                            {errors?.password ?? "Password"}
                        </Form.Label>
                        <Form.Control
                            className={errors?.password && 'is-invalid'}
                            type="password"
                            value={variables.password}
                            onChange={(e) =>
                                setVariables({ ...variables, password: e.target.value })
                            }
                        />
                    </Form.Group>
                    <div className="text-center">
                        <Button variant="success" type="submit" disabled={loading}>
                            {loading ? "Loading registration..." : "Login"}
                        </Button>
                    </div>
                    <div>
                        <Link to={"/register"}>Register</Link>
                    </div>
                </Form>
            </Col>
        </Row>
    );
};