import { FaEye } from "react-icons/fa";
import { HiEyeOff } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postData } from "../../../utils/httpFunctions";
import googlelogo from "../../../assets/images/authentication/googleLogo.png";
import { FaToggleOff } from "react-icons/fa";
import { FaToggleOn } from "react-icons/fa";
import { useDispatch } from "react-redux";
const LoginForm = ({ forgotPassword, setAuth, googleLogin, setId }) => {
    const [toggle, setToggle] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);
    const [email, setEmail] = useState("");
    const dispatch = useDispatch()
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate();
    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);

        // Validate email and set error message if invalid
        if (emailValue && !validateEmail(emailValue)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError(""); // Clear error if email is valid
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        const url = "auth/login/";
        const payload = {
            email,
            password,
        };
        setEmail("");
        setPassword("");
        const response = await postData(url, payload);
        if (!response.success) {
            console.error(response?.error?.message);
            return;
        }
        sessionStorage.setItem("token", response?.data?.access_token);
        sessionStorage.setItem("refreshToken", response?.data?.refresh_token);
        dispatch(setAuth(true));
        dispatch(setId(response?.data.user));
        navigate("/");
    }

    return (
        <div className="h-full font-sans w-full" >
            <div className="flex flex-col w-full h-full p-8 gap-3">
                {/* <h1 className="text-4xl mb-8 md:mb-6 text-center font-medium xl:mb-10 2xl:mb-24">Schneider</h1> */}
                <img src="/image-removebg-preview.png" alt="logo" className="w-40 h-10 bg-center justify-center" />

                <div className="text-lg font-heading font-bold md:text-2xl">Nice to see you again</div>

                <form onSubmit={handleSignIn}>
                    <label className="block text-sm font-medium font-heading  2xl:my-3 xl:my-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`w-full border rounded-md ${emailError ? 'border-red-500' : 'border-gray-300'} font-body p-2 mt-1`}
                        placeholder="Email or phone number"
                        required
                    />
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

                    {/* Password Input */}
                    <div className="relative my-3 xl:my-2">
                        <label className="block text-sm font-medium font-heading">Password</label>
                        <div className="relative">
                            <input
                                type={passwordShow ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border font-body p-2 pr-10 rounded-md mt-1"
                                placeholder="Enter password"
                                required
                            />
                            <span
                                className="absolute inset-y-0 right-2 flex items-center top-1 cursor-pointer"
                                onClick={() => setPasswordShow(!passwordShow)}
                            >
                                {passwordShow ? <FaEye /> : <HiEyeOff />}
                            </span>
                        </div>
                    </div>

                    {/* Remember Me Toggle */}
                    <div className="flex justify-between lg:my-2">
                        <div className="flex items-center">
                            <span
                                onClick={() => setToggle(!toggle)}
                                className="mr-2 cursor-pointer"
                            >
                                {toggle ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                            </span>
                            <label className="font-heading text-xs md:text-sm">Remember me</label>
                        </div>
                        <a href="#" className="text-secondary font-heading text-end  text-xs md:text-sm" onClick={forgotPassword}>Forget password?</a>
                    </div>
                    <button
                        type="submit"
                        className="py-3 md:my-3 px-2 lg:py-2 2xl:my-5 text-sm md:text-md xl:py-3 bg-[#F26A2A] w-full font-heading text-white my-1 rounded-md lg:mt-2 cursor-pointer hover:rounded-full hover:scale-105 transition-all duration-300 ease-in-out"
                        disabled={!!emailError || !email || !password}
                    >
                        Sign in
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="sm:hidden justify-center flex py-3 md:my-3 px-2 lg:py-2 2xl:my-5 text-sm md:text-md xl:py-3 bg-[#F26A2A] w-full font-heading text-white my-1 rounded-md lg:mt-2 cursor-pointer hover:rounded-full hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Continue Without sign in
                    </button>
                    <div className="my-1 md:mb-3 lg:my-1 xl:my-3"><hr /></div>
                    <button
                        type="button"
                        className="flex text-sm  md:my5 md:text-sm items-center xl:py-2 justify-center py-2 px-2  xl:my-3 lg:py-1 bg-[#111] w-full font-heading text-white my-1 lg:my-0 rounded-md hover:rounded-full hover:scale-105 transition-all duration-300 ease-in-out"
                        onClick={googleLogin}
                    >
                        <img src={googlelogo} alt="Google logo" className="h-8 w-8 mr-2" />
                        <span>Or Continue with Google</span>
                    </button>

                    <div>
                        <p className="mt-3 text-center text-sm md:text-sm lg:mb-4">
                            Don&apost have an account? <Link to="/signup" className="text-secondary">Sign up now</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;