import React, { useEffect, useState } from 'react'
import { fetchDepartments } from "../../utils/EmployeeHelper"
import { useNavigate } from 'react-router-dom';
import axios from "axios"



const Add = () => {

  const navigate = useNavigate();

  const [departments, setDepartments] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    dob: '',
    gender: '',
    martialStatus: '',
    designation: '',
    department: '',
    salary: '',
    password: '',
    role: '',
    image: null
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments()
      setDepartments(departments)
    }
    getDepartments()
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "image") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }))
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)

    const formDataObj = new FormData()

    Object.keys(formData).forEach((key) => {
      if (key === "image") {
        if (formData[key] instanceof File) {
          formDataObj.append("image", formData[key]);  
      } else {
        console.error("Invalid file:", formData[key]);
        alert("Invalid file format. Please upload a valid image.");
        setLoading(false);
        return;
      } }else {
      formDataObj.append(key, formData[key])
      }
    })

    try {
      const response = await axios.post('https://ems-server-khaki.vercel.app/api/employee/add', formDataObj, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "multipart/form-data" 
        }
      })

      if (response.data.success) {
        alert("Employee added successfully!");
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
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>Add New Employee</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Enter Name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter Email"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              onChange={handleChange}
              placeholder="Employee ID"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date Of Birth
            </label>
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              placeholder="DOB"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Martial Status
            </label>
            <select
              name="martialStatus"
              onChange={handleChange}
              placeholder="Martial Status"
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
              placeholder="Designation"
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
              Salary
            </label>
            <input
              type="number"
              name="salary"
              onChange={handleChange}
              placeholder="Salary"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="******"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              placeholder="Upload Image"
              accept="image/*"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
          disabled={loading}
        >{loading ? 'Adding...' : 'Add Employee'}</button>

      </form>

    </div>
  )
}

export default Add