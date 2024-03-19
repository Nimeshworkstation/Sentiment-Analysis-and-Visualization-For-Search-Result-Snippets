import React,{useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { resetpasswordconfirm } from '../services/auth';
import { userLogout } from '../app/authSlice';
import { useDispatch } from 'react-redux';

export default function ResetPasswordConfirm() {
  const dispatch = useDispatch()
  const { uid, token } = useParams();
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const { new_password, re_new_password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async(e) => {
      e.preventDefault();
      if (new_password === re_new_password) {
        try {
          const response = await resetpasswordconfirm(uid,token,new_password,re_new_password);
          
          dispatch(userLogout())
          navigate('/')
          console.log(response)
        } catch (error) {
          // Handle signup failure
          
        }
      }
  };
  return (
    <div className="container mt-5">
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label htmlFor="new_password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="new_password"
          name="new_password"
          onChange={onChange}
          value={new_password}
          
        />
      </div>
      <div className="mb-3">
        <label htmlFor="re_new_password" className="form-label">
          Confirm Password
        </label>
        <input
          type="password"
          className="form-control"
          id="re_new_password"
          name="re_new_password"
          onChange={onChange}
          value={re_new_password}
          
          require
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Reset Password
      </button>
    </form>
  </div>
  )
}
