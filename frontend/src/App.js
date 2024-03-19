import {BrowserRouter,Routes,Route, useNavigate} from 'react-router-dom'
import Navbar from './components/Navbar'
import Activate from './components/Activate'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import ResetPassword from './components/ResetPassword'
import ResetPasswordConfirm from './components/ResetPasswordConfirm'
import ChangePassword from './components/ChangePassword'
import Dashboard from './components/Dashboard'
import { useSelector } from 'react-redux'
import CheckEmail from './components/CheckEmail'
import CheckEmailPassword from './components/CheckEmailPassword'
import Contact from './components/contact'
import About from './components/About'
import NewAnalysis from './components/NewAnalysis'
import Footer from './components/Footer'
import SelectSE from './components/SelectSE'
import SearchQuery from './components/SearchQuery'
import SearchResultNumber from './components/SearchResultNumber'
import ReviewSubmit from './components/ReviewSubmit'
import Analyze from './components/Analyze'
import IndividualSentiment from "./components/visualizationComponents/IndividualSentiment";
import SentimentComparision from './components/visualizationComponents/SentimentComparision';
import SentimentPieChart from './components/visualizationComponents/SentimentPieChart';
import SentimentTrend from './components/visualizationComponents/SentimentTrend';
import SentimentClassification from './components/visualizationComponents/SentimentClassfication'
function App() {
const isAuthenticated =  useSelector((state)=>state.auth.isAuthenticated)
  return (     
<div>

     <BrowserRouter>
     <Navbar/>
     <div className="d-flex flex-column min-vh-100" style={{ backgroundImage: 'url(/static/images/green.jpg)',zIndex:-2 }}> 
     <div className="flex-grow-1">
       <Routes> 
        <Route path='/dashboard' element={isAuthenticated?<Dashboard/>:<Home/>}/>   
        <Route path='/' element={!isAuthenticated?<Home/>:<Dashboard/>}/>  
        <Route path='/login' element={<Login/>}/>
        <Route path='/activate' element={<CheckEmail/>}/>
        <Route path="/reset-password-activate" element={<CheckEmailPassword/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/changepass' element={isAuthenticated? <ChangePassword/>:<Login/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}></Route>
        <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm/>}/>
        <Route path='/activate/:uid/:token' element={<Activate/>}></Route>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/new-study/*' element={isAuthenticated?<NewAnalysis/>:<Home/>}>
          <Route path='search-engine' element={<SelectSE/>}/>
          <Route path='search-query' element={<SearchQuery/>}/>
          <Route path='result-number' element={<SearchResultNumber/>}/>
          <Route path='study-review' element={<ReviewSubmit/>}/>
        </Route>
        <Route path='/analyze/:study_id' element={<Analyze />} />
        <Route path='/individualsentiment' element={<IndividualSentiment/>}></Route>
        <Route path='/sentimenttrend' element={<SentimentTrend/>}></Route>
        <Route path='/sentimentpiechart' element={<SentimentPieChart/>}></Route>
        <Route path='/sentimentcomparision' element={<SentimentComparision/>}></Route>
        <Route path='/sentimentclassification' element={<SentimentClassification/>}></Route>
        </Routes>  
     </div>
     </div>
     </BrowserRouter>
     <Footer/>
   </div>
 );
}

export default App;

