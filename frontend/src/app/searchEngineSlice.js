
import { createSlice } from '@reduxjs/toolkit';

const searchEngineSlice = createSlice({
  name: 'searchEngine',
  initialState: {
    searchEngineNames : {
    google:false,
    bing:false,
    duckduckgo:false
   },
   studyDetails:{
      studyName:'',
      studyDetails:''
   },
   numResults:0,
   nextStudyID:0,
   queries:[],
   newStudy: false,
   newAnalysis: false,

  },
  reducers: {

    setSearchEngine: (state,action) => {
        if(action.payload==='google'){
        state.searchEngineNames.google = !state.searchEngineNames.google;}
        if(action.payload==='bing'){
        state.searchEngineNames.bing = !state.searchEngineNames.bing;}
        if(action.payload==='duckduckgo'){
        state.searchEngineNames.duckduckgo = !state.searchEngineNames.duckduckgo;}
      },

    setSearchNumber :(state,action)=>{
        state.numResults =  action.payload

    },

    setStudyDetails : (state,action)=>{
      state.studyDetails = { ...state.studyDetails, ...action.payload };
    },
    setQueries: (state, action) => {
      state.queries = action.payload;
    },
    setQueriesFromCSV: (state, action) => {
      state.queries = action.payload;
    },
    setNextStudyID: (state,action) => {
      state.nextStudyID = action.payload;
    },
    setNewStudyTrue: (state) => {
      state.newStudy = true; // Toggle the value between true and false
    },
    setNewStudyFalse: (state) => {
      state.newStudy = false; // Toggle the value between true and false
    },
    setNewAnalysisTrue: (state) => {
      state.newAnalysis = true; // Toggle the value between true and false
    },
    setNewAnalysisFalse: (state) => {
      state.newAnalysis = false; // Toggle the value between true and false
    }
  },
});

export const {
setSearchEngine,
setSearchNumber,
setStudyDetails,
setQueries,
setNextStudyID,
setNewStudyTrue,
setNewStudyFalse,
setNewAnalysisFalse,
setNewAnalysisTrue,
} = searchEngineSlice.actions;
export default searchEngineSlice.reducer;
