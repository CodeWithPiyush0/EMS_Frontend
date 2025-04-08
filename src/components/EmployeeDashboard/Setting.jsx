import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import axios from 'axios'

//'Frontend/src/context/AuthContext'

const Setting = () => {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [setting, setSetting] = useState({
        userID: user._id,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [error, setError] = useState(null)

    const handleChange = (e) => {
        const {name, value} = e.target;
        setSetting({ ...setting, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(setting.newPassword !== setting.confirmPassword){
            setError("Password not matched")
        } else {
            try{
                const response = await axios.put("http://localhost:3000/api/setting/change-password", 
                    setting,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                )
                if(response.data.success){
                    alert("Password changed successfully");
                    navigate("/admin-dashboard/employees")
                    setError("")
                }
            } catch(error) {
                if(error.response && !error.response.data.success){
                    setError(error.response.data.error)
                }
            }
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <p className="text-red-500">{error}</p>
            <form onSubmit={handleSubmit}>

                <div>
                    <label className="text-sm font-medium text-gray-700">Old Password</label>
                    <input 
                        type="password"
                        name="oldPassword"
                        placeholder="Old Password"
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <input 
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <input 
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-md"
                >
                    Change Password
                </button>
            </form>
        </div>
    )
}

export default Setting