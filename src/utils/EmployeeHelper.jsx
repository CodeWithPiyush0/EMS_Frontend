import axios from "axios"
import { useNavigate } from 'react-router-dom';

export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno,
        width: "70px"
    },
    {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
        width: "100px"
    },
    {
        name: "Image",
        selector: (row) => row.profileImage,
        cell: (row) => (
            <img 
                src={row.profileImage} 
                alt="Profile" 
                width="50" 
                height="50"
                className="w-12 h-12 rounded-full border border-gray-300 shadow-sm object-cover"
                onError={(e) => { e.target.src = "/default-profile.png"; }} // Optional fallback image
            />
        ),
    },
    {
        name: "Department",
        selector: (row) => row.dept_name,
        width: "120px"
    },
    {
        name: "DOB",
        selector: (row) => row.dob,
        sortable: true,
        width: "130px"
    },
    {
        name: "Action",
        selector: (row) => row.action,
        center: "true"
    },
]


export const fetchDepartments = async () => {

    let departments
    try {
        const response = await axios.get('https://ems-server-khaki.vercel.app/api/department', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.data.success) {
            departments = response.data.departments
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            alert(error.response.data.error)
        }
    }
    return departments
}


export const getEmployees = async (id) => {

    let employees
    try {
        const response = await axios.get(`https://ems-server-khaki.vercel.app/api/employee/department/${id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.data.success) {
            employees = response.data.employees
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            alert(error.response.data.error)
        }
    }
    return employees
}




export const EmployeeButtons = ({ id }) => {
    const navigate = useNavigate()
    
    return (
        <div className="flex space-x-3">
            <button
                className="px-3 py-1 bg-teal-600 text-white rounded"
                onClick={() => {
                    navigate(`/admin-dashboard/employees/${id}`);
                }}
            >View</button>

            <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => navigate(`/admin-dashboard/employees/edit/${id}`)}
            >Edit</button>

            <button
                className="px-3 py-1 bg-yellow-600 text-white rounded"
                onClick={() => navigate(`/admin-dashboard/employees/salary/${id}`)}
            >Salary</button>

            <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => navigate(`/admin-dashboard/employees/leaves/${id}`)}
            >Leave</button>
        </div>
    )
}