import React from 'react'
import { Link } from 'react-router-dom'

export default function contact() {
  return (
    <div className="container-fluid" >
    <div className="container mt-2 " >
      <div className="row justify-content-center ">
        <div className="col-md-6 bg-dark bg-gradient text-white p-4 rounded">
          <h3 className="text-center bg-primary bg-gradient btn-block text-light btn-block p-2 rounded-pill">
            Contact Us
          </h3>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Your Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                
                required
                
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Your Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                
                required
                
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Your Message
              </label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                
                rows="4"
                required
                
              ></textarea>
            </div>
            <div className="row">
          <div className="d-grid gap-2 col-6 mx-auto">
            <button type="submit" className="btn btn-danger rounded-pill btn-block">
              Send Message
            </button>
          </div>
          <div className="d-grid gap-2 col-6 mx-auto">
            <Link className="btn btn-success text-white btn-block rounded-pill" to="/">
              Go Back
            </Link>
          </div>
        </div>
          </form>
          
        </div>
      </div>
    </div>
    </div>
  )
}
