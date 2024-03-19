import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  Line,
  LabelList
} from "recharts";
import ReactPaginate from 'react-paginate';
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import FileSaver from "file-saver";
import { useCurrentPng } from "recharts-to-png";

const renderCustomizedLabel = (props) => {
  const { x, y, width, value } = props;
  const radius = 12;
  if(value>0.24){
    return (
      <svg x={x + width / 2 - 10} y={y - radius - 10} width={20} height={20} viewBox="0 0 1024 1024" fill='green'>
        <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
    </svg>
    );}
   else if(value<-0.2){
      return (
          <svg x={x + width / 2 - 10} y={y - radius - 10} width={20} height={20} viewBox="0 0 1024 1024" fill='red'>
            <path d="M517.12 53.248q95.232 0 179.2 36.352t145.92 98.304 98.304 145.92 36.352 179.2-36.352 179.2-98.304 145.92-145.92 98.304-179.2 36.352-179.2-36.352-145.92-98.304-98.304-145.92-36.352-179.2 36.352-179.2 98.304-145.92 145.92-98.304 179.2-36.352zM663.552 261.12q-15.36 0-28.16 6.656t-23.04 18.432-15.872 27.648-5.632 33.28q0 35.84 21.504 61.44t51.2 25.6 51.2-25.6 21.504-61.44q0-17.408-5.632-33.28t-15.872-27.648-23.04-18.432-28.16-6.656zM373.76 261.12q-29.696 0-50.688 25.088t-20.992 60.928 20.992 61.44 50.688 25.6 50.176-25.6 20.48-61.44-20.48-60.928-50.176-25.088zM520.192 602.112q-51.2 0-97.28 9.728t-82.944 27.648-62.464 41.472-35.84 51.2q-1.024 1.024-1.024 2.048-1.024 3.072-1.024 8.704t2.56 11.776 7.168 11.264 12.8 6.144q25.6-27.648 62.464-50.176 31.744-19.456 79.36-35.328t114.176-15.872q67.584 0 116.736 15.872t81.92 35.328q37.888 22.528 63.488 50.176 17.408-5.12 19.968-18.944t0.512-18.944-3.072-7.168-1.024-3.072q-26.624-55.296-100.352-88.576t-176.128-33.28z" />
      </svg>
          
      );}
      else{
        return (
          <svg  x={x + width / 2 - 10} y={y - radius - 10} width={20} height={20}  fill="orange" class="bi bi-emoji-neutral-fill" viewBox="0 0 16 16">
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm-3 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z"/>
</svg>
  );}
};
export default function IndividualSentiment(props) {
  const data = props.data.map((item, index) => ({
    name: `Snippet ${index + 1}`,
    uv: item.normalized_sentiment_score - 3, // Subtract 3 to center at 0
  }));
  
  // Define the color function to map UV values to colors
  const getBarColor = (uv) => {
    if (uv > 1) {
      return "green"; // Positive
    } else if (uv > 0.24) {
      return "#32CD32"; // Light green
    } else if (uv < -1) {
      return "#8B0000"; // Dark red
    } else if (uv < -0.2) {
      return "red"; // Light red
    } else {
      return "orange"; // Neutral
    }
  };
  
  

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = data.slice(offset, offset + itemsPerPage);

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
        <nav className="navbar navbar-light bg-light ">
          <div className="container-fluid btn-group dropstart">
            <button className="navbar-toggler" type="button" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
              <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" onClick={handlePrint}>Print</a></li>
              <li><a className="dropdown-item" onClick={handleSavePng}>Save as Png</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <BarChart
        ref={chartRef}
        width={475}
        height={500}
        data={currentPageData}
        layout="vertical" // Set the layout to "vertical" for a horizontal bar chart
      >
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis
 type="number"
 domain={[-2,2]} // Set the domain to match your numeric range
 tickPosition="middle" // Place ticks above the x-axis
 ticks={[-2, -1,0,1,2]} // Set custom tick values
 tickFormatter={(value) => {
   if (value === -2) {
     return "V.Neg";
   } else if (value === -1) {
     return "Neg";
   } else if (value === 0) {
     return "Neu";
   } else if (value === 1) {
     return "Pos";
   }
   else {
    return "V.Pos"
   }
 }}
 allowDuplicatedCategory={false}
/>




   <YAxis dataKey="name" type="category" angle={-45} textAnchor="end" interval={0} /> {/* YAxis is categorical */}
        <Tooltip />
        
        <Bar
          dataKey="uv"
          barSize={20}
          
        >
          {currentPageData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.uv)} />
            
          ))}

{currentPageData.map((entry, index) => (
            
            <LabelList key={`cell-${index}`}  valueKey={`${entry.uv}`} content={renderCustomizedLabel} />
            
          ))}
                   

                  

        </Bar>
      </BarChart>
      <Line type="monotone" dataKey="uv" stroke="#ff7300" />
      <ReactPaginate
        previousLabel={<MdArrowBackIos style={{ fontSize: 18, width: 150 }} />}
        nextLabel={<MdArrowForwardIos style={{ fontSize: 18, width: 150 }} />}
        breakLabel={'...'}
        pageCount={Math.ceil(data.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        currentPage={currentPage}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'item active'}
        breakClassName={'item break-me '}
        disabledClassName={'disabled-page'}
        nextClassName={"item next "}
        pageClassName={'item pagination-page '}
        previousClassName={"item previous"}
      />
    </div>
  );
}
