import React,{useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CheckEmailPassword() {
    const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated)
    const navigate =  useNavigate()
    useEffect(() => {
        // Check if the user is already authenticated
        if (isAuthenticated) {
          // Redirect to the home page if authenticated
          navigate('/dashboard');
        }
      }, [isAuthenticated, navigate]);
  return (
    <div>CheckEmailPassword
        Check your email  and follow the instruction to reset.
    </div>
  )
}
