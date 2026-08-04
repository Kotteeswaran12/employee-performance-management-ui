
// import { FaUsers } from "react-icons/fa";
// import { FaUserTie } from "react-icons/fa";
// import { MdApartment } from "react-icons/md";
// import { MdOutlinePendingActions } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";


const OverAll = ({ datas }) => {
    
    // console.log(datas)

    return (
        <><div className="overAll">

            {
                Object.keys(datas).map((d, i) => (
                    <div className="Parts" key={i}>

                        <div className={`icon${d}`}>
                            <MdTaskAlt className='dashboarIcons' />
                        </div>

                        <div className="results">
                            <h5>{d}</h5>

                            <h2>{datas[d]}</h2>
                        </div>

                    </div>
                ))
            }


        </div></>
    )
}

export default OverAll