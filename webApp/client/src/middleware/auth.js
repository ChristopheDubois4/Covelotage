
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

/** protect the Profile route */
export const AuthorizeUser = ({ children }) => {
    const token = localStorage.getItem('token');

    if(!token){
        return <Navigate to={'/login'} replace={true}></Navigate>
    }

    return children;
}

/** protect the Password route */
export const ProtectRoute = ({ children }) => {
    const username = useAuthStore.getState().auth.username;
    if(!username){
        return <Navigate to={'/login'} replace={true}></Navigate>
    }
    return children;
}