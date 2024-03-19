import React ,{useEffect,useState}from 'react'
import { Link, useNavigate,useLocation } from 'react-router-dom'
import {userLogout} from '../app/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { load_user } from '../services/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh,faHome, faCircleInfo,faUser,faMagnifyingGlassChart ,faArrowRightFromBracket,faComment,faRightToBracket,faUserPlus} from '@fortawesome/free-solid-svg-icons';

export default function Navbar(props) {
  const isAuthenticated =  useSelector((state)=>state.auth.isAuthenticated)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    name: ""
  });

  const handleLogout = () => {
    dispatch(userLogout());
    navigate('/')
    
  };




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await load_user();
        setUserData({
          id:response.data.id,
          email: response.data.email,
          name: response.data.name
        });
        
      
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    fetchData();
  }, [isAuthenticated]);

    
  return (
    <>
<nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
  <div className="container-fluid">
 
  <img src="static/images/logo1.jpg" width="200" height="50" />

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav">
       { !isAuthenticated && (<li className="nav-item mx-3">
          <Link className={`nav-link ${window.location.pathname === '/' ? 'active ' : ''}`} aria-current="page" to="/"><FontAwesomeIcon icon={faHome} /> {/* Home icon */} Home</Link>
        </li>)}
        { isAuthenticated && (<li className="nav-item mx-3">
          <Link className={`nav-link ${window.location.pathname === '/dashboard' ? 'active bg-warning text-dark' : ''}`} aria-current="page" to="/dashboard"><FontAwesomeIcon icon={faGaugeHigh} /> Dashboard</Link>
        </li>)}
        { isAuthenticated && (<li className="nav-item mx-3">
          <Link className={`nav-link ${window.location.pathname === '/new-study' ||window.location.pathname === '/new-study/search-engine' || window.location.pathname === '/new-study/search-query' || window.location.pathname === '/new-study/result-number' || window.location.pathname === '/new-study/study-review'? 'active bg-warning text-dark' : ''}`} to="/new-study"> <FontAwesomeIcon icon={faMagnifyingGlassChart} /> New Analysis</Link>
        </li>)}
        

        
      </ul>
    <ul className="navbar-nav ms-auto me-3"> 
    <li className="nav-item mx-3">
          <Link className={`nav-link ${window.location.pathname === '/about' ? 'active bg-warning text-dark' : ''}`} to="/about"><FontAwesomeIcon icon={faCircleInfo} />  About</Link>
        </li>
        <li className="nav-item mx-3">
          <Link className={`nav-link ${window.location.pathname === '/contact' ? 'active bg-warning text-dark' : ''} `} to="/contact" > <FontAwesomeIcon icon={faComment} /> contact</Link>
        </li>
        { !isAuthenticated && (<li className="nav-item mx-3">
          <Link className={`nav-link ${window.location.pathname === '/login' ? 'active bg-warning text-dark' : ''}`} to="/login" ><FontAwesomeIcon icon={faRightToBracket} /> Login</Link>
        </li>)}
        { !isAuthenticated && (<li className="nav-item mx-3">
          <Link className={`nav-link ${window.location.pathname === '/signup' ? 'active bg-warning text-dark' : ''}`} to="/signup" > <FontAwesomeIcon icon={faUserPlus} /> Register</Link>
        </li>)}
        
        { isAuthenticated &&  ( <li className="nav-item dropdown">
          <Link className={`nav-link dropdown-toggle ${location.pathname === '#' ? 'active' : ''}`} to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> 
          <FontAwesomeIcon icon={faUser} /> {userData.email} 
          </Link>
          <ul className="dropdown-menu dropdown-menu-end"> 
            <li>
            <Link className='dropdown-item' to="/" onClick={handleLogout}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
           </Link>
              </li>
            <li><hr className="dropdown-divider"/></li>
            <li>
            <Link className="dropdown-item" to="/changepass">Change Password</Link>
            </li>
            <li><hr className="dropdown-divider"/></li>
            <li><Link className="dropdown-item" to="#">Profile</Link></li>
          </ul>
        </li>)}
      </ul>
    </div>
  </div>
</nav>

      
      
</>
  )
}
