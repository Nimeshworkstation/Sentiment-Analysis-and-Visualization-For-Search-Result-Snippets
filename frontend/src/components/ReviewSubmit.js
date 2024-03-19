import React,{useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { setCurrentStepDecr } from '../app/authSlice'
import { createStudy,getNextStudyID,startLexiconBasedSentimentAnalysis } from '../services/study'
import { load_user } from '../services/auth'
import {setNewStudyTrue, setNextStudyID, setNewAnalysisTrue } from '../app/searchEngineSlice'


export default function ReviewSubmit() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading,setIsLoading] = useState(false)

  const studyName = useSelector((state)=>state.searchEngine.studyDetails.studyName)
  const studyDetails = useSelector((state)=>state.searchEngine.studyDetails.studyDetails)
  const resultNum =  useSelector((state)=>state.searchEngine.numResults)
  const google_enabled = useSelector((state)=>state.searchEngine.searchEngineNames.google)
  const bing_enabled =  useSelector((state)=>state.searchEngine.searchEngineNames.bing)
  const duckduckgo_enabled =  useSelector((state)=>state.searchEngine.searchEngineNames.duckduckgo)
  const queries = useSelector((state)=>state.searchEngine.queries)
  const nextStudyID = useSelector((state)=>state.searchEngine.nextStudyID)

  const [userData, setUserData] = useState({
    id: "",
    email: "",
    name: ""
  });
  const handleprevious = ()=>{
    dispatch(setCurrentStepDecr())
  }
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
  }, []);

  useEffect(() => {
    const fetchNextStudyID = async () => {
      try {
        const response = await getNextStudyID();
        dispatch(setNextStudyID(response[0].next_id))

      } catch (error) {
        console.error('Error getting next study id:', error);
      }
    };

    fetchNextStudyID();
  }, []);
  console.log(nextStudyID)
 
  const queryData = queries.map((queryText) => ({
    study: nextStudyID, 
    query_name: queryText,
  }))

  const studyData = {
    study:{
     user: userData.id,
     study_name: studyName, 
     study_details: studyDetails,
     result_num: resultNum,
     google_enabled: google_enabled,
     bing_enabled: bing_enabled,
     duckduckgo_enabled: duckduckgo_enabled
   },
   query:queryData
 }



 const handleSubmit = async () => {
  try {
    setIsLoading(true);

    const studyResponse = await createStudy(studyData);
    console.log('API Response:', studyResponse);
    // Dispatch the action with the new study data
    dispatch(setNewStudyTrue());


    const sentimentResopnse = await startLexiconBasedSentimentAnalysis(nextStudyID)
    console.log('API Response:', sentimentResopnse);
    dispatch(setNewAnalysisTrue())

    // Navigate to the dashboard after receiving the response
    navigate('/dashboard');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};






  // const handleSubmit = async () => {
  //   try {
  //     setIsLoading(true);
  //     const studyResponse = await createStudy(studyData);
  //     console.log('API Response:', studyResponse.data);
  //     dispatch(setNewStudy(studyResponse.data))
  //     navigate('/dashboard');
  //   } catch (error) {
  //     console.error('Error:', error);
  //   } finally {
  //     setIsLoading(false); 
  //   }
  // }











  return (
    <div className="container mt-2 mb-5 " >
      <div className="row justify-content-center ">
        <div className="col-md-9 bg-dark bg-gradient text-white p-4 rounded">
          <h3 className="text-center bg-primary bg-gradient btn-block text-light btn-block p-2">
            Review your Details
          </h3>
          <div>
            <h6 className='fw-bold'>Study Name : <span>{studyName}</span></h6> 
          </div>
          <div>
           <h6 className='fw-bold'>Description : <span>{studyDetails}</span></h6>
          </div>
          <div>
           <h6 className='fw-bold'>Search Engines : {google_enabled?<span>Google</span>:""}  {bing_enabled?<span>Bing</span>:""}  {duckduckgo_enabled?<span>DuckDuckGo</span>:""} </h6>
          </div>
          <div>
           <h6 className='fw-bold'>Number of Results : <span>{resultNum}</span></h6>
          </div>
          <div>
           <h6 className='fw-bold'>Query(-ies) : {queries.map((queryText,index) => (<span key={index}>| {queryText} |</span>))} </h6>
          </div>
          <form>
<div className="row">
          <div className="d-grid gap-2 col-3 ">
            <Link className="btn btn-danger rounded-pill  btn-block" to={'/new-study/result-number'} onClick={handleprevious}>
              Back
            </Link>
          </div>
          <div className="d-grid gap-2 col-3 ms-auto">
            <Link type = "submit" className="btn btn-success text-white btn-block rounded-pill" to={"/dashboard"} onClick={handleSubmit}>
            {isLoading ? 'Submitting...' : 'Submit'}
            </Link>
          </div>
        </div>
          </form>
        </div>
      </div>
    </div>
  )
}
