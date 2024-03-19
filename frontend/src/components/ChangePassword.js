import React, { useState, useEffect } from 'react';
import { userLogout } from '../app/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate ,Link} from 'react-router-dom';
import { changePassword } from '../services/auth';

export default function Delete(props) {
  const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated)
  const access = localStorage.getItem('access')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    re_new_password: ""
  });

  const { current_password, new_password, re_new_password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (new_password === re_new_password) {
      try {
        const response = await changePassword(access,current_password,new_password,re_new_password);
        dispatch(userLogout())
        navigate('/')
        console.log(response)
        
      } catch (error) {
        // Handle signup failure
      
      }
    }

  };


  return (
    <div className='container mt-2'>
      <div className="row justify-content-center">
        <div className="col-md-6 bg-dark bg-gradient text-white p-4 rounded">
        <h3 className="text-center bg-primary bg-gradient btn-block text-light btn-block  p-1">Change Password </h3>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="current_password" className="form-label">Old Password</label>
          <input type="password" className="form-control" id="current_password" name='current_password' value={current_password} required onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="new_password" className="form-label">New Password</label>
          <input type="password" className="form-control" id="new_password" name='new_password' value={new_password} required onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="re_new_password" className="form-label">New Password again</label>
          <input type="password" className="form-control" id="re_new_password" name='re_new_password' value={re_new_password} required onChange={onChange} />
        </div>
        <div className="row">
          <div className="d-grid gap-2 col-6 mx-auto">
            <button type="submit" className="btn btn-danger rounded-pill btn-block">
              Change Password
            </button>
          </div>
          <div className="d-grid gap-2 col-6 mx-auto">
            <Link className="btn btn-success text-white btn-block rounded-pill" to="/">
              Go Back
            </Link>
          </div>
        </div>
      </form>
      </div>
      </div>
      </div>
    
  );
}
