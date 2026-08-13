import { FaUsers } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";
import { MdAssignment } from "react-icons/md";
import { MdFeedback } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import { MdCheckCircle } from "react-icons/md";
import { MdPending } from "react-icons/md";
import { MdScore } from "react-icons/md";


const OverAll = ({ datas }) => {

    const getDashboardIcon = (key) => {

        
        switch (key.toLowerCase()) {

            // ADMIN
            case "totalemployees":
                return <FaUsers className="dashboarIcons" />;

            case "totalmanagers":
                return <FaUserTie className="dashboarIcons" />;

            case "totaldepartments":
                return <FaBuilding className="dashboarIcons" />;

            case "pendingleave":
            case "pendingleaves":
                return (
                    <MdOutlinePendingActions
                        className="dashboarIcons"
                    />
                );

            case "pendingreviews":
                return (
                    <MdRateReview
                        className="dashboarIcons"
                    />
                );


            // MANAGER
            case "tasksassigned":
            case "taskassigned":
                return (
                    <MdAssignment
                        className="dashboarIcons"
                    />
                );

            case "teamsize":
                return (
                    <MdGroups
                        className="dashboarIcons"
                    />
                );

            case "taskscore":
                return (
                    <MdScore
                        className="dashboarIcons"
                    />
                );

            case "feedbackscore":
                return (
                    <MdFeedback
                        className="dashboarIcons"
                    />
                );


            // EMPLOYEE
            case "completedtask":
                return (
                    <MdCheckCircle
                        className="dashboarIcons"
                    />
                );

            case "pendingtask":
                return (
                    <MdPending
                        className="dashboarIcons"
                    />
                );

            case "attendacescore":
            case "attendancescore":
                return (
                    <MdAccessTime
                        className="dashboarIcons"
                    />
                );

            case "overallscore":
                return (
                    <MdScore
                        className="dashboarIcons"
                    />
                );


            // DEFAULT
            default:
                return (
                    <MdTaskAlt
                        className="dashboarIcons"
                    />
                );
        }
    };


    return (

        <div className="overAll">

            {
                Object.keys(datas).map((d, i) => (

                    <div
                        className="Parts"
                        key={i}
                    >

                        <div className={`icon${d}`}>

                            {getDashboardIcon(d)}

                        </div>


                        <div className="results">

                            <h5>
                                {d}
                            </h5>

                            <h2>
                                {Math.round(datas[d])}
                            </h2>

                        </div>

                    </div>

                ))
            }

        </div>
    );
};


export default OverAll;