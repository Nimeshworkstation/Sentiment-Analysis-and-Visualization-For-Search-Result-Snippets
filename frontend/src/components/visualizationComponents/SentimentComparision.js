import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import FileSaver from "file-saver";
import { useCurrentPng } from "recharts-to-png";

export default function SentimentComparison(props) {
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

  const resultsPerPage = 10;
  const totalPages = Math.ceil(props.data.length / resultsPerPage);

  const pages = [];

  for (let i = 0; i < totalPages; i++) {
    const pageData = props.data.slice(i * resultsPerPage, (i + 1) * resultsPerPage);
    const sentimentCounts = {
      Positive: 0,
      Negative: 0,
      Neutral: 0,
    };

    for (const item of pageData) {
      const { sentiment_label } = item;
      if (sentiment_label === "Positive") {
        sentimentCounts.Positive += 1;
      } else if (sentiment_label === "Negative") {
        sentimentCounts.Negative += 1;
      } else if (sentiment_label === "Neutral") {
        sentimentCounts.Neutral += 1;
      }
    }

    pages.push({
      name: `Page ${String.fromCharCode(65 + i)}`,
      Positive: sentimentCounts.Positive,
      Negative: sentimentCounts.Negative,
      Neutral: sentimentCounts.Neutral,
    });
  }

  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value, stroke, fill } = props; // Destructure props
  
    let labelContent;
  
    if (fill === 'green') {
      labelContent = (
        <g>
          <circle cx={x + width / 2} cy={y - 10} r={10} fill='green' />
          <text x={x + width / 2} y={y - 10} fill="#fff" textAnchor="middle" dominantBaseline="middle">
            {value}
          </text>
        </g>
      );
    } else if (fill === 'red') {
      labelContent = (
        <g>
          <circle cx={x + width / 2} cy={y - 10} r={10} fill='red' />
          <text x={x + width / 2} y={y - 10} fill="#fff" textAnchor="middle" dominantBaseline="middle">
            {value}
          </text>
        </g> 
      );
    } else {
      labelContent = (
        <g>
          <circle cx={x + width / 2} cy={y - 10} r={10} fill='orange' />
          <text x={x + width / 2} y={y - 10} fill="#fff" textAnchor="middle" dominantBaseline="middle">
            {value}
          </text>
        </g>
      );
    }
  
    return labelContent;
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

      <BarChart width={475} height={300} data={pages} ref={chartRef}>
        <CartesianGrid strokeDasharray="3 " />
        <XAxis dataKey="name" />
        <YAxis ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />

        <Tooltip />
        <Legend />
        <Bar dataKey="Positive" fill="green" barSize={20}>
        <LabelList dataKey="Positive" content={(props) => renderCustomizedLabel({...props, fill: 'green'})} />

        </Bar>
        <Bar dataKey="Negative" fill="red" barSize={20}>
        <LabelList dataKey="Positive" content={(props) => renderCustomizedLabel({...props, fill: 'red'})} />
        </Bar>
        <Bar dataKey="Neutral" fill="orange" barSize={20}>
          <LabelList dataKey="Neutral" content={renderCustomizedLabel} />
        </Bar>
      </BarChart>
    </div>
  );
}
