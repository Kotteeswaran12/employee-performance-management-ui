import React, { useState } from 'react'
import logDesign from '../../assets/login/loginDesign.png';
import LoginImg from '../../assets/login/LoginImg.png'
import './Login.css';
import { BsPersonFill } from "react-icons/bs";
import { FaKey } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
const Login = () => {
    const [visible, setVisible] = useState(false)

    function PasswordVisible() {
        setVisible(prev => !prev);

    }
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

                            </div>
                            <form >

                                <div className="UserNameInput">
                                    <BsPersonFill className='LoginIcons' />
                                    <input type="text" placeholder='UserName' />
                                </div>

                                <div className="PasswordInput">
                                    <FaKey className='LoginIcons' />
                                    <input type={`${!visible ? 'password' : 'text'}`} placeholder='Password' />

                                    {
                                        !visible ?
                                            <IoMdEyeOff className='PasswordEye' onClick={PasswordVisible} /> :
                                            <IoEye className='PasswordEye' onClick={PasswordVisible} />
                                    }

                                </div>

                                <div className="AditionalDetails">
                                    <div className="Remember">
                                        <input type="checkbox" name='Remember' />
                                        <p className='Remember'>Remember Me </p>
                                    </div>
                                    <p>Forgot Password ?</p>
                                </div>
                                <button onCanPlay={(e) => { e.preventDefault }}>Submit</button>
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