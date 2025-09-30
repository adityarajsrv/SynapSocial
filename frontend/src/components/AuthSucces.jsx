import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("jwtToken", token);
      navigate("/dashboard"); 
    }
  }, [navigate]);

  return <div>Connecting account...</div>;
};

export default AuthSuccess;
