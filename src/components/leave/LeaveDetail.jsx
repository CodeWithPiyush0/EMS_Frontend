import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom"

const LeaveDetail = () => {
    const { id } = useParams();
    const [leave, setLeave] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLeave = async () => {
            try {
                const response = await axios.get(`https://ems-server-khaki.vercel.app/api/leave/detail/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.data.success && response.data.leave) {
                    setLeave(response.data.leave);
                } else {
                    setLeave(null);
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error);
                }
            }
        };
        fetchLeave();
    }, [id]);

    const changeStatus = async (id, status) => {
        try {
            const response = await axios.put(`https://ems-server-khaki.vercel.app/api/leave/${id}`, {status} , {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log("Response:", response.data);

            if (response.data.success) {
                alert(`Leave ${status === "Approved" ? "Approved" : "Rejected"}`);
                navigate('/admin-dashboard/leaves')
            }
        } catch (error) {
            console.log("Error occurred while changing status:", error);
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error);
            }
        }
    }

    return (
        <>
            {leave ? (
                <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
                    <h2 className="text-2xl font-bold mb-8 text-center">Leave Details</h2>

                    {/* Grid Container */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {/* Left Side - Profile Photo */}
                        <div className="md:col-span-1 flex justify-center">
                            <img
                                src={`https://ems-server-khaki.vercel.app/uploads/${leave?.employeeId?.userID?.profileImage}`}
                                className="rounded-full border w-40 h-40 md:w-48 md:h-48 object-cover"
                                alt="Employee"
                            />
                        </div>

                        {/* Right Side - Employee Details */}
                        <div className="md:col-span-2">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">Name:</p>
                                    <p className="font-medium">{leave?.employeeId?.userID?.name || "N/A"}</p>
                                </div>

                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">Employee ID:</p>
                                    <p className="font-medium">{leave?.employeeId?.employeeID || "N/A"}</p>
                                </div>

                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">Leave Type:</p>
                                    <p className="font-medium">
                                        {leave?.leaveType}
                                    </p>
                                </div>

                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">Reason:</p>
                                    <p className="font-medium">{leave.reason || "N/A"}</p>
                                </div>

                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">Department:</p>
                                    <p className="font-medium">{leave.employeeId?.department?.dept_name || "N/A"}</p>
                                </div>

                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">Start Date:</p>
                                    <p className="font-medium">{new Date(leave.startDate).toLocaleDateString()}</p>
                                </div>

                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">End Date:</p>
                                    <p className="font-medium">{new Date(leave.endDate).toLocaleDateString()}</p>
                                </div>

                                <div className="flex space-x-3">
                                    <p className="text-lg font-bold">
                                        {leave.status === "Pending" ? "Action:" : "Status:"}
                                    </p>
                                    {leave.status === "Pending" ? (
                                        <div className="flex space-x-2">
                                            <button 
                                                className="px-2 py-0.5 bg-red-400 hover:bg-teal-400"
                                                onClick={() => changeStatus(leave._id, "Approved")}
                                            >Approve</button>
                                            <button 
                                                className="px-2 py-0.5 bg-red-400 hover:bg-teal-400"
                                                onClick={() => changeStatus(leave._id, "Rejected")}
                                            >Reject</button>
                                        </div>
                                    ) :
                                        <p className="font-medium">{leave.status}</p>
                                    }
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

export default LeaveDetail;
