import React from "react";

import {useAuthState} from "../context/auth";
import {Redirect, Route} from "react-router";

export default function DynamicRoute(props: any){
    const {user}: any = useAuthState()

    if (props.authenticated && !user) {
        return <Redirect to={'/login'}/>
    }else if (props.unauthenticated && user) {
        return <Redirect to={'/'}/>
    }else {
        return <Route component={props.component} {...props} />
    }
}