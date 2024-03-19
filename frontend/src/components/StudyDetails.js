import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStepIncr } from '../app/authSlice';
import { setStudyDetails,setNewStudy } from '../app/searchEngineSlice';
import { checkStudyName } from '../services/study';
import { load_user } from '../services/auth';

export default function StudyDetails() {
  const formData = useSelector((state) => state.searchEngine.studyDetails);
  const dispatch = useDispatch();
  const [studyNameExists, setStudyNameExists] = useState(false);
  const [userData, setUserData] = useState({
    id: ""
  });
  const handleNextClick = () => {
    dispatch(setCurrentStepIncr());
  };
  const { studyName, studyDetails } = formData;

  const onChange = (e) => dispatch(setStudyDetails({ [e.target.name]: e.target.value }));

  const checkStudyNameExists = async () => {
    if (studyName) {
      try {
        const response = await checkStudyName(userData.id,studyName ); // Pass user ID
        const study_name = response.study_name;

        if (study_name) {
          setStudyNameExists(true);
        } else {
          setStudyNameExists(false);
        }
      } catch (error) {
        console.error('Error checking study name existence:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await load_user();
        setUserData({
          id: response.data.id
        });
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    checkStudyNameExists();
  }, [studyName, userData.id]); // Include userData.id as a dependency

  // Enable "Next" button only when both fields are filled
  const isNextButtonEnabled = studyName && studyDetails;



  return (
    <div className="container mt-2 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-9 bg-dark bg-gradient text-white p-4 rounded">
          <h3 className="text-center bg-primary bg-gradient btn-block text-light btn-block p-2">
            Create Study
          </h3>
          <form>
            <div className="mb-3">
              <label htmlFor="studyName" className="form-label">
                Study Name
              </label>
              <input
                type="text"
                className={`form-control ${studyNameExists ? 'is-invalid' : ''}`}
                id="studyName"
                name="studyName"
                required
                onChange={onChange}
                value={formData.studyName}
                onBlur={checkStudyNameExists}
              />
              {studyNameExists && (
            <div className="invalid-feedback">
              This study name already exists.Please choose a different study name.
            </div>
          )}
            </div>
            <div className="mb-3">
              <label htmlFor="studyDetails" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="studyDetails"
                name="studyDetails"
                rows="4"
                required
                onChange={onChange}
                value={formData.studyDetails}
              ></textarea>
            </div>
            <div className="row">
              <div className="d-grid gap-2 col-6 mx-auto"></div>
              {isNextButtonEnabled && (
                <div className="d-grid gap-2 col-3 ms-auto">
                  <Link
                    className="btn btn-success text-white btn-block rounded-pill"
                    onClick={handleNextClick}
                    to={'/new-study/search-engine'}
                  >
                    <span className="fw-bold">Next</span>
                  </Link>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
