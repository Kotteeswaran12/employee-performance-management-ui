
import './LeaveReq.css'
const data = [
    {
        Title: ["Employee", "LeaveType", "From", "To", "Status"]
    },
    {
        Employee: "kotteeswaran",
        LeaveType: "Medical Leave",
        From: "20/07/2026",
        To: "25/07/2026",
        Status: "PENDING"
    },
    {
        Employee: "kotteeswaran",
        LeaveType: "Medical Leave",
        From: "20/07/2026",
        To: "25/07/2026",
        Status: "APROVED"
    },
    {
        Employee: "kotteeswaran",
        LeaveType: "Medical Leave",
        From: "20/07/2026",
        To: "25/07/2026",
        Status: "REJECTED"
    }, {
        Employee: "kotteeswaran",
        LeaveType: "Medical Leave",
        From: "20/07/2026",
        To: "25/07/2026",
        Status: "PENDING"
    },
]
const LeaveRequest = ({ Title, Z }) => {
    return (
        <div className='LeavReqOuter'>
            <div className="top">
                <h1>{Title}</h1>
                <button>View All</button>
            </div>

            <div className="LeaveReqDatas">

                <table >
                    <tr >
                        {
                            data[0].Title.map((t, i) => {
                                return (<th key={i}>{t}</th>)
                            })
                        }
                    </tr>

                    {
                        data.filter((_, index) => index > 0)
                            .map((d, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{d.Employee}</td>
                                        <td>{d.LeaveType}</td>
                                        <td>{d.From}</td>
                                        <td>{d.To}</td>
                                        <td>
                                            <span className={d.Status}>{d.Status}</span>
                                        </td>
                                    </tr>
                                )
                            })
                    }
                </table>
            </div>

        </div>
    )
}

export default LeaveRequest