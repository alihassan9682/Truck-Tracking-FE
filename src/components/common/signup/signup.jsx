import image_path from "../../../assets/images/authentication/signup-bg.png";
import SignUpForm from "./signupForm";
import { useGoogleLogin } from '@react-oauth/google';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../loader/loader"
import { useState } from "react";
import {
    setuserData,
    setAuth,
    setGoogleAccessToken,
    setId,
} from "../../features/userSlice";
import axios from "axios";
const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth, googleAccessToken, id } = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => dispatch(setGoogleAccessToken(codeResponse.access_token)),
        onError: (error) => console.log('Login Failed:', error)
    });
    useEffect(() => {
        if (googleAccessToken) {
            const fetchGoogleUserDetails = async () => {
                try {
                    // setIsLoading(true);
                    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                        headers: {
                            Authorization: `Bearer ${googleAccessToken}`,
                        },
                    });
                    const profileData = {
                        fname: response.data?.given_name || "",
                        lname: response.data?.family_name || "",
                        email: response?.data.email || "",
                        photo: response?.data.picture || "",
                    }
                    dispatch(setuserData(profileData));
                    dispatch(setId(response.data.id))
                    setIsLoading(false)// Example: storing the user's unique ID
                    dispatch(setAuth(true));
                    navigate("/");
                } catch (error) {
                    setIsLoading(false)// Example: storing the user's unique ID
                    console.error('Error fetching Google user details:', error);
                }
            };

            fetchGoogleUserDetails();
        }
    }, [googleAccessToken, id, auth]);
    return (
        <>
            {isLoading && (
                <div className="fixed bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <img src="../assets/images/media/loader.svg" alt="" />
                </div>
            )}
            <div className="w-screen h-auto lg:h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-100 relative">
                {/* Left Side Overlay with Text */}
                <div className="hidden lg:flex flex-col bg-center bg-cover items-center justify-center w-1/2 h-full bg-black bg-opacity-40 p-10 text-white"
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
                <div className="w-full lg:w-1/2 h-full flex items-center justify-center bg-white lg:px-20 xl:px-32">
                    <SignUpForm
                        googleLogin={login}
                    />
                </div>
            </div>
        </>
    );
};

export default SignUp;
