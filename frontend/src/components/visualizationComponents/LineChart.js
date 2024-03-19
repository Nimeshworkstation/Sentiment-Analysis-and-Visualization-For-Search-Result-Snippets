import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  LabelList,
  ResponsiveContainer,
} from 'recharts';


const renderCustomizedLabel = (props) => {
  const { x, y, width, height, value, stroke, fill } = props;

  let labelContent;

  if (fill === 'red') {
    labelContent = (
      <g>
        <circle cx={x + width / 2} cy={y - 10} r={10} fill="red" />
        <text x={x + width / 2} y={y - 10} fill="white" textAnchor="middle" dominantBaseline="middle">
          {value}
        </text>
      </g>
    );
  } else if (fill === 'green') {
    labelContent = (
      <g>
        <circle cx={x + width / 2} cy={y - 10} r={10} fill="green" />
        <text x={x + width / 2} y={y - 10} fill="white" textAnchor="middle" dominantBaseline="middle">
          {value}
        </text>
      </g>
    );
  } else { 
    labelContent = (
      <g>
        <circle cx={x + width / 2} cy={y - 10} r={10} fill="orange" />
        <text x={x + width / 2} y={y - 10} fill="white" textAnchor="middle" dominantBaseline="middle">
          {value}
        </text>
      </g>
    );
  }

  return labelContent;
};


const SentimentBarChart = (dataProps) => {
  let groupedData = {};

  dataProps.data.forEach((result) => {
    const id = result.Id;

    if (!groupedData[id]) {
      groupedData[id] = {
        Positive: 0,
        Negative: 0,
        Neutral: 0,
      };
    }

    const sentiment = result.sentiment_label;
    const sentimentData = groupedData[id];

    if (sentiment === 'Positive') {
      sentimentData.Positive++;
    } else if (sentiment === 'Negative') {
      sentimentData.Negative++;
    } else if (sentiment === 'Neutral') {
      sentimentData.Neutral++;
    }
  });

  const data = [];

  Object.keys(groupedData).forEach((id, index) => {
    const sentimentData = groupedData[id];
    const queryName = `Query ${index + 1}`; // Use index to generate query names
    const negative = sentimentData.Negative;
    const positive = sentimentData.Positive;
    const neutral = sentimentData.Neutral;

    data.push({
      name: queryName,
      negative: negative,
      positive: positive,
      neutral: neutral,
    });
  });

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          width={500}
          height={200}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="negative" fill="#FF0000" barSize={20}>
          <LabelList dataKey="negative" content={(props) => renderCustomizedLabel({...props, fill: 'red'})} />
          </Bar>
          <Brush
            dataKey="name"
            height={30}
            stroke="red"
            startIndex={0}
            endIndex={data.length - 1}
            travellerWidth={15}
          />
        </BarChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          width={500}
          height={200}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="positive" fill="green" barSize={20}>
          <LabelList dataKey="positive" content={(props) => renderCustomizedLabel({...props, fill: 'green'})} />
          </Bar>
          <Brush
            dataKey="name"
            height={30}
            stroke="green"
            startIndex={0}
            endIndex={data.length - 1}
            travellerWidth={15}
          />
        </BarChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          width={500}
          height={200}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="neutral" fill="orange" barSize={20}>
          <LabelList dataKey="neutral" content={(props) => renderCustomizedLabel({...props, fill: 'orange'})} />
          </Bar>
          <Brush
            dataKey="name"
            height={30}
            stroke="orange"
            startIndex={0}
            endIndex={data.length - 1}
            travellerWidth={15}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentBarChart;
