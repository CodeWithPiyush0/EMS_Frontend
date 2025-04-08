import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AddDepartment = () => {
    const [departments, setDepartment] = useState({
        dept_name: '',
        description: ''
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        const {name, value} = e.target;
        setDepartment({...departments, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:3000/api/department/add', departments, {
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
    <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96'>
        <div>
            <h2 className='text-2xl font-bold mb-6'>Add Department</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="dept_name" className='text-sm font-medium text-gray-700'>Deaprtment Name</label>
                    <input 
                    type="text" 
                    name="dept_name"
                    placeholder='Enter Dept. Name' 
                    onChange={handleChange}
                    className='mt-1 w-full p-2 border border-gray-300 rounded-md' />
                </div>
                <div className='mt-3'>
                    <label htmlFor="description" 
                    className='block text-sm font-medium text-gray-700'>Description</label>

                    <textarea 
                    name="description" 
                    placeholder='Description' 
                    onChange={handleChange}
                    className='mt-1 p-2 block w-full border border-gray-300 rounded-md'></textarea>
                    <button type='submit' className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'>Add Department</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddDepartment