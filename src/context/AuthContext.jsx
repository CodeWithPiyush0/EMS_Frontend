import React, { createContext, useContext, useState, useEffect } from 'react'

const userContext = createContext()

const AuthContext = ({children}) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user')
        return storedUser ? JSON.parse(storedUser) : null
    })

    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const verifyUser = async () => {
            try {
                const token = localStorage.getItem('token')
                if(token){
                const response = await axios.get('https://ems-server-khaki.vercel.app/api/auth/verify', {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                if(response.data.success){
                    setUser(response.data.user)
                }
            } else {
                setUser(null)
                setLoading(false)
            }
            } catch (error) {
                if(error.response && !error.response.data.error){
                    setUser(null)
                }
            } finally {
                setLoading(false)
            }
        }
        verifyUser()
    }, [])
    

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }
  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
        {children}
    </userContext.Provider>
  )
}

export const useAuth = () => useContext(userContext)

export default AuthContext