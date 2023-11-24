import React from 'react'
import { Navigate } from 'react-router-dom'
import { isLoggedIn } from '../helpers/utils'

const PrivateRoute = ({ children, redirect }) => {
  const auth = isLoggedIn()
  return auth ? <>{children}</> : <Navigate to={redirect} />
}

export default PrivateRoute
