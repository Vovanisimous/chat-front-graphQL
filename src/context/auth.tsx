import React, {createContext, useReducer, useContext, Dispatch, FC} from "react";
import jwtDecode from 'jwt-decode'
import {IUser} from "../entity/User";

const AuthStateContext = createContext({
    user: {
        username: "",
        email: "",
        createdAt: "",
        token: "",
        latestMessage: {
            uuid: "",
            content: "",
            from: "",
            to: "",
            createdAt: "",
        },
        imageUrl: "",
    }
})

let user: IUser | null = null

const token = localStorage.getItem('token');

if(token){
    const decodedToken: any = jwtDecode(token)
    const expiresAt = new Date(decodedToken.exp * 1000)

    if (new Date() > expiresAt) {
        localStorage.removeItem('token')
    }else {
        user = decodedToken;
    }
}else console.log('No token found')

const authReducer = (state: any, action: any) => {
    switch(action.type){
        case 'LOGIN':
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            localStorage.removeItem('token')
            return  {
                ...state,
                user: null
            }
        default:
            throw new Error(`Unknown action type ${action.type}`)
    }
}

const AuthDispatchContext = createContext<Dispatch<{ type: string, payload: any }>>(() => {})

export const AuthProvider: FC = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {user})

    return (
        <AuthDispatchContext.Provider value={dispatch}>
            <AuthStateContext.Provider value={state}>
                {children}
            </AuthStateContext.Provider>
        </AuthDispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(AuthStateContext)
export const useAuthDispatch = () => useContext(AuthDispatchContext)


