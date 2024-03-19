import React, { useEffect } from 'react';
import '../app/customcss.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentStepDecr, setCurrentStepIncr } from '../app/authSlice';

export default function Progress() {
  const currentStep = useSelector((state) => state.auth.currentStep);

  const dispatch = useDispatch(); // Add useDispatch to dispatch actions

  useEffect(() => {
    const circles = document.querySelectorAll(".circle");
    const progressBar = document.querySelector(".indicator");
  
    // Function to reset the progressBar
    const resetProgressBar = () => {
      progressBar.style.width = '0%'; // Reset the width to 0%
      circles.forEach((circle) => {
        circle.classList.remove('active'); // Remove the 'active' class from all circles
      });
    };
  
    circles.forEach((circle, index) => {
      if (index < currentStep) {
        circle.classList.add('active');
      } else {
        circle.classList.remove('active');
      }
    });
  
    const progressWidth = ((currentStep - 1) / (circles.length - 1)) * 100 + '%';
    progressBar.style.width = progressWidth;

    return () => {
      resetProgressBar();
    };
  }, [currentStep]);
  
 const handleStep = (e) => {
    if (e.target.id === 'next') {
      dispatch(setCurrentStepIncr()); // Dispatch the action to increment the step
    } else if (e.target.id === 'prev') {
      dispatch(setCurrentStepDecr()); // Dispatch the action to decrement the step
    }
  };
  return (
    <div className="container">
      <div className="row edit">
        <div className="containers">
          <div className="steps">
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={index} className={`circle ${index < currentStep ? 'active' : ''}`}>
                {index < currentStep ? <FontAwesomeIcon icon={faCheck} /> : index + 1}
              </span>
            ))}
            <div className="progress-bar">
              <span className="indicator"></span>
            </div>
          </div>
          {/* <div className="buttons">
            <button
              id="prev"
              className={`btn btn-primary ${currentStep === 1 ? 'disabled' : ''}`}
              onClick={handleStep}
              disabled={currentStep === 1} // Use the disabled attribute to disable the button
            >
              Prev
            </button>
            <button
              id="next"
              className={`btn btn-primary ${currentStep === 4 ? 'disabled' : ''} ms-5`}
              onClick={handleStep}
              disabled={currentStep === 4} // Use the disabled attribute to disable the button
            >
              Next
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
