import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useractivate } from '../services/auth';
export default function Activate() {
const { uid, token } = useParams();
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const activateUser = async () => {


      try {
        // Make a POST request to activate the user
        const response = await useractivate(uid,token);

        console.log(response.data)
        navigate('/login');
      } catch (err) {
        // Handle errors, e.g., display an error message
        console.error('Activation failed:', err);
      }
    };

    activateUser(); // Call the activation function when the component mounts
  }, [uid, token, navigate]); // Include navigate as a dependency

  return (
    <div className='container'>
    <div
      className='d-flex flex-column justify-content-center align-items-center'
      style={{ marginTop: '300px' }}
    >
      <h1 className='text-white'>Activating your account <span>   </span>
      <div className="spinner-border" style={{ width: '1rem', height: '1rem' }} role="status">
  <span className="visually-hidden">Loading...</span>
</div>


      </h1>
    </div>
  </div>
  
  );
}
