import React, { useState, useEffect } from "react";
import {
 ComposedChart,
 Bar,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 Area
} from "recharts";
import ReactPaginate from "react-paginate";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import FileSaver from "file-saver";
import { useCurrentPng } from "recharts-to-png";
import { v4 as uuidv4 } from "uuid";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

export default function SentimentTrend(props) {
 const itemsPerPage = 15;
 const rawData = props.data;

 const data = rawData.map((item, index) => ({
   name: `Snippet ${index + 1}`,
   uv: item.normalized_sentiment_score - 3,
   query: item.Query,
 }));

 const [currentPage, setCurrentPage] = useState(0);
 const [currentPageData, setCurrentPageData] = useState([]);
 const [gradientOffset, setGradientOffset] = useState(0);
 const [gradientId, setGradientId] = useState(`splitColor-${uuidv4()}`);
 const [selectedQuery, setSelectedQuery] = useState(null);
 const [totalPages, setTotalPages] = useState(Math.ceil(data.length / itemsPerPage));

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
     ? data.filter((item) => item.query === selectedQuery)
     : data;

   const newPageData = filteredData.slice(offset, offset + itemsPerPage);

   const dataMax = Math.max(...newPageData.map((i) => i.uv));
   const dataMin = Math.min(...newPageData.map((i) => i.uv));

   if (dataMax <= 0) {
     setGradientOffset(0);
   } else if (dataMin >= 0) {
     setGradientOffset(1);
   } else {
     setGradientOffset(dataMax / (dataMax - dataMin));
   }

   setCurrentPageData(newPageData);

   setGradientId(`splitColor-${uuidv4()}`);

   const newTotalPages = Math.ceil(filteredData.length / itemsPerPage);
   setTotalPages(newTotalPages);
 }, [currentPage, data, selectedQuery]);

 const [getChartPng, { ref: chartRef }] = useCurrentPng();

 const handleSavePng = async () => {
   const chartPng = await getChartPng();
   if (chartPng) {
     FileSaver.saveAs(chartPng, "sentiment-chart.png");
   }
 };

 const handlePrint = () => {
   window.print();
 };

 const queryNames = [...new Set(data.map((item) => item.query))];

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
              <li>
                <a className="dropdown-item" onClick={handleSavePng}>
                  Save as Png
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

      <ComposedChart
        ref={chartRef}
        width={475}
        height={400}
        data={currentPageData}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" type="category" angle={-45} textAnchor="end" interval={0} />
        <YAxis
          type="number"
          domain={[-2, 2]}
          tickPosition="middle"
          ticks={[-2, 0, 2]}
          tickFormatter={(value) => {
            if (value === -2) {
              return "Negative";
            } else if (value === 0) {
              return "Neutral";
            } else if (value === 2) {
              return "Positive";
            }
            return "";
          }}
        />
        <Tooltip />

        <Bar dataKey="uv" barSize={20} fill="lightgrey" />

        <defs>
          <linearGradient id={`splitColor-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset={gradientOffset} stopColor="green" stopOpacity={0.5} />
            <stop offset={gradientOffset} stopColor="red" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="uv"
          stroke="#000"
          fill={`url(#splitColor-${gradientId})`}
          fillOpacity={1}
        />
      </ComposedChart>

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
