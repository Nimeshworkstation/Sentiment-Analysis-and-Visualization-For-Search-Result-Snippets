import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentStepDecr,setCurrentStepIncr} from '../app/authSlice'
import { setSearchNumber } from '../app/searchEngineSlice'

export default function SearchResultNumber() {
  const numResults = useSelector((state)=>state.searchEngine.numResults)
  const dispatch = useDispatch()

  const handlenext = ()=>{ 
    dispatch(setCurrentStepIncr())
  }

  const handleprevious = ()=>{
    dispatch(setCurrentStepDecr())
  }


  const onChange = (e) => dispatch(setSearchNumber(e.target.value))

  const onSubmit = (e) => {
    e.preventDefault();

    try {


    } catch (error) {
      
    }
  };
  console.log(numResults)
  return (
    <div className="container mt-2 mb-5 " >
      <div className="row justify-content-center ">
        <div className="col-md-9 bg-dark bg-gradient text-white p-4 rounded">
          <h3 className="text-center bg-primary bg-gradient btn-block text-light btn-block p-2">
            Number of Search Results
          </h3>
          <form onSubmit={(e) => onSubmit(e)}>

<div className="mb-3">
              <label htmlFor="numResults" className="form-label">
              Number of results to collect
              </label>
              <input
                type="number"
                className="form-control"
                id="numResults"
                name="numResults"
                required
                 onChange={onChange} 
                 value={numResults}
                
              />
            </div>

<div className="row">
          <div className="d-grid gap-2 col-3 ">
            <Link type="submit" className="btn btn-danger rounded-pill  btn-block" to={'/new-study/search-query'} onClick={handleprevious}>
              Back
            </Link>
          </div>
        { numResults && (<div className="d-grid gap-2 col-3 ms-auto">
            <Link className="btn btn-success text-white btn-block rounded-pill" to="/new-study/study-review" onClick={handlenext}>
              Next
            </Link>
          </div>)}
        </div>
          </form>
        </div>
      </div>
    </div>
  )
}
