
import "./Navbar.css"
const Navbar = ({ User }) => {
    const [{ name, role }] = User;
    return (
        <>

            <div className="NavOuter">
                <div className="logoName">
                    <h1>{role} Dashboard</h1>
                    <div className="userInfo" onClick={()=> localStorage.clear()}>
                        <img src="https://dummyimage.com/600x400/000/00ffd5.png" alt="" />
                        <div className="userDetails">
                            <h4> User : {name}</h4>
                            <p>{role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar