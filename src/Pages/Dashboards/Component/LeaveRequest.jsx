
import './LeaveReq.css'

const LeaveRequest = ({ Heading, data, Title }) => {
    console.log(data)
    return (
        <div className='LeavReqOuter'>
            <div className="top">
                <h1>{Heading}</h1>
                <button>View All</button>
            </div>

            <div className="LeaveReqDatas">

                <table >
                    <thead>
                        <tr >
                            {
                                Title.map((t, i) => {
                                    return (<th key={i}>{t}</th>)
                                })
                            }
                        </tr>
                    </thead>

                    {
                        data && data.length > 0 ? (
                            <tbody>
                                {
                                    data
                                        .map((d, index) => (
                                            <tr key={index}>

                                                {
                                                    Title
                                                        .map((column) => (

                                                            <td key={column}
                                                            >{
                                                                    column == "status"  ? (
                                                                        <span className={d[column]}>{d[column]}</span>
                                                                    )
                                                                        :
                                                                        (
                                                                            d[column]
                                                                        )

                                                                }</td>

                                                        ))
                                                }

                                            </tr>

                                        ))
                                }
                            </tbody>
                        ) : (
                            <h3>no Records Found !!</h3>
                        )
                    }
                </table>
            </div>

        </div>
    )
}

export default LeaveRequest