import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { columns, DeaprtmentButtons } from '../../utils/DeparmentHelper'
import axios from 'axios'

const DepartmentList = () => {
    const [departments, setDepartment] = useState([])
    const [deptLoading, setDeptLoading] = useState(false)
    const [filteredDepartments, setFileteredDepartments] = useState([])

    const onDepartmentDelete = async () => {
        fetchDepartments()
    }

    const fetchDepartments = async () => {
        setDeptLoading(true)
        try {
            const response = await axios.get('http://localhost:3000/api/department', {
                headers: {
                    "Authorization" : `Bearer ${localStorage.getItem('token')}`
                }
            }) 
            if(response.data.success){
                let sno = 1
                const data = await response.data.departments.map((dep) => (
                    {
                        id: dep._id,
                        sno: sno++,
                        dept_name: dep.dept_name,
                        action: (<DeaprtmentButtons id={dep._id} onDepartmentDelete={onDepartmentDelete}/>)
                    }
                ))
                setDepartment(data)
                setFileteredDepartments(data)
            }
        } catch (error) {
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
        } finally{
            setDeptLoading(false)
        }
    }

    useEffect(() => {
        
        fetchDepartments();
    }, [])

    const filterDepartments = (e) => {
        const records = departments.filter((dep) => dep.dept_name.toLowerCase().includes(e.target.value.toLowerCase())) 
        setFileteredDepartments(records)
    }

    return (
        <>{deptLoading ? <div>Loading...</div> :
        <div className='p-5 '>
            <div className='text-center'>
                <h3 className='text-2xl font-bold'>Manage Departments</h3>
            </div>
            <div className='flex justify-between items-center'>
                <input 
                    type="text" 
                    placeholder='Search By Dept. Name' 
                    className='px-4 py-0.5 border border-teal-200'
                    onChange={filterDepartments}
                />
                <Link to="/admin-dashboard/add-department" className='px-4 py-1 bg-teal-600 rounded text-white'>Add New Department</Link>
            </div>

            <div className='mt-5'>
                <DataTable
                columns={columns} data={filteredDepartments} pagination
                />
            </div>
        </div>
        }</>
    )
}

export default DepartmentList