import React, { useEffect } from 'react';
import Progress from './Progress';
import StudyDetails from './StudyDetails';
import SelectSE from './SelectSE';
import SearchQuery from './SearchQuery';
import { Route, Routes } from 'react-router-dom';
import ReviewSubmit from './ReviewSubmit';
import SearchResultNumber from './SearchResultNumber';
import { useDispatch } from 'react-redux';
import { resetCurrentStep } from '../app/authSlice';
import { setNewStudyFalse,setNewAnalysisFalse } from '../app/searchEngineSlice';

export default function NewAnalysis() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCurrentStep());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setNewStudyFalse());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setNewAnalysisFalse());
  }, [dispatch]);
  return (
    <>
      <div className='container'>
        <div className="row text-center d-flex justify-content-center align-items-center text-center">
          <div className="col-sm-9">
            <Progress />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<StudyDetails />} />
          <Route path="/search-engine" element={<SelectSE />} />
          <Route path="/search-query" element={<SearchQuery />} />
          <Route path="/result-number" element={<SearchResultNumber />} />
          <Route path='/study-review' element={<ReviewSubmit/>}/>
        </Routes>
      </div>
    </>
  );
}
