import { useEffect, useState } from "react";
import image_path from "../../../assets/images/authentication/signup-bg.png";
import LoginForm from "./loginForm";
// import ForgotPasswordForm from "./forgetPassword";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
    setuserData,
    setAuth,
    setGoogleAccessToken,
    setId,
} from "../../features/userSlice";
import Loader from "../loader/loader"


const Login = () => {
    const [forgetPassword, setForgetPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { googleAccessToken, id } = useSelector((state) => state.user);
    const [Loading, setLoading] = useState(false)
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => dispatch(setGoogleAccessToken(codeResponse.access_token)),
        onError: (error) => console.log('Login Failed:', error),
    });

    useEffect(() => {
        if (googleAccessToken) {
            const fetchGoogleUserDetails = async () => {
                try {
                    setLoading(true)
                    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                        headers: {
                            Authorization: `Bearer ${googleAccessToken}`,
                        },
                    });
                    const profileData = {
                        lname: response.data?.family_name || "",
                        fname: response.data?.given_name || "",
                        email: response?.data.email || "",
                        photo: response?.data.picture || "",
                    }
                    dispatch(setuserData(profileData));
                    dispatch(setId(response.data.id));
                    dispatch(setAuth(true));
                    setLoading(false)
                    navigate("/");
                } catch (error) {
                    setLoading(false)
                    console.error('Error fetching Google user details:', error);
                }
                setLoading(false)
            };

            fetchGoogleUserDetails();
        }
    }, [googleAccessToken, setId, setAuth]);



    return (
        <>
            {Loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Loader />
                </div>
            )}
            <div className="w-screen h-auto flex flex-col lg:flex-row items-center justify-center bg-gray-100 relative">
                {/* Left Side Overlay with Text */}
                <div
                    className="hidden lg:flex flex-col bg-center bg-cover items-center justify-center w-1/2 h-screen bg-black bg-opacity-40 p-10 text-white"
                    style={{
                        backgroundImage: `url(${image_path})`,
                    }}
                >
                    {/* <h1 className="text-3xl font-bold">Schneider</h1> */}
                    <img src="/image-removebg-preview.png" alt="logo" className="w-40 h-10" />

                    <p className="text-md font-medium mt-2">Sign in or create an account</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-gradient-to-r bg-[#F26A2A] mt-3 text-white rounded-lg px-6 py-3 shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out"
                    >
                        Continue Without Sign In
                    </button>
                </div>

                {/* Right Side Form */}
                <div className="w-full lg:w-1/2 h-screen lg:px-20 xl:px-32 flex items-center justify-center bg-white p-6">
                    <div className="w-full max-w-xl space-y-5">
                        <LoginForm
                            forgotPassword={() => setForgetPassword(true)}
                            setAuth={setAuth}
                            googleLogin={login}
                            setId={setId}
                            googleAccessToken={googleAccessToken}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;