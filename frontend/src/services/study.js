import axios from "axios";
const BASE_URL = 'http://127.0.0.1:8000/api/';

export const listStudy = async (id) => {
    const response = await axios.get(BASE_URL + `studies/?id=${id}`);
    return response.data; 
  };

  export const deleteStudy = async (user,studyName) => {
    const response = await axios.delete(BASE_URL + `study/delete/${user}/${studyName}/`);
    return response.data; 
  };


  export const checkStudyName = async (user,study_name) => {
    const response = await axios.get(BASE_URL + `check-study/${user}/${study_name}/`);
    return response.data; 
  };



export const getNextStudyID = async () =>{
    const response = await axios.get(BASE_URL + `next-available-id/`);
      return response.data; 
  
  }

export const createStudy = async (studyData) =>{
  const response = await axios.post(BASE_URL + `create-study/`,studyData);
    return response.data; 

}

export const listResult = async (study_id) =>{
  const response = await axios.get(BASE_URL +`results/${study_id}/`)
  return response.data
}

export const startLexiconBasedSentimentAnalysis = async (study_id) =>{
  const response = await axios.post(BASE_URL +`sentiment-analysis/${study_id}/`)
  return response.data
}

export const getLexiconBasedSentimentAnalysisResults = async (study_id) =>{
  const response = await axios.get(BASE_URL +`sentiment-analysis/${study_id}/`)
  return response.data
}


export const listQuery = async (study_id) =>{
  const response = await axios.get(BASE_URL +`queries/${study_id}/`)
  return response.data
}