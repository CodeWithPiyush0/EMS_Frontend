import React, { useEffect, useState } from 'react'
import { fetchDepartments } from "../../utils/EmployeeHelper"
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios"



const Edit = () => {

  const navigate = useNavigate();  
  const [employee, setEmployee] = useState({
    name: '',
    martialStatus: '',
    designation: '',
    salary: 0,
    department: ''
  })
  const [departments, setDepartments] = useState(null)
  const {id} = useParams()
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      const getDepartments = async () => {
        const departments = await fetchDepartments()
        setDepartments(departments)
      }
      getDepartments()
    }, [])
  

  useEffect(() => {
    const fetchEmployee = async () => {
        try {
            const response = await axios.get(`https://ems-server-khaki.vercel.app/api/employee/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                const employee = response.data.employee
                setEmployee((prev) => ({...prev, 
                    name: employee.userID.name, 
                    martialStatus: employee.martialStatus,
                    designation: employee.designation,
                    salary: employee.salary,
                    department: employee.department
                }));
            } else {
                setEmployee(null);
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error);
            }
        }
    };
    fetchEmployee();
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
      setEmployee((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    
    try {
      const response = await axios.put(`https://ems-server-khaki.vercel.app/api/employee/${id}`, employee, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json" 
        }
      })

      if (response.data.success) {
        alert("Employee updated successfully!");
        navigate("/admin-dashboard/employees")
      } else {
        alert(response.data.error || "Failed to add employee. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.error || "Failed to add employee. Please try again.");
    } finally {
      setLoading(false);
    }
  
    // } catch (error) {
    //   if (error.response && !error.response.data.success) {
    //     alert(error.response.data.error)
    //   } else {
    //     alert("Failed to add employee. Please try again.")
    //   }
    // } finally {
    //   setLoading(false) // ✅ Reset loading state after submission
    // }
  }

  return (
    <>{departments && employee ? (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>Edit Employee</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={employee.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marrtal Status
            </label>
            <select
              name="martialStatus"
              onChange={handleChange}
              value={employee.martialStatus}
              placeholder="Marital Status"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              onChange={handleChange}
              value={employee.designation}
              placeholder="Designation"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary
            </label>
            <input
              type="number"
              name="salary"
              onChange={handleChange}
              value={employee.salary}
              placeholder="Salary"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              onChange={handleChange}
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



        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
          disabled={loading}
        >{loading ? 'Adding...' : 'Update Employee'}</button>

      </form>

    </div>
    ) : <div>Loading...</div>}</>
  )
}

export default Edit