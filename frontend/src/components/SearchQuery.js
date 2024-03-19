import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStepDecr, setCurrentStepIncr } from '../app/authSlice';
import { setQueries } from '../app/searchEngineSlice';

export default function SearchQuery() {
  const queries = useSelector((state) => state.searchEngine.queries);
  const dispatch = useDispatch();
  const [textAreaInput, setTextAreaInput] = useState('');

  useEffect(() => {
    // Update the textAreaInput state when queries change
    setTextAreaInput(queries.join('\n'));
  }, [queries]);

  const [fileInput, setFileInput] = useState(null);

  const parseCSVData = async (csvFile) => {
    try {
      const text = await csvFile.text();
      const queryArray = text
        .split('\n')
        .map((query) => query.trim())
        .filter((query) => query.length > 0); // Filter out empty strings
      return queryArray;
    } catch (error) {
      console.error("Error parsing CSV file:", error);
      return [];
    }
  };

  const handlenext = () => {
    dispatch(setCurrentStepIncr());
  };

  const handleprevious = () => {
    dispatch(setCurrentStepDecr());
  };

  const handleQueryFile = async (e) => {
    const file = e.target.files[0];
    const queryArray = await parseCSVData(file);
    dispatch(setQueries(queryArray));
    setFileInput(file); // Set the file input
    setTextAreaInput(queryArray.join('\n')); // Update the textarea input
  };

  const handleQuery = (e) => {
    const enteredQueries = e.target.value;
    const queryArray = enteredQueries.split('\n'); 
    dispatch(setQueries(queryArray));
    setTextAreaInput(enteredQueries); 
    setFileInput(null);
  };

  return (
    <div className="container mt-2 mb-5 ">
      <div className="row justify-content-center ">
        <div className="col-md-9 bg-dark bg-gradient text-white p-4 rounded">
          <h3 className="text-center bg-primary bg-gradient btn-block text-light btn-block p-2">
            Search Queries
          </h3>
          <form>
            <div className="mb-3">
              <label htmlFor="query" className="form-label">
                Query (For multiple queries, use new line for each query)
              </label>
              <textarea
                className="form-control"
                id="query"
                name="query"
                rows="4"
                required
                onChange={handleQuery}
                value={textAreaInput} // Display the queries in the textarea
              ></textarea>
            </div>
            <hr />
            <div className="mb-3">
              <label htmlFor="queryFile" className="form-label">
                List of queries (csv)
              </label>
              <input
                className="form-control"
                type="file"
                id="queryFile"
                accept=".csv"
                onChange={handleQueryFile}
              />
              {fileInput && (
                <div className="alert alert-info mt-2 alert-dismissible fade show" role="alert">
                  <strong>{queries.length}</strong> queries imported from csv File.
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}
            </div>
            <div className="row">
              <div className="d-grid gap-2 col-3 ">
                <Link type="submit" className="btn btn-danger rounded-pill btn-block" to={'/new-study/search-engine'} onClick={handleprevious}>
                  Back
                </Link>
              </div>
              {queries.length > 0 && (
                <div className="d-grid gap-2 col-3 ms-auto">
                  <Link
                    className="btn btn-success text-white btn-block rounded-pill"
                    to={'/new-study/result-number'}
                    onClick={handlenext}
                  >
                    Next
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
