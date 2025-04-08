import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const View = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/employee/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.data.success && response.data.employee) {
                    setEmployee(response.data.employee);
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
    }, [id]);

    return (
        <>
            {employee ? (
                <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
                    <h2 className="text-2xl font-bold mb-8 text-center">Employee Details</h2>

                    {/* Grid Container */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {/* Left Side - Profile Photo */}
                        <div className="md:col-span-1 flex justify-center">
                            <img 
                                src={`http://localhost:3000/uploads/${employee?.userID?.profileImage}`} 
                                className="rounded-full border w-40 h-40 md:w-48 md:h-48 object-cover"
                                alt="Employee"
                            />
                        </div>

                        {/* Right Side - Employee Details */}
                        <div className="md:col-span-2">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">Name:</p>
                                    <p className="font-medium">{employee?.userID?.name || "N/A"}</p>
                                </div>

                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">Employee ID:</p>
                                    <p className="font-medium">{employee?.employeeID || "N/A"}</p>
                                </div>

                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">Date of Birth:</p>
                                    <p className="font-medium">
                                        {employee?.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>

                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">Gender:</p>
                                    <p className="font-medium">{employee?.gender || "N/A"}</p>
                                </div>

                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">Department:</p>
                                    <p className="font-medium">{employee?.department?.dept_name || "N/A"}</p>
                                </div>

                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">Marital Status:</p>
                                    <p className="font-medium">{employee?.martialStatus || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center mt-10">Loading...</div>
            )}
        </>
    );
};

export default View;
