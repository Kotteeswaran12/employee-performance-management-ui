import './LeaveReq.css';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const TableContent = ({ Heading, data, Title, Type }) => {

    const navigate = useNavigate();

    const records = data || [];

    const handleViewAll = () => {
        navigate("/all", {
            state: {
                Type: Type,
                Tittle: Title
            }
        });
    };

    const getStatusClass = (status) => {

        if (!status) return "";

        return status
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-");
    };

    return (

        <div className="LeavReqOuter">

            {/* ================================
                HEADER
            ================================= */}

            <div className="top">

                <div className="headingSection">

                    <h1>
                        {Heading}
                    </h1>

                    <span className="recordCount">
                        {records.length} Records
                    </span>

                </div>


                <button
                    className="viewAllBtn"
                    onClick={handleViewAll}
                >

                    View All

                    <FiArrowRight />

                </button>

            </div>


            {/* ================================
                TABLE
            ================================= */}

            <div className="LeaveReqDatas">

                {records.length > 0 ? (

                    <table>

                        <thead>

                            <tr>

                                {Title.map((t, i) => (

                                    <th key={i}>
                                        {t}
                                    </th>

                                ))}

                            </tr>

                        </thead>


                        <tbody>

                            {records.map((d, index) => (

                                <tr
                                    key={d.id || index}
                                    className="tableRow"
                                >

                                    {Title.map((column) => (

                                        <td key={column}>

                                            {column.toLowerCase() === "status" ? (

                                                <span
                                                    className={`statusBadge ${getStatusClass(
                                                        d[column]
                                                    )}`}
                                                >

                                                    <span className="statusDot"></span>

                                                    {d[column]}

                                                </span>

                                            ) : (

                                                d[column] ?? "-"

                                            )}

                                        </td>

                                    ))}

                                </tr>

                            ))}

                        </tbody>

                    </table>

                ) : (

                    <div className="emptyRecords">

                        <div className="emptyIcon">
                            📋
                        </div>

                        <h3>
                            No Records Found
                        </h3>

                        <p>
                            There are currently no records to display.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default TableContent;