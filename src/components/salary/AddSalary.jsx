import React, { useEffect, useState } from 'react'
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper"
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios"



const AddSalary = () => {

    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        employeeId: "",
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
        payDate: "",
    })
    const [departments, setDepartments] = useState([])
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getDepartments = async () => {
            const departments = await fetchDepartments()
            setDepartments(departments)
        }
        getDepartments()
    }, [])

    const handleDepartment = async (e) => {
        const emps = await getEmployees(e.target.value)
        setEmployees(emps)
    }

    
    const handleChange = (e) => {
        const { name, value } = e.target
        setEmployee((prevData) => ({ ...prevData, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        

        try {
            const response = await axios.post(`https://ems-server-khaki.vercel.app/api/salary/add`, employee, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            })

            if (response.data.success) {
                alert("Salary added successfully!");
                navigate("/admin-dashboard/employees")
            } else {
                alert(response.data.error || "Failed to add salary. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.error || "Failed to add salary. Please try again.");
        } finally {
            setLoading(false);
        }


    }

    return (
        <>{departments && employee ? (
            <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
                <h2 className='text-2xl font-bold mb-6'>Add Salary</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Department
                            </label>
                            <select
                                name="department"
                                onChange={handleDepartment}
                                value={employee.department}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Department</option>
                                {departments?.map(dep => (
                                    <option key={dep._id} value={dep._id}>{dep.dept_name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Employee
                            </label>
                            <select
                                name="employeeId"
                                value={employee.employeeId}
                                onChange={handleChange}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees?.map(emp => (
                                    <option key={emp._id} value={emp._id}>{emp.userID?.name || "No Name"}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Basic Salary
                            </label>
                            <input
                                type="number"
                                name="basicSalary"
                                onChange={handleChange}
                                placeholder="Basic Salary"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                required
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Allowances
                            </label>
                            <input
                                type="number"
                                name="allowances"
                                onChange={handleChange}
                                placeholder="Allowances"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Deductions
                            </label>
                            <input
                                type="number"
                                name="deductions"
                                onChange={handleChange}
                                placeholder="Deductions"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Pay Date
                            </label>
                            <input
                                type="date"
                                name="payDate"
                                onChange={handleChange}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                required
                            />
                        </div>




                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
                        disabled={loading}
                    >{loading ? 'Adding...' : 'Add Salary'}</button>

                </form>

            </div>
        ) : <div>Loading...</div>}</>
    )
}

export default AddSalary