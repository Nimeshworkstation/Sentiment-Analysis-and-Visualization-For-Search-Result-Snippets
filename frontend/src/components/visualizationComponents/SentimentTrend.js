import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area
} from "recharts";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import FileSaver from "file-saver";
import { useCurrentPng } from "recharts-to-png";
import { v4 as uuidv4 } from 'uuid';

export default function SentimentTrend(props) {
  const itemsPerPage = 10;
  const data = props.data.map((item, index) => ({
    name: `Snippet ${index + 1}`,
    uv: item.normalized_sentiment_score - 3,
  }));

  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [gradientOffset, setGradientOffset] = useState(0);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
  
    const offset = currentPage * itemsPerPage;
    const newPageData = data.slice(offset, offset + itemsPerPage);
  
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
  
  }, [currentPage, data]); // Include props.id as a dependency
  
  
  const gradientId = `splitColor-${uuidv4()}`;
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
  return (
    <div>
      <div className="d-flex justify-content-end">
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid btn-group dropstart">
            <button
              className="navbar-toggler"
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
        pageCount={Math.ceil(data.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
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
