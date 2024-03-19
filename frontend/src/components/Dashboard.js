import React, { useEffect, useState } from 'react';
import { load_user } from '../services/auth';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChartPie, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { listStudy, deleteStudy, listResult} from '../services/study';
import ProgressBar from "@ramonak/react-progress-bar";


export default function Dashboard() {
  const nextStudyId = useSelector((state) => state.searchEngine.nextStudyID);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const newStudy = useSelector((state) => state.searchEngine.newStudy);
  const newAnalysis = useSelector((state) => state.searchEngine.newAnalysis);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    name: ""
  });
  const [studyData, setStudyData] = useState([]);
  const [Results, setResults] = useState(null);

  let seData = []
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await load_user();
        setUserData({
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
        });

        const data = await listStudy(response.data.id);
        setStudyData(data);

      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    studyData.forEach((study) => {
      fetchResult(study.id);
    });
  }, [studyData]);

  const fetchResult = async (studyId) => {
    try {
      const response = await listResult(studyId);
      setResults({
        title: response.title,
        url: response.url,
        snippet: response.snippet,
      });




    } catch (error) {
      console.error('Error loading result:', error);
    }
  };

  const handleDelete = async (study_name, user) => {
    try {
      await deleteStudy(user, study_name);
      setStudyData((prevData) => prevData.filter((study) => study.study_name !== study_name));
    } catch (error) {
      console.error('Error deleting study:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleAnalyze = (study_id, study_name, study_details,result_num) => {
    navigate(`/analyze/${study_id}`, {
      state: { study_name, study_details,result_num },
    });
  };
  
  

  return (
    <div className=''>
      <div className="container-fluid">
        <div className="row"></div>
        <div className='row'>
          <div className="col-sm-3 mt-2">
            <div className="bg-dark text-center text-light p-2 rounded">
              <h3>User Details</h3>
            </div>
            <div className='mt-3 bg-dark p-2'>
              <div className="text-light">
                <h5 className='fw-bold'>Name : <span className='fst-italic'>{userData.name}</span></h5>
                <h5 className='fw-bold'>Email : <span className='fst-italic'>{userData.email}</span></h5>
              </div>
            </div>
          </div>

          <div className="col-sm-9 mt-2 mb-2">
            <div className="bg-dark  rounded p-2">
              <h3 className='text-light'> Your Analysis</h3>
            </div>
            {studyData.slice().reverse().map((study, index) => (
              <div className="card text-center mt-3" key={index}>
                <div className="card-header">Study Number . {index + 1}</div>
                <div className="card-body">
                  <h5 className="card-title">{study.study_name}</h5>
                  <p className="card-text text-muted">{study.study_details}</p>
                  
                  <button type="button" className="btn btn-warning position-relative ms-3 me-3"   onClick={() =>
    handleAnalyze(study.id, study.study_name, study.study_details,study.result_num)
  }>
                    <FontAwesomeIcon icon={faChartPie} /> Analyze
                    {study.id === nextStudyId && (
                      <span className="position-absolute top-0 start-80 translate-middle badge rounded-pill bg-danger">
                        New
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    )}
                  </button>
                  
                  <button type="button" className="btn btn-danger position-relative ms-3 me-3" onClick={() => handleDelete(study.study_name, userData.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                  <div className='mt-3'>
                  {
  study.id === nextStudyId ? (
    !newStudy && !newAnalysis ? (
      <ProgressBar completed={35} customLabel="Getting Results..." labelAlignment="center" bgColor="#2E8B57" animateOnRender={true} />
    ) : newStudy && !newAnalysis ? (
      <ProgressBar completed={70} customLabel="Perfoming Sentiment Analysis..." labelAlignment="center" bgColor='#FF5733' animateOnRender={true} />
    ) : newStudy && newAnalysis ? (
      <ProgressBar completed={100} customLabel={<div>Analysis Completed <FontAwesomeIcon icon={faCircleCheck} /></div>} labelAlignment="center" bgColor='#36A2EB' animateOnRender={true} />
    ) : null
  ) : (
    <ProgressBar completed={100} customLabel={<div>Analysis Completed <FontAwesomeIcon icon={faCircleCheck} /></div>} labelAlignment="center" bgColor='#36A2EB' animateOnRender={true} />
  )
}



                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
