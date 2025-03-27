import { FaEye } from "react-icons/fa";
import { useState } from "react";
import { HiEyeOff } from "react-icons/hi";
import { Link } from "react-router-dom";
import { postData } from "../../../utils/httpFunctions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import googlelogo from "../../../assets/images/authentication/googleLogo.png";
import { setId, setAuth, setGoogleAccessToken } from "../../features/userSlice";
import { useEffect } from "react";
const SignUpForm = ({ googleLogin }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordShow, setPasswordShow] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [role, setRole] = useState("user");
    const [passwordError, setPasswordError] = useState("");
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        if (emailValue && !validateEmail(emailValue)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError("");
        }
    };

    const handlePasswordChange = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);
        if (confirmPassword && passwordValue !== confirmPassword) {
            setPasswordError("Passwords do not match.");
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPasswordValue = e.target.value;
        setConfirmPassword(confirmPasswordValue);
        if (password && password !== confirmPasswordValue) {
            setPasswordError("Passwords do not match.");
        } else {
            setPasswordError("");
        }
    }
    const resetValues = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }


    const handleSignUp = async (e) => {
        e.preventDefault();
        // dispatch(setIsLoading(true));
        const payload = {
            email: email,
            Firstname: firstName,
            Lastname: lastName,
            password1: password,
            password2: confirmPassword,
            role: role,
        };
        const url = "auth/signup/";
        const res = await postData(url, payload);
        if (!res.success) {
            // dispatch(setIsLoading(false));
            // toast.error(res?.error?.message);
            return;
        }
        if (!res.data.id || res.status !== 200) {
            (res);
            // toast.error(res?.data?.message);
            // dispatch(setIsLoading(false));
            return;
        }
        resetValues()
        // const id = res.data.user;
        // dispatch(setId(id))
        // dispatch(setIsLoading(false));
        // dispatch(setAuth(true));
        navigate("/login");
    };
  
    return (
        <div className={`h-full font-sans w-full  overflow-hidden rounded bg-[url(../../assets/background.jpg)] `} style={{ color: "#0d2352" }}>
            <div className={`p-8 flex flex-col w-full overflow-hidden gap-1 rounded`}>
                {/* <h1 className="relative  text-4xl text-center font-medium  2xl:mb-16">Schneider</h1> */}
                <img src="/image-removebg-preview.png" alt="logo" className="w-40 h-10" />

                <div className="font-heading font-bold md:text-2xl text-md justify-end">Create your account</div>
                <form onSubmit={handleSignUp} >
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium font-heading 2xl:my-2 xl:my-1">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full border border-gray-200 font-body p-2 rounded-md"
                                placeholder="First name"
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium font-heading 2xl:my-2 xl:my-1">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full border border-gray-200 font-body p-2 rounded-md"
                                placeholder="Last name"
                                required
                            />
                        </div>
                    </div>
                    <label className="block text-sm font-medium font-heading 2xl:my-2 xl:my-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`w-full border ${emailError ? 'border-red-500' : 'border-gray-300'} font-body p-2 rounded-md `}
                        placeholder="Email address"
                        required
                    />
                    {emailError && <p className="text-red-500 text-sm ">{emailError}</p>}
                    <div className="relative my-1 xl:my-2">
                        <label className="block text-sm font-medium font-heading 2xl:my-2">Password</label>
                        <div className="relative">
                            <input
                                type={passwordShow ? "text" : "password"}
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full border font-body p-2 pr-10 rounded-md "
                                placeholder="Enter password"
                                required
                                maxLength={12}
                                minLength={8}
                            />
                            <span
                                className="absolute inset-y-0 right-2 flex items-center top-1 cursor-pointer"
                                onClick={() => setPasswordShow(!passwordShow)}
                            >
                                {passwordShow ? <FaEye /> : <HiEyeOff />}
                            </span>
                        </div>
                    </div>
                    <div className="relative my-2 xl:my-2">
                        <label className="block text-sm font-medium font-heading 2xl:my-2">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={confirmPasswordShow ? "text" : "password"}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className="w-full border font-body p-2 pr-10 rounded-md "
                                placeholder="Confirm password"
                                required
                                maxLength={12}
                                minLength={8}
                            />
                            <span
                                className="absolute inset-y-0 text-sm md:text-sm right-2 flex items-center top-1 cursor-pointer"
                                onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}
                            >
                                {confirmPasswordShow ? <FaEye /> : <HiEyeOff />}
                            </span>
                        </div>
                        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium">Select Role</label>
                        <div className="flex gap-4 mt-1">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={role === "user"}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                />
                                User
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={role === "admin"}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                />
                                Admin
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="py-3 px-2 md:my-3 lg:py-2 2xl:my-5 text-sm md:text-md xl:py-3 bg-[#F26A2A] w-full font-heading text-white my-1 rounded-md lg:mt-2 cursor-pointer hover:rounded-full hover:scale-105 transition-all duration-300 ease-in-out"
                        disabled={!!emailError || !!passwordError || !email || !password || !confirmPassword || !firstName || !lastName}
                    >
                        Sign up
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="sm:hidden justify-center flex py-3 md:my-3 px-2 lg:py-2 2xl:my-5 text-sm md:text-md xl:py-3 bg-[#F26A2A] w-full font-heading text-white my-1 rounded-md lg:mt-2 cursor-pointer hover:rounded-full hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Continue Without sign in
                    </button>
                </form>
                <div className="my-1 lg:my-1"><hr /></div>
                <button type="button"
                    className="flex text-sm md:text-sm items-center xl:py-2 justify-center py-2 px-2  xl:my-3 lg:py-1 bg-[#111] w-full font-heading text-white my-1 lg:my-0 rounded-md hover:rounded-full hover:scale-105 transition-all duration-300 ease-in-out"
                    onClick={googleLogin}>
                    <img src={googlelogo} alt="Google logo" className="h-8 w-8 mr-2" />
                    <span>Or Continue with Google</span>
                </button>
                <div>
                    <p className="mt-1 text-center text-sm md:text-sm xl:my-2">
                        Already have an account? <Link to="/login" className="text-secondary">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
