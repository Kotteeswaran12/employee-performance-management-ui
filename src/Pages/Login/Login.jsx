
import{ useRef, useState } from 'react'
import logDesign from '../../assets/login/loginDesign.png';
import LoginImg from '../../assets/login/LoginImg.png'
import './Login.css';
import { BsPersonFill } from "react-icons/bs";
import { FaKey } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";

import { login } from '../../Api/AuthApi';
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [visible, setVisible] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false);
    const ref = useRef({ username: '', password: '' });
    const navigate = useNavigate();

    function PasswordVisible() {
        setVisible(prev => !prev);

    }
    function adduserDetails(e, field) {
        ref.current = { ...ref.current, [field]: e.target.value };

        // console.log(ref)
    }


    const handleLogin = async (e) => {

        e.preventDefault();

        console.log(ref)

        try {
            const response = await login(ref.current.username, ref.current.password);

            setErrorMessage(false)
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.Role);
            localStorage.setItem("username", response.data.username)


            if (response.data.Role === "ADMIN") {
                navigate("/Admin-dashBoard", { replace: true });
            } else if (response.data.Role === "MANAGER") {
                navigate("/Manager-dashBoard", { replace: true });
            } else {
                navigate("/Employee-dashBoard", { replace: true });
            }


        } catch (error) {
            setErrorMessage(true)
            console.error(error.message);
        }
    };
    return (
        <>
            <div className="loginMain">

                <div className="loginOuter">

                    <div className="loginInner">
                        <div className="LoginLeft">

                            <div className="LoginTittle">
                                <h1>Employee performance  Management System</h1>
                                <p>Welcome Back 👋🏻</p>
                                <p>Sign in to Access Your Employee DashBoard !!</p>
                                {
                                    errorMessage ? <p style={{ color: 'red', marginTop: '5px', textDecoration: 'underline', fontFamily: 'sans-serif' }}>Username or  password is In-correct</p> : ""
                                }
                            </div>
                            <form onSubmit={handleLogin} >

                                <div className={`UserNameInput${errorMessage ? 'error' : ''}`}>
                                    <BsPersonFill className='LoginIcons' />
                                    <input type="text" placeholder='UserName' required onChange={(e) => adduserDetails(e, "username")} autoFocus={errorMessage} />
                                </div>

                                <div className={`PasswordInput${errorMessage ? 'error' : ''}`}>
                                    <FaKey className='LoginIcons' />
                                    <input type={`${!visible ? 'password' : 'text'}`} required placeholder='Password' onChange={(e) => adduserDetails(e, "password")} />

                                    {
                                        !visible ?
                                            <IoMdEyeOff className='PasswordEye' onClick={PasswordVisible} /> :
                                            <IoEye className='PasswordEye' onClick={PasswordVisible} />
                                    }

                                </div>

                                <div className="AditionalDetails">
                                    <div className="Remember">
                                        <input type="checkbox" name='Remember' id='reme' />
                                        <p className='Remember' id='reme'>Remember Me </p>
                                    </div>
                                    <p>Forgot Password ?</p>
                                </div>
                                <button type='submit'>Submit</button>
                            </form>

                            <div className="DemoAccount">
                                <h2>Demo Accounts </h2>
                                <p className='admin'> 🔴 ADMIN :	admin || admin123</p>
                                <p className='manager'>🟢 MANAGER :	manager ||	manager123</p>
                                <p className='employee'>🟣 EMPLOYEE :	employee || employee123</p>

                            </div>



                        </div>

                        <div className="LoginRight">


                            <img src={LoginImg} alt="" className='MainLoginImg' />
                            {/* <img src={loginMainImg} alt=""  /> */}
                            <img src={logDesign} alt="" className='rectangleImg' />

                        </div>
                    </div>

                </div>



            </div>
        </>
    )
}

export default Login