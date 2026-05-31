import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import RootLayout from './Layout/RootLayout.jsx';
import Home from './Components/Pages/Home/Home.jsx';
import Login from './Components/Pages/Auth/Login/Login.jsx';
import Register from './Components/Pages/Auth/Register/Register.jsx';
import DashboardLayout from './Layout/DashboardLayout.jsx';
import AuthProvider from './Provider/AuthProvider.jsx';
import InputData from './Components/Pages/Home/InputData.jsx';
import ApplyAlgorithm from './Components/Pages/Home/ApplyAlgorithm.jsx';
import CalculatedData from './Components/Pages/CalculatedData/CalculatedData.jsx';
import DataDetails from './Components/Pages/DataDetails/DataDetails.jsx';
import AboutProject from './Components/Pages/AboutProject/AboutProject.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/register',
        element: <Register></Register>
      },
      {
        path:'/InputData',
        element:<InputData></InputData>
      },
      {
        path:'/ApplyAlgorithm',
        element:<ApplyAlgorithm></ApplyAlgorithm>
      },
      {
        path:'/CalculatedData',
        element:<CalculatedData></CalculatedData>
      },
      {
        path:'/DataDetails/:id',
        element:<DataDetails></DataDetails>
      },
      {
        path:'/AboutProject',
        element:<AboutProject></AboutProject>
      }
    ]
  },
  {
    path: '/dashboard',
    element: <DashboardLayout></DashboardLayout>,

  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
