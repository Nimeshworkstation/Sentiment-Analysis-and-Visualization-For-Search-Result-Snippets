import React, { useState, useEffect, useRef } from "react";
import ReactPaginate from "react-paginate";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import FileSaver from "file-saver";
import { FiExternalLink } from "react-icons/fi";

export default function SentimentTable(props) {
  const componentRef = useRef();

  const itemsPerPage = 10;
  const rawData = props.data;

  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [totalPages, setTotalPages] = useState(Math.ceil(rawData.length / itemsPerPage));

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const handleQueryChange = (query) => {
    setCurrentPage(0);
    setSelectedQuery(query);
  };

  useEffect(() => {
    const offset = currentPage * itemsPerPage;

    const filteredData = selectedQuery
      ? rawData.filter((item) => item.Query === selectedQuery)
      : rawData;

    const newPageData = filteredData.slice(offset, offset + itemsPerPage);

    setCurrentPageData(newPageData);

    const newTotalPages = Math.ceil(filteredData.length / itemsPerPage);
    setTotalPages(newTotalPages);
  }, [currentPage, rawData, selectedQuery]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsCSV = () => {
    // Code to save table data as CSV file
    // ...

    // Example using FileSaver.js
    const csvData = "Example CSV Data";
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    FileSaver.saveAs(blob, "sentiment-data.csv");
  };

  const queryNames = [...new Set(rawData.map((item) => item.Query))];

  return (
    <div>
      <div className="d-flex justify-content-end">
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid btn-group dropstart">
            <button
              className="btn btn-secondary navbar-toggler"
              type="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded="false"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" onClick={handlePrint}>
                  Print
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div>
        <label>Select Query</label>
        <select
          className="form-select"
          value={selectedQuery || ""}
          onChange={(e) => handleQueryChange(e.target.value)}
        >
          <option value="">All</option>
          {queryNames.map((query, index) => (
            <option key={index} value={query}>
              {query}
            </option>
          ))}
        </select>
      </div>

      <table className="table table-bordered" ref={componentRef} style={{ width: '100%', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th scope="col" style={{ width: '55%' }}>Snippet</th>
            <th scope="col" style={{ width: '20%' }}>Sentiment</th>
            <th scope="col" style={{ width: '12%' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((item, index) => (
            <tr key={index} className={`table-${item.sentiment_label === 'Negative' ? 'danger' : item.sentiment_label === 'Positive' ? 'success' : item.sentiment_label === 'Neutral' ? 'warning' : ''} border-${item.sentiment === 'Negative' ? 'danger' : item.sentiment === 'Positive' ? 'success' : item.sentiment === 'Neutral' ? 'warning' : ''}`}>

              <td style={{ width: '55%' }} className='text-small'>{item.snippet}<a href={item.url} target="_blank" rel="noopener noreferrer">
                <FiExternalLink />
                </a></td>
              <td style={{ width: '20%' }}>
                <span className={`badge rounded-pill text-bg-${item.sentiment_label === 'Negative' ? 'danger' : item.sentiment_label === 'Positive' ? 'success' : item.sentiment_label === 'Neutral' ? 'warning' : ''}`}>
                  {item.sentiment_label}
                </span>
              </td>
              <td style={{ width: '12%' }}>{item.normalized_sentiment_score.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={<MdArrowBackIos style={{ fontSize: 18, width: 150 }} />}
        nextLabel={<MdArrowForwardIos style={{ fontSize: 18, width: 150 }} />}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={10}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"item active"}
        breakClassName={"item break-me"}
        disabledClassName={"disabled-page"}
        nextClassName={"item next"}
        pageClassName={"item pagination-page"}
        previousClassName={"item previous"}
      />
    </div>
  );
}
