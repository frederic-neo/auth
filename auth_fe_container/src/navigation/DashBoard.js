import React from 'react'
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

const Dashboard = () => {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('REFRESH_TOKEN')
    navigate('/login')
  }

  // Extract the user details from the JWT token
  let user
  const token = localStorage.getItem('REFRESH_TOKEN')
  if (token) {
    user = jwt_decode(token)
    console.log(user)
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        <li>Name: {user?.first_name}</li>
        <li>Email: {user?.email}</li>
        <li>Verified: {user?.is_email_verified ? 'Yes' : 'No'}</li>
      </ul>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Dashboard
