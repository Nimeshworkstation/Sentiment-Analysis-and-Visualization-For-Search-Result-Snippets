import React from 'react';
import { Link } from 'react-router-dom';
import { setCurrentStepDecr, setCurrentStepIncr } from '../app/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchEngine } from '../app/searchEngineSlice';

export default function SelectSE() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.searchEngine.searchEngineNames);
  const { google, bing, duckduckgo } = formData;

  const onChange = (e) => {
    dispatch(setSearchEngine(e.target.name));
  };

  const onSubmit = (e) => {
    e.preventDefault();
  }

  const handleprevious = () => {
    dispatch(setCurrentStepDecr());
  };

  const handlenext = () => {
    dispatch(setCurrentStepIncr());
  };

  const isNextButtonEnabled = google || bing || duckduckgo

  return (
    <div className="container mt-2">
      <div className="row justify-content-center">
        <div className="col-md-9 bg-dark bg-gradient text-white p-4 rounded">
          <h3 className="text-center bg-primary bg-gradient btn-block text-light btn-block  p-1">Search Engines</h3>
          <form onSubmit={onSubmit}>
            <div className="row">
              <div className="col-sm-4">
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="google"
                    name="google"
                    checked={google}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="google">
                    Google
                  </label>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="bing"
                    name="bing"
                    checked={bing}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="bing">
                    Bing
                  </label>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="duckduckgo"
                    name="duckduckgo"
                    checked={duckduckgo}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="duckduckgo">
                    DuckDuckGo
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="d-grid gap-2 col-3">
                <Link
                  className="btn btn-danger rounded-pill  btn-block"
                  to={'/new-study'}
                  onClick={handleprevious}
                >
                  Back
                </Link>
              </div>
              
             {  isNextButtonEnabled && (<div className="d-grid gap-2 col-3 ms-auto">
                <Link
                  className="btn btn-success text-white btn-block rounded-pill"
                  to={"/new-study/search-query"}
                  onClick={handlenext}
                >
                  Next
                </Link>
              </div>)}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
