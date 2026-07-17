import React from 'react'
import "./Navbar.css"
const Navbar = ({ User }) => {
    const [{ name, role }] = User;
    return (
        <>
            
            <div className="NavOuter">
                <div className="logoName">
                    <h1>{role} Dashboard</h1>
                    <div className="userInfo">
                        <img src="https://dummyimage.com/600x400/000/00ffd5.png" alt="" />
                        <h4>{name} User</h4>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar