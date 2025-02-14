import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = ()=>{
    const navigate = useNavigate();

    useEffect(()=>{
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        
        console.log(token);
        
        if (token){
            localStorage.setItem("token",token);
            navigate("/dashboard")
        } else {
            navigate("/login?error=unauthorized")
        }
    },[navigate]);
    return <p>Loggin in....</p>
};

export default AuthSuccess;