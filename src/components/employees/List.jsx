import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployees] = useState([])

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get('https://ems-server-khaki.vercel.app/api/employee', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            id: emp._id,
            sno: sno++,
            dept_name: emp.department.dept_name,
            name: emp.userID.name,
            dob: new Date(emp.dob).toLocaleDateString(),
            profileImage: `https://ems-server-khaki.vercel.app/uploads/${emp.userID.profileImage}`, // Corrected path
            action: (<EmployeeButtons id={emp._id} />)
          }));
          setEmployees(data);
          setFilteredEmployees(data)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
    const records = employees.filter((emp) => (
      emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    ))
    setFilteredEmployees(records)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Heading */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Manage Employees</h3>
      </div>

      {/* Search & Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by Dept. Name"
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 w-full md:w-auto"
          onChange={handleFilter}
        />
        <Link 
          to="/admin-dashboard/add-employee" 
          className="px-5 py-2 bg-teal-600 text-white rounded-md shadow-md hover:bg-teal-700 transition duration-200"
        >
          Add New Employee
        </Link>
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto">
        <DataTable 
          columns={columns} 
          data={filteredEmployee} 
          progressPending={empLoading} 
          className="border border-gray-200 rounded-lg shadow-md"
          pagination
        />
      </div>
    </div>
  );
};

export default List;
