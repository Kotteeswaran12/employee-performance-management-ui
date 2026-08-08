import { useState } from "react";
import './AddManager.css'
import { useEffect } from "react";
import { getAlltheDepartments } from "../../Api/AdminAccess";
import { addManager } from "../../Api/AdminAccess";
const fields = [
    {
        name: "empcode",
        label: "Employee Code",
        type: "text",
        placeholder: "MAG001"
    },
    {
        name: "firstname",
        label: "First Name",
        type: "text",
        placeholder: "John"
    },
    {
        name: "lastname",
        label: "Last Name",
        type: "text",
        placeholder: "Doe"
    },
    {
        name: "designation",
        label: "Designation",
        type: "text",
        placeholder: "Software Engineer"
    },
    {
        name: "dob",
        label: "Date of Birth",
        type: "date"
    },
    {
        name: "phone",
        label: "Phone Number",
        type: "number",
        placeholder: "9876543210"
    },
    {
        name: "address",
        label: "Address",
        type: "textarea",
        placeholder: "Enter Address"
    },
    {
        name: "sal",
        label: "Salary",
        type: "number",
        placeholder: "50000"
    }
];

export default function AddManager() {
    const [departments, setDepartments] = useState([]);
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        empcode: "",
        firstname: "",
        lastname: "",
        designation: "",
        dob: "",
        phone: "",
        gender: "",
        address: "",
        sal: "",

    });
    const [department, setDepartment] = useState(null);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addManager(token, formData, department)
            alert('Manager Added Sucessfully')

            console.log(response.data)
        } catch (e) {
            console.log(e)
        }

    };


    const fetchDepartments = async () => {
        try {
            const response = await getAlltheDepartments(token, 0, 100);

            setDepartments(response.data.content);
            console.log(response.data.content)

        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDepartments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="employeeContainer">

            <div className="employeeCard">

                <h1>Add Manager</h1>

                <form onSubmit={handleSubmit}>

                    <div className="grid">

                        {fields.map(field => (

                            <div className="formGroup" key={field.name}>

                                <label>{field.label}</label>

                                {
                                    field.type === "textarea" ?

                                        <textarea
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                        />

                                        :

                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                        />
                                }

                            </div>

                        ))}

                        <div className="formGroup">

                            <label>Department</label>

                            <select
                                name="department"
                                value={formData.department}
                                onChange={(e) => { console.log(e.target.value), setDepartment(e.target.value) }}
                            >

                                <option value="">Select Department</option>

                                {departments.map((dept) => (

                                    <option
                                        key={dept.id}
                                        value={dept.id}
                                    >
                                        {dept.dept}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="formGroup">

                            <label>Gender</label>

                            <div className="genderBox">

                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Male"
                                        checked={formData.gender === "Male"}
                                        onChange={handleChange}
                                    />
                                    Male
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Female"
                                        checked={formData.gender === "Female"}
                                        onChange={handleChange}
                                    />
                                    Female
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Other"
                                        checked={formData.gender === "Other"}
                                        onChange={handleChange}
                                    />
                                    Other
                                </label>

                            </div>

                        </div>



                    </div>

                    <button className="submitBtn" >
                        Add Manager
                    </button>

                </form>

            </div>

        </div>
    );
}