import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { ApolloProvider } from "./ApolloProvider";

import "./App.scss";
import { Register } from "./pages/Register";
import { Main } from "./pages/main/Main";
import { Login } from "./pages/Login";
import DynamicRoute from "./util/DinamicRoute";

import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";

function App() {
    return (
        <ApolloProvider>
            <AuthProvider>
                <MessageProvider>
                    <BrowserRouter>
                        <Container className={"p-5"}>
                            <Switch>
                                <DynamicRoute exact path={"/"} component={Main} authenticated />
                                <DynamicRoute
                                    exact
                                    path={"/register"}
                                    component={Register}
                                    unauthenticated
                                />
                                <DynamicRoute
                                    exact
                                    path={"/login"}
                                    component={Login}
                                    unauthenticated
                                />
                            </Switch>
                        </Container>
                    </BrowserRouter>
                </MessageProvider>
            </AuthProvider>
        </ApolloProvider>
    );
}

export default App;
