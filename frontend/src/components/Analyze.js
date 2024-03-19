import React, { useState, useEffect } from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import IndividualSentiment from './visualizationComponents/IndividualSentiment';
import SentimentTrend from './visualizationComponents/SentimentTrend';
import SentimentComparision from './visualizationComponents/SentimentComparision';
import SentimentClassfication from './visualizationComponents/SentimentClassfication';
import SentimentPieChart from './visualizationComponents/SentimentPieChart';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { listStudy,listQuery, listResult, getLexiconBasedSentimentAnalysisResults } from '../services/study';
import { useParams, useLocation } from 'react-router-dom';
import { ScrollMenu, } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import usePreventBodyScroll from "../components/horizontalScroll/UsePreventBodyScroll"
import SentimentClassification from './visualizationComponents/SentimentClassfication';
import { saveAs } from 'file-saver';
import * as xlsx from 'xlsx';
import { RiMenuSearchLine } from "react-icons/ri";
import { MdOutlineSummarize } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import { BiLogoGoogle, BiLogoBing } from 'react-icons/bi';
import { SiDuckduckgo } from 'react-icons/si';
import ScrollToTop from "react-scroll-to-top";
import LineChart from './visualizationComponents/LineChart'
import CombinedBarChart from './visualizationComponents/CombinedBarChart'
import SentimentClassificationAll from './visualizationComponents/SentimentClassificationAll'
import { FaBalanceScale } from "react-icons/fa";
export default function Analyze() {
  const segmentColors = [
    '#8B0000', // Dark Red
    '#FF4500', // Orange-Red
    '#FFA500', // Orange
    '#228B22', // Forest Green
    '#006400'  // Dark Green
  ];

  const customSegmentLabels = [
    {
      text: 'Very Negative',
      position: 'INSIDE',
      color: '#FFF',
      fontSize: '11px',
    },
    {
      text: 'Negative',
      position: 'INSIDE',
      color: '#FFF',
      fontSize: '11px',
    },
    {
      text: 'Neutral',
      position: 'INSIDE',
      color: '#FFF',
      fontSize: '11px',
    },
    {
      text: 'Positive',
      position: 'INSIDE',
      color: '#FFF',
      fontSize: '11px',
    },
    {
      text: 'Very Positive',
      position: 'INSIDE',
      color: '#FFF',
      fontSize: '11px',
    }
  ];
  const sampleData = [
    { query: 1, valueA: 5, valueB: 10 },
    { query: 2, valueA: 8, valueB: 12 },
    { query: 3, valueA: 10, valueB: 10 },
    { query: 4, valueA: 12, valueB: 7 },
    // Add more data points as needed
  ];
  
  const location = useLocation()
  const { study_name, study_details,result_num } = location.state ;
  const [studyData, setStudyData] = useState([])
  const [query, setQuery] = useState([]);
  const [result, setResult] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [filteredQueriesQueryName, setFilteredQueriesQueryName] = useState([]);
  const [filteredQueriesSearchEngine, setFilteredQueriesSearchEngine] = useState([]);
  const [filteredSentimentQueryName, setFilteredSentimentQueryName] = useState([]);
  const [filteredSentimentSearchEngine, setFilteredSentimentSearchEngine] = useState([]);
  const [selectedSearchEngine, setSelectedSearchEngine] = useState(''); 
  const [demoquery,setDemoQuery] = useState('')// Initialize the selected search engine state
  const { study_id } = useParams();
  const [value,setValue] = useState(true)
  const [studyValue,setstudyValue] = useState(true)
  const [dataAll, setDataAll] = useState([]);
  const googleall = []
  const bingall = []
  const duckduckgoall = []
  const googledata = [];
  const bingdata = []
  const duckduckgodata = []
  const googleSnippet = [];
  const bingSnippet = [];
  const duckduckgoSnippet = [];
  let googleScore = 0;
  let bingScore = 0;
  let duckduckgoScore = 0;
  let googleallscore = 0;
  let bingallscore =0;
  let duckduckgoallscore = 0;
  const [isExpanded, setIsExpanded] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryData = await listQuery(study_id);
        setQuery(queryData);

        const resultData = await listResult(study_id);
        setResult(resultData);

        const sentimentData = await getLexiconBasedSentimentAnalysisResults(study_id);
        setSentimentData(sentimentData);

        const data = await listStudy(study_id);
        setStudyData(data);

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, [study_id]);

  const handleQueryQueryName = (id) => {
    console.log('this is id:',id)
    const demoquery = query.find(q=>q.id ===id)
    setDemoQuery(demoquery)
    const filteredQueries = result.filter((item) => item.query === id);
    setFilteredQueriesQueryName(filteredQueries);
    const filteredSentiment = sentimentData.filter((item) => {
      return filteredQueries.some((query) => query.id === item.result);
    });
    setFilteredSentimentQueryName(filteredSentiment);
    setValue(true)
    setstudyValue(true)
    setSelectedSearchEngine(null)
  };

  const handleQuerySearchEngine = (search_engine) => {
    setSelectedSearchEngine(search_engine)
    const filteredQueries = result.filter((item) => item.search_engine === search_engine);
    setFilteredQueriesSearchEngine(filteredQueries);
    const filteredSentiment = sentimentData.filter((item) => {
      return filteredQueries.some((query) => query.id === item.result);
    });
    setFilteredSentimentSearchEngine(filteredSentiment);
    setValue(false)
    setstudyValue(true)

  };

  const handleStudy = () => {
    const data_all = sentimentData.map((sentimentItem) => {
      const resultItem = result.find((queryItem) => queryItem.id === sentimentItem.result);
      const queryItem = query.find((queryItem) => queryItem.id === resultItem.query);
      return {
        Id:queryItem.id,
        Query: queryItem.query_name,
        SearchEngine: sentimentItem.search_engine,
        url: resultItem.url,
        title: resultItem.title,
        snippet: resultItem.snippet,
        normalized_sentiment_score: sentimentItem.normalized_sentiment_score,
        sentiment_label: sentimentItem.sentiment_label,
      };
    });

    setDataAll(data_all)
    setstudyValue(false);
   };

  
  function mapToSentimentMeterRange(totalNormalizedScore,length) {
    const minNormalizedScore = length*1
    const maxNormalizedScore = length*5
    const minSentimentMeterValue = 10;
    const maxSentimentMeterValue = 1000;

    // Map the total normalized score to the sentiment meter's range
    const mappedValue = ((totalNormalizedScore - minNormalizedScore) / (maxNormalizedScore - minNormalizedScore)) * (maxSentimentMeterValue - minSentimentMeterValue) + minSentimentMeterValue;
    return mappedValue;
  }


  const seData = filteredSentimentSearchEngine.map((sentimentItem) => {
    const queryItem = filteredQueriesSearchEngine.find((queryItem) => queryItem.id === sentimentItem.result);
    return {
      snippet: queryItem.snippet,
      sentiment: sentimentItem.sentiment_label,
      query:queryItem.query,
      normalized_sentiment_score:sentimentItem.normalized_sentiment_score,
      sentiment_label: sentimentItem.sentiment_label
    };
  });

  function onWheel(apiObj, ev) {
    const isTouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;
  
    if (isTouchpad) {
      ev.stopPropagation();
      return;
    }
  
    if (ev.deltaY < 0) {
      apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
      apiObj.scrollPrev();
    }
  }

  const { disableScroll, enableScroll } = usePreventBodyScroll();

  const excel_data_all = sentimentData.map((sentimentItem) => {
    const resultItem = result.find((queryItem) => queryItem.id === sentimentItem.result);
    const queryName = query.find((queryItem) => queryItem.id === resultItem.query); 
    return {
    Query: queryName.query_name,
    SearchEngine: sentimentItem.search_engine,
    url: resultItem.url,
    title: resultItem.title,
    snippet: resultItem.snippet,
    SentimentScore: sentimentItem.normalized_sentiment_score,
    SentimentLabel: sentimentItem.sentiment_label,
    };
  });

  function exportToExcel() {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(excel_data_all);
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = xlsx.write(wb, { bookType: 'xlsx', type: 'binary' });
    const buf = new ArrayBuffer(wbout.length); 
    const view = new Uint8Array(buf);  
    for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xFF;
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'sentimentData.xlsx');
  }

 



  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };


 

  return (
    <div className='container-fluid'>
<div className='row mt-1'>
<div className='col-md-2'>
        <div className="col-md-12">

        <div className="card border-info mb-1" style={{ width: '15rem' }}>
            <div className="card-header text-info">
            <FaBalanceScale /> Visualize The Study
            </div>
            <ul className="list-group list-group-flush list-unstyled">
                  <a
                    className="list-group-item list-group-item-action text-info"
                     onClick={() => handleStudy()}
                  >
                    {study_name}
                  </a>
                
            </ul>
          </div>


          <div className="card  border-success mb-1" style={{ width: '15rem' }}>
            <div className="card-header text-success">
            <RiMenuSearchLine />  Visualize By SE
            </div>

<ul className="list-group list-group-flush list-unstyled">
  {[...new Set(result.map(item => item.search_engine))].map((search_engine, index) => (
    <li key={index}>
      <a
        className="list-group-item list-group-item-action text-success"
        onClick={() => handleQuerySearchEngine(search_engine)}
      >
        {search_engine === 'google' ? <BiLogoGoogle /> : search_engine === 'bing' ? <BiLogoBing /> : search_engine === 'duckduckgo' ? <SiDuckduckgo /> : search_engine}
        {' '}
        {search_engine === 'google' ? 'Google' : search_engine === 'bing' ? 'Bing' : search_engine === 'duckduckgo' ? 'DuckDuckGo' : search_engine}
      </a>
    </li>
  ))}
</ul>
</div>




<div className={`card ${isExpanded ? 'border-danger' : ''} mb-1`} style={{ width: '15rem' }}>
      <div className={`card-header text-danger ${isExpanded ? 'bg-danger text-white' : ''}`} onClick={handleToggle}>
        <MdOutlineSummarize /> Visualize By Quer(y-ies)
      </div>
      {isExpanded && (
        <ul className="list-group list-group-flush list-unstyled">
          {query.map((queryItem, index) => (
            <li key={index}>
              <a
                className="list-group-item list-group-item-action text-danger"
                onClick={() => handleQueryQueryName(queryItem.id)}
              >
                {queryItem.query_name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>



        </div>
      </div>


  <div className='col-md-10'>
    <div className="card text-center">
      <div className="card-header">
        STUDY SUMMARY
      </div>
      <div className="card-body text-start">
  <h6>Study Title: {study_name}</h6>
  <h6>Study Description: {study_details} </h6>
  <h6>Number of Queries: {result_num} </h6>
  <h6>Selected Search Engines: {' '}
  {[...new Set(result.map(item => item.search_engine))].map((search_engine, index) => (
    <span key={index}>
      <a onClick={() => handleQuerySearchEngine(search_engine)}>
        {search_engine === 'google' ? 'Google' : search_engine === 'bing' ? 'Bing' : search_engine === 'duckduckgo' ? 'DuckDuckGo' : search_engine}
      </a>
      {index < result.length - 1 && ', '}
    </span>
  ))}
</h6>

  <h6>
    Queries: {query.map((queryItem, index) => (
      <span key={index} className={`bg-warning text-dark font-weight-bold ${index > 0 && "ml-1"}`}>
        {index > 0 && ", "}
        {queryItem.query_name}
      </span>
    ))}
  </h6>
</div>


      <div className="card-footer text-end">
        <a className="btn btn-success" onClick={() => exportToExcel(result)}>
          <FaDownload /> Download the study
        </a>
      </div>
    </div>
</div>
</div>

      {filteredSentimentQueryName.map((query) => {
        if (query.search_engine === 'google') {
          googledata.push(query);
          googleScore += query.normalized_sentiment_score;
        } else if (query.search_engine === 'bing') {
          bingdata.push(query);
          bingScore += query.normalized_sentiment_score;
        } else if (query.search_engine === 'duckduckgo') {
          duckduckgodata.push(query);
          duckduckgoScore += query.normalized_sentiment_score;
        }
      })}


      {result.map((query) => {
        if (query.search_engine === 'google') {
          googleSnippet.push(query);
        } else if (query.search_engine === 'bing') {
          bingSnippet.push(query);
        } else if (query.search_engine === 'duckduckgo') {
          duckduckgoSnippet.push(query);
        }
      })}


{dataAll.map((query) => {
        if (query.SearchEngine === 'google') {
          googleall.push(query);
          googleallscore += query.normalized_sentiment_score;

        } else if (query.SearchEngine === 'bing') {
          bingall.push(query);
          bingallscore += query.normalized_sentiment_score;

        } else if (query.SearchEngine === 'duckduckgo') {
          duckduckgoall.push(query);
          duckduckgoallscore += query.normalized_sentiment_score;

        }
      })}




<div className='text-center bg-success text-white mt-2'><h3>Your Visualizations</h3></div>

{selectedSearchEngine && studyValue &&(
  <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
    <ScrollMenu
      
      onWheel={(apiObj, ev) => onWheel(apiObj, ev)}
    >
      {query.map((queryItem, index) => {
          const querySentiments = seData.filter(item => item.query === queryItem.id);
          const totalSentimentScore = querySentiments.reduce((sum, item) => sum + item.normalized_sentiment_score, 0);
  
        return (
          <div key={index} className='row mt-3 mb-3 ms-1'>
            <div className='col-md-12' >
            <div className='bg-dark text-center p-2 text-success mb-1'>{`(Query) ${queryItem.query_name}`}</div>
              <div className="bg-light p-2">
                <ReactSpeedometer
                  width={475}
                  needleColor="steelblue"
                  segments={5}
                  value={mapToSentimentMeterRange(totalSentimentScore, querySentiments.length)}
                  segmentColors={segmentColors}
                  customSegmentLabels={customSegmentLabels}
                   currentValueText={` `}
                />
              </div>
              <div className='bg-dark text-center p-2 text-light mt-1'>{`SENTIMENT METER`}</div>

            </div>
          </div>
        );
      })}
    </ScrollMenu>
  </div>
)}


 {selectedSearchEngine && studyValue &&(
    <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
      <ScrollMenu
        
        onWheel={(apiObj, ev) => onWheel(apiObj, ev)}
      >
        {query.map((queryItem, index) => (
          <div key={index} className='row mt-3 mb-3 ms-1'>
            <div className='col-md-12'>
            <div className='bg-dark text-center p-2 text-success mb-1'>{`(Query) ${queryItem.query_name}`}</div>

              <div className="bg-light p-2">
                <SentimentPieChart
                  key={index}
                  query={queryItem}
                  data={seData.filter(dataItem => dataItem.query === queryItem.id)}
                />
              </div>
              <div className='bg-dark text-center p-2 text-light mt-1'>{`SENTIMENT DISTRIBUTION`}</div>

            </div>

          </div>
        ))}
      </ScrollMenu>

    </div>
    
   
)}

{selectedSearchEngine && studyValue &&(
    <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
      <ScrollMenu
        
        onWheel={(apiObj, ev) => onWheel(apiObj, ev)}
      >
        {query.map((queryItem, index) => (
          <div key={index} className='row mt-3 mb-3 ms-1'>
            <div className='col-md-12'>
            <div className='bg-dark text-center p-2 text-success mb-1'>{`(Query) ${queryItem.query_name}`}</div>

              <div className="bg-light p-2">
                <IndividualSentiment
                  key={index}
                  query={queryItem}
                  data={seData.filter(dataItem => dataItem.query === queryItem.id)}
                />
              </div>
              <div className='bg-dark text-center p-2 text-light mt-1'>{`INDIVIDUAL SENTIMENT LEVEL`}</div>

            </div>
          </div>
        ))}
      </ScrollMenu>
    </div>
)}


{selectedSearchEngine && studyValue &&(
    <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
      <ScrollMenu
        
        onWheel={(apiObj, ev) => onWheel(apiObj, ev)}
      >
        {query.map((queryItem, index) => (
          <div key={index} className='row mt-3 mb-3 ms-1'>
            <div className='col-md-12'>
            <div className='bg-dark text-center p-2 text-success mb-1'>{`(Query) ${queryItem.query_name}`}</div>

              <div className="bg-light p-2">
                <SentimentTrend
                  key={index}
                  query={queryItem}
                  data={seData.filter(dataItem => dataItem.query === queryItem.id)}
                />
              </div>
              <div className='bg-dark text-center p-2 text-light mt-1'>{`SENTIMENT TREND`}</div>

            </div>
          </div>
        ))}
      </ScrollMenu>
    </div>
)}



{selectedSearchEngine && studyValue &&(
    <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
      <ScrollMenu
        
        onWheel={(apiObj, ev) => onWheel(apiObj, ev)}
      >
        {query.map((queryItem, index) => (
          <div key={index} className='row mt-3 mb-3 ms-1'>
            <div className='col-md-12'>
            <div className='bg-dark text-center p-2 text-success mb-1'>{`(Query) ${queryItem.query_name}`}</div>

              <div className="bg-light p-2">
                <SentimentComparision
                  key={index}
                  query={queryItem}
                  data={seData.filter(dataItem => dataItem.query === queryItem.id)}
                />
              </div>
              <div className='bg-dark text-center p-2 text-light mt-1'>{`SENTIMENT COMPARISION`}</div>

            </div>
          </div>
        ))}
      </ScrollMenu>
    </div>
)}

 {selectedSearchEngine && studyValue &&(
  <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
    <ScrollMenu
      onWheel={(apiObj, ev) => onWheel(apiObj, ev)}
    > 

      
{query.map((queryItem, index) => {
  const resultForQuery = result.filter(r => r.query === queryItem.id);
  const snippetUrl = result.filter( r=> r.url === queryItem.id)
  const snippetScore = result.filter(r=> r.normalized_sentiment_score === queryItem.id)
  const filteredSentimentResults = filteredSentimentSearchEngine.filter(s => resultForQuery.some(r => r.id === s.result));
  
  return (
    <div key={index} className='row mt-3 mb-3 ms-1'>
      <div className='col-md-12'>
      <div className='bg-dark text-center p-2 text-success mb-1'>{`(Query) ${queryItem.query_name}`}</div>
             <div className="bg-light p-2">
          <SentimentClassification
            key={index}
            sentiment={filteredSentimentResults}
            snippet={resultForQuery}
          />
        </div>
        <div className='bg-dark text-center p-2 text-light mt-1'>{`SENTIMENT CLASSIFICATION`}</div>

      </div>
    </div>
  );
})}

    </ScrollMenu>
  </div>
)} 

{ (googledata.length >0 || bingdata.length >0 || duckduckgodata.length >0 && value && studyValue ) && (
<div className='row mt-3 mb-3'>
        <div className='col-md-12'>
          <div className='row'>
            {googledata.length > 0 && value && studyValue && (
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>
                <div className="bg-light p-2" style={{ height: "280px" }}>
                  <ReactSpeedometer
                    fluidWidth={true}
                    needleColor="steelblue"
                    segments={5}
                    value={mapToSentimentMeterRange(googleScore, googledata.length)}
                    segmentColors={segmentColors}
                    customSegmentLabels={customSegmentLabels}
                    currentValueText={` `}

                    
                  />
                </div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`GOOGLE - SENTIMENT METER`}</div>

              </div>
            )}
            {bingdata.length > 0 && value && studyValue && (
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>
                <div className="bg-light p-2" style={{ height: "280px" }}>
                  <ReactSpeedometer
                    fluidWidth={true}
                    needleColor="steelblue"
                    segments={5}
                    value={mapToSentimentMeterRange(bingScore,bingdata.length)}
                    segmentColors={segmentColors}
                    customSegmentLabels={customSegmentLabels}
                    currentValueText={` `}

                    
                  />
                </div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`BING - SENTIMENT METER`}</div>

              </div>
            )}
            {duckduckgodata.length > 0 && value && studyValue && (
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>
                <div className="bg-light p-2" style={{ height: "280px" }}>
                  <ReactSpeedometer
                    fluidWidth={true}
                    needleColor="steelblue"
                    segments={5}
                    value={mapToSentimentMeterRange(duckduckgoScore, duckduckgodata.length)}
                    segmentColors={segmentColors}
                    customSegmentLabels={customSegmentLabels}
                    currentValueText={` `}

                    
                  />
                </div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`DUCKDUCKGO - SENTIMENT METER`}</div>

              </div>
            )}
          </div>
        </div>
      </div> )}

      { (googledata.length >0 || bingdata.length >0 || duckduckgodata.length >0) && value && studyValue  && (
  <div className='row mt-3 mb-3'>
        <div className='col-md-12'>
          <div className='row'>
            {googledata.length > 0 && value && studyValue && (
              <div className='col-md-4'>
                                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>

                <div className="bg-light p-2"><SentimentPieChart data={googledata} id='google' /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`GOOGLE - SENTIMENT DISTRIBUTION`}</div>

              </div>
            )}
            {bingdata.length > 0 && value && studyValue &&(
              <div className='col-md-4'>
                                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>

                <div className="bg-light p-2"><SentimentPieChart data={bingdata} id='bing' /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`BING - SENTIMENT DISTRIBUTION`}</div>

              </div>
            )}
            {duckduckgodata.length > 0 && value && studyValue &&(
              <div className='col-md-4'>
                                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>

                <div className="bg-light p-2"><SentimentPieChart data={duckduckgodata} id='duckduckgo' /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`DUCKDUCKGO - SENTIMENT DISTRIBUTION`}</div>

              </div>
            )}
          </div>
        </div>
      </div> )}

      { (googledata.length >0 || bingdata.length >0 || duckduckgodata.length >0) && value && studyValue  && (
  <div className='row mt-3 mb-3'>
        <div className='col-md-12'>
          <div className='row'>
            {googledata.length > 0 && value && studyValue &&(
              <div className='col-md-4'>
                                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>

                <div className="bg-light p-2"><IndividualSentiment data={googledata} /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`GOOGLE - INDIVIDUAL SENTIMENT LEVEL`}</div>

              </div>
            )}
            {bingdata.length > 0 && value && studyValue &&(
              <div className='col-md-4'>
                                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>

                <div className="bg-light p-2"><IndividualSentiment data={bingdata} /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`BING - INDIVIDUAL SENTIMENT LEVEL `}</div>

              </div>
            )}
            {duckduckgodata.length > 0 && value && studyValue &&(
              <div className='col-md-4'>
                                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>

                <div className="bg-light p-2"><IndividualSentiment data={duckduckgodata} /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`DUCKDUCKGO - INDIVIDUAL SENTIMENT LEVEL`}</div>

              </div>
            )}
          </div>
        </div>
      </div> )}

      {( googledata.length >0 || bingdata.length >0 || duckduckgodata.length >0) && value && studyValue  && (
 <div className='row mt-3 mb-3'>
        <div className='col-md-12'>
          <div className='row'>
            {googledata.length > 0 && value && studyValue &&(
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>

                <div className="bg-light p-2"><SentimentTrend data={googledata} /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`GOOGLE - SENTIMENT TREND`}</div>

              </div>
            )}
            {bingdata.length > 0 && value && studyValue &&(
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>

                <div className="bg-light p-2"><SentimentTrend data={bingdata} /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`BING - SENTIMENT TREND`}</div>

              </div>
            )}
            {duckduckgodata.length > 0 && value && studyValue &&(
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>

                <div className="bg-light p-2"><SentimentTrend data={duckduckgodata} /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`DUCKDUCKGO - SENTIMENT TREND`}</div>

              </div>
            )}
          </div>
        </div>
      </div> )}

      { (googledata.length > 0 || bingdata.length > 0 || duckduckgodata.length > 0) && value && studyValue  && (
  <div className='row mt-3 mb-3'>
    <div className='col-md-12'>
      <div className='row'>
        {googledata.length > 0 && value && studyValue && (
          <div className='col-md-4'>
            <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>
            <div className="bg-light p-2">Google<SentimentComparision data={googledata} /></div>
            <div className='bg-dark text-center p-2 text-light mt-1'>{`GOOGLE - SENTIMENT COMPARISON`}</div>
          </div>
        )}
        {bingdata.length > 0 && value && studyValue && (
          <div className='col-md-4'>
            <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>
            <div className="bg-light p-2">Bing<SentimentComparision data={bingdata} /></div>
            <div className='bg-dark text-center p-2 text-light mt-1'>{`BING - SENTIMENT COMPARISON`}</div>
          </div>
        )}
        {duckduckgodata.length > 0 && value && studyValue && (
          <div className='col-md-4'>
            <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>
            <div className="bg-light p-2">DuckDuckGo<SentimentComparision data={duckduckgodata} /></div>
            <div className='bg-dark text-center p-2 text-light mt-1'>{`DUCKDUCKGO - SENTIMENT COMPARISON`}</div>
          </div>
        )}
      </div>
    </div>
  </div>
)}


    

{ (googledata.length > 0 || bingdata.length > 0 || duckduckgodata.length > 0) && value && studyValue  && (    
 <div className='row mt-3 mb-3'>
        <div className='col-md-12'>
          <div className='row'>
            {googledata.length > 0 && value && studyValue &&(
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>
                <div className="bg-light p-2"><SentimentClassfication sentiment={googledata} snippet={googleSnippet} /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`GOOGLE - SENTIMENT CLASSIFICATION`}</div>

              </div>
            )}
            {bingdata.length > 0 &&  value && studyValue &&(
              
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>
                <div className="bg-light p-2"><SentimentClassfication sentiment={bingdata} snippet={bingSnippet}/></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`BING - SENTIMENT CLASSIFICATION`}</div>

              </div>
            )}
            {duckduckgodata.length > 0 && value && studyValue &&(
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(Query)  ${demoquery.query_name}`}</div>
                <div className="bg-light p-2"><SentimentClassfication sentiment={duckduckgodata} snippet={duckduckgoSnippet}/></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`DUCKDUCKGO - SENTIMENT CLASSIFICATION`}</div>

              </div>
            )}
          </div>
        </div>
      </div> )}  

      <div className='row mb-3'>
        <div className='col-md-12'>
          <div className='row'>
            {googleall.length > 0 && !studyValue &&  (
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2" style={{ height: "280px" }}>
                  <ReactSpeedometer
                    fluidWidth={true}
                    needleColor="steelblue"
                    segments={5}
                    value={mapToSentimentMeterRange(googleallscore, googleall.length)}
                    segmentColors={segmentColors}
                    customSegmentLabels={customSegmentLabels}
                    currentValueText={` `}
                  />
                </div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`GOOGLE - SENTIMENT METER OVER ALL QUERIES`}</div>
              </div>
            )}
            {bingall.length > 0 && !studyValue && (
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2" style={{ height: "280px" }}>
                  <ReactSpeedometer
                    fluidWidth={true}
                    needleColor="steelblue"
                    segments={5}
                    value={mapToSentimentMeterRange(bingallscore,bingall.length)}
                    segmentColors={segmentColors}
                    customSegmentLabels={customSegmentLabels}
                    currentValueText={` `}

                    
                  />
                </div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`BING - SENTIMENT METER OVER ALL QUERIES `}</div>
              </div>
            )}
            {duckduckgoall.length > 0 && !studyValue && (
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2" style={{ height: "280px" }}>
                  <ReactSpeedometer
                    fluidWidth={true}
                    needleColor="steelblue"
                    segments={5}
                    value={mapToSentimentMeterRange(duckduckgoallscore, duckduckgoall.length)}
                    segmentColors={segmentColors}
                    customSegmentLabels={customSegmentLabels}
                    currentValueText={` `}
                    
                  />
                </div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`DUCKDUCKGO - SENTIMENT METER OVER ALL QUERIES`}</div>

              </div>
            )}
          </div>
        </div>
      </div>


      <div className='row mt-3 mb-3'>
        <div className='col-md-12'>
          <div className='row'>
            {googleall.length > 0 && !studyValue && (
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2"><SentimentPieChart data={googleall} id='google' /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`GOOGLE - SENTIMENT DISTRIBUTION OVER ALL QUERIES`}</div>

              </div>
            )}
            {bingall.length > 0 && !studyValue &&(
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2"><SentimentPieChart data={bingall} id='bing' /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`BING - SENTIMENT DISTRIBUTION OVER ALL QUERIES`}</div>

              </div>
            )}
            {duckduckgoall.length > 0 && !studyValue &&(
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2"><SentimentPieChart data={duckduckgoall} id='duckduckgo' /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`DUCKDUCKGO - SENTIMENT DISTRIBUTION OVER ALL QUERIES`}</div>

              </div>
            )}
          </div>
        </div>
      </div>




      <div className='row mt-3 mb-3'>
        <div className='col-md-12'>
          <div className='row'>

            {googleall.length > 0 && !studyValue && (
              
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2"><LineChart data={googleall} /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`GOOGLE - SENTIMENT COMPARISION OVER ALL QUERIES`}</div>

              </div>
            )}
            {bingall.length > 0 && !studyValue &&(
              
              <div className='col-md-4'>
                                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2"><LineChart data={bingall} /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`BING - SENTIMENT COMPARISION OVER ALL QUERIES`}</div>

              </div>
            )}
            {duckduckgoall.length > 0 && !studyValue &&(
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2"><LineChart data={duckduckgoall} /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`DUCKDUCKGO - SENTIMENT COMPARISION OVER ALL QUERIES`}</div>

              </div>
            )}
          </div>
        </div>
      </div>


      <div className='row mt-3 mb-3'>
        <div className='col-md-12'>
          <div className='row'>

            {googleall.length > 0 && !studyValue && (
              
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2"><CombinedBarChart data={googleall}/></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`GOOGLE - SENTIMENT TREND OVER ALL QUERIES`}</div>

              </div>
            )}
            {bingall.length > 0 && !studyValue &&(
              
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2"><CombinedBarChart data={bingall}/></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`BING - SENTIMENT TREND OVER ALL QUERIES`}</div>

              </div>
            )}
            {duckduckgoall.length > 0 && !studyValue &&(
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2"><CombinedBarChart data={duckduckgoall} /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`DUCKDUCKGO - SENTIMENT TREND OVER ALL QUERIES`}</div>

              </div>
            )}
          </div>
        </div>
      </div>




      <div className='row mt-3 mb-3'>
        <div className='col-md-12'>
          <div className='row'>

            {googleall.length > 0 && !studyValue && (
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2"><SentimentClassificationAll data={googleall}/></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`GOOGLE - SENTIMENT CLASSIFICATION OVER ALL QUERIES`}</div>
              </div>
            )}
            {bingall.length > 0 && !studyValue &&(
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2"><SentimentClassificationAll data={bingall}/></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`BING - SENTIMENT CLASSIFICATION OVER ALL QUERIES`}</div>
              </div>
            )}
            {duckduckgoall.length > 0 && !studyValue &&(
              <div className='col-md-4'>
                <div className='bg-dark text-center p-2 text-success mt-1'>{`(STUDY) - ${study_name}`}</div>
                <div className="bg-light p-2"><SentimentClassificationAll data={duckduckgoall} /></div>
                <div className='bg-dark text-center p-2 text-light mt-1'>{`DUCKDUCKGO - SENTIMENT CLASSIFICATION OVER ALL QUERIES`}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
      
      <ScrollToTop smooth />
    </div>



    </div> 

    
    
  );
}
