import ReactPaginate from 'react-paginate';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { exportComponentAsPNG } from 'react-component-export-image';
import React, { useRef, useState } from 'react';
import { FiExternalLink } from "react-icons/fi";


export default function SentimentClassification(props) {
  const componentRef = useRef();

  const handleSavePng = () => {
    // Export the component as a PNG image
    exportComponentAsPNG(componentRef);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const sentiment = props.sentiment;
  const snippet = props.snippet;

  const [selectedSentiment, setSelectedSentiment] = useState('All');

  const data = sentiment.map((sentimentItem) => {
    // Find the corresponding snippet for the sentiment
    const snippetItem = snippet.find((snippetItem) => snippetItem.id === sentimentItem.result);
    return {
      snippet: snippetItem.snippet,
      sentiment: sentimentItem.sentiment_label,
      url:snippetItem.url,
      score:sentimentItem.normalized_sentiment_score.toFixed(2)
    };
  });

  const filteredData = data.filter((item) => {
    if (selectedSentiment === 'All') {
      return true;
    } else {
      return item.sentiment === selectedSentiment;
    }
  });

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage; 
  const itemsToDisplay = filteredData.slice(startIndex, endIndex);

  const handleSentimentFilter = (sentiment) => {
    setSelectedSentiment(sentiment);
    setCurrentPage(0);
  };

  return (
    <div>
      <div className="d-flex justify-content-end">
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid btn-group dropstart">
            <button className="navbar-toggler" type="button" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
              <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" onClick={handleSavePng}>Save as Png</a></li>
              <li><a className="dropdown-item" onClick={() => handleSentimentFilter('All')}>Default</a></li>
              <li><a className="dropdown-item" onClick={() => handleSentimentFilter('Positive')}>Filter by Positive</a></li>
              <li><a className="dropdown-item" onClick={() => handleSentimentFilter('Negative')}>Filter by Negative</a></li>
              <li><a className="dropdown-item" onClick={() => handleSentimentFilter('Neutral')}>Filter by Neutral</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <table className="table table-bordered" ref={componentRef} style={{ width: '100%', tableLayout: 'fixed' }}>
  <thead>
    <tr>
      <th scope="col" style={{ width: '68%' }}>Snippet</th>
      <th scope="col" style={{ width: '20%' }}>Sentiment</th>
      <th scope="col" style={{ width: '12%' }}>Score</th>
    </tr>
  </thead>
  <tbody>
    {itemsToDisplay.map((item, index) => (
      <tr key={index} className={`table-${item.sentiment === 'Negative' ? 'danger' : item.sentiment === 'Positive' ? 'success' : item.sentiment === 'Neutral' ? 'warning' : ''} border-${item.sentiment === 'Negative' ? 'danger' : item.sentiment === 'Positive' ? 'success' : item.sentiment === 'Neutral' ? 'warning' : ''}`}>

        <td style={{ width: '68%' }} className='text-small'>{item.snippet}<a href={item.url} target="_blank" rel="noopener noreferrer">
                <FiExternalLink />
                </a></td>
        <td style={{ width: '20%' }}>
          <span className={`badge rounded-pill text-bg-${item.sentiment === 'Negative' ? 'danger' : item.sentiment === 'Positive' ? 'success' : item.sentiment === 'Neutral' ? 'warning' : ''}`}>
            {item.sentiment}
          </span>
        </td>
        <td style={{ width: '12%' }}>{item.score}</td>
      </tr>
    ))}
  </tbody>
</table>




      <ReactPaginate
        previousLabel={<MdArrowBackIos style={{ fontSize: 18, width: 150 }} />}
        nextLabel={<MdArrowForwardIos style={{ fontSize: 18, width: 150 }} />}
        pageCount={Math.ceil(data.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'item active'}
        breakClassName={'item break-me '}
        disabledClassName={'disabled-page'}
        nextClassName={'item next '}
        pageClassName={'item pagination-page '}
        previousClassName={'item previous'}
      />
    </div>
  );
}
