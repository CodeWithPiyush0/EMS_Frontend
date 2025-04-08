import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EditDepartment = () => {

    const {id} = useParams()
    const [department, setDepartment] = useState([])
    const [deptLoading, setDeptLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDepartments = async () => {
            setDeptLoading(true)
            try {
                const response = await axios.get(`https://ems-server-khaki.vercel.app/api/department/${id}`, {
                    headers: {
                        "Authorization" : `Bearer ${localStorage.getItem('token')}`
                    }
                }) 
                if(response.data.success){
                    setDepartment(response.data.department)
                }
            } catch (error) {
                if(error.response && !error.response.data.success){
                    alert(error.response.data.error)
                }
            } finally{
                setDeptLoading(false)
            }
        }
        fetchDepartments();
    }, [])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setDepartment({...department, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`http://localhost:3000/api/department/${id}`, department, {
                headers: {
                    "Authorization" : `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.data.success){
                navigate("/admin-dashboard/departments")
            }
        } catch (error) {
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
        }
    }

  return (
    <>{deptLoading ? <div>Loading...</div> :
    <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96'>
        <div>
            <h2 className='text-2xl font-bold mb-6'>Edit Department</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="dept_name" className='text-sm font-medium text-gray-700'>Department Name</label>
                    <input 
                    type="text" 
                    name="dept_name"
                    placeholder='Enter Dept. Name' 
                    onChange={handleChange}
                    value={department.dept_name}
                    className='mt-1 w-full p-2 border border-gray-300 rounded-md' required/>
                </div>
                <div className='mt-3'>
                    <label htmlFor="description" 
                    className='block text-sm font-medium text-gray-700'>Description</label>

                    <textarea 
                    name="description" 
                    placeholder='Description' 
                    onChange={handleChange}
                    value={department.description}
                    className='mt-1 p-2 block w-full border border-gray-300 rounded-md'></textarea>
                    <button type='submit' className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'>Edit Department</button>
                </div>
            </form>
        </div>
    </div>
    }</>
  )
}

export default EditDepartment