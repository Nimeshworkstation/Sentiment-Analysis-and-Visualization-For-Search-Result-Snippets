import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector } from "recharts";
import barImage from './bar.svg';
import pieImage from './pie.svg';
import lineImage from './line.svg'
import statImage from './stat.svg'
import trendImage from './trend.svg';
import { useNavigate } from "react-router-dom";

const data = [
  { name: "Group A", value: 300 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 300 },
  { name: "Group E", value: 300 }
];

const CustomPieChart = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );
    const navigate = useNavigate()
  const handleImageClick = (sectionName) => {
    // Determine which component to render based on the sectionName
    if (sectionName === 'Group A') {
      
      navigate('/individualsentiment')
    } else if (sectionName === 'Group B') {
      
      navigate('/sentimentpiechart')
    } else if (sectionName === 'Group C') {
      
      navigate('/sentimentcomparision')
    } else if (sectionName === 'Group D') {
      
      navigate('/sentimentclassification')
    } else if (sectionName === 'Group E') {
      
      navigate('/sentimenttrend')
    } 
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = props;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 250;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    let imageToRender = null;
    let textToDisplay =  null;
    
    if (payload.name === 'Group A') {
      imageToRender = barImage;
      textToDisplay = 'Classified Snippets'; // Add your text for Group A
    } else if (payload.name === 'Group B') {
      imageToRender = pieImage;
      textToDisplay = 'Sentiment Ratio'; // Add your text for Group B
    } else if (payload.name === 'Group C') {
      imageToRender = lineImage;
      textToDisplay = 'Sentiment Comparison'; // Add your text for Group C
    } else if (payload.name === 'Group D') {
      imageToRender = statImage;
      textToDisplay = 'Sentiment Level of Snippets'; // Add your text for Group D
    } else if (payload.name === 'Group E') {
      imageToRender = trendImage;
      textToDisplay = 'Sentiment Trend'; // Add your text for Group E
    }

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <rect
          x={ex - 50}
          y={ey - 25}
          width={170}
          height={105}
          fill={fill}
          rx={15}
          ry={15}
        />

        {/* Render the selected image and handle the click event */}
        <image x={ex - 50} y={ey - 25} width={150} height={100} xlinkHref={imageToRender} onClick={() => handleImageClick(payload.name)} />
        <text
          x={ex + 25} // Adjust the x-coordinate as needed
          y={ey + 110} // Adjust the y-coordinate as needed
          textAnchor="middle"
          fill="#000" // Text color
        >
          {textToDisplay}
        </text>
      </g>
    );
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <PieChart width={1270} height={800}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx={600}
          cy={300}
          innerRadius={200}
          outerRadius={250}
          fill="#2E3337"
          dataKey="value"
          onMouseEnter={onPieEnter}
        />
      </PieChart>
      {/* {selectedComponent} */}
    </div>
  );
};

export default CustomPieChart;
