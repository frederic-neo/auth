import React from 'react'
import RouterMain from './navigation/RouterMain'
import {
  RouterProvider,
  createBrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom'

const router = createBrowserRouter([{ path: '*', Component: RouterMain }])

export default function App() {
  return <RouterProvider router={router} />
}

// const App = () => {
//   return (
//     <div className='min-h-screen w-full'>
//       <RouterMain />
//     </div>
//   )
// }

// export default App
