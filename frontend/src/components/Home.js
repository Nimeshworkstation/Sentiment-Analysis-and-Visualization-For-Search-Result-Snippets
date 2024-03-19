import React, { useEffect, useState } from 'react';
import { getImages } from '../services/auth';

export default function Home() {
  const [Images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getImages();
        setImages(data.results);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchData();
  }, []);

  console.log('Images:', Images); // Check if Images array contains data

  return (
    <>
      <div className='container mt-3'>
        <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {Images.map((element, index) => (
              <div
                key={index}
                className={`carousel-item active `}
                data-bs-interval="10000"
              >
                <img
                  src={element.url}
                  className="d-block w-100 rounded"
                  style={{ maxHeight: '400px' }}
                  alt={`Slide ${index}`}
                />
                <div className="carousel-caption d-none d-md-block text-center">
                  <h3 className="text-primary font-weight-bold">{element.caption}</h3>
                  <p className="text-dark">{element.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
            <span className="carousel-control-prev-icon bg-danger rounded" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
            <span className="carousel-control-next-icon bg-danger rounded" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
            }  
