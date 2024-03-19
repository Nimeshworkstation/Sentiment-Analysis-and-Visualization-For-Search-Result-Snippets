// authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { isAuthenticated } from '../services/auth';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: isAuthenticated(),
    createaccount: false,
    user: null,
    error: null,
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    currentStep: 0,
  },
  reducers: {
    accountCreated: (state) => {
      state.createaccount = true;
    },
    // Define setToken inside reducers
    setToken: (state, action) => {
        const { accessToken, refreshToken } = action.payload; // Extract tokens from the action payload
        state.access = accessToken; // Update accessToken in the state
        state.refresh = refreshToken; // Update refreshToken in the state
        state.isAuthenticated = isAuthenticated()
      },
      userLogout: (state)=>{
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        state.access = null;
        state.refresh = null;
        state.isAuthenticated = isAuthenticated()
        state.user = null;
      },
      setCurrentStepIncr: (state)=>{
        state.currentStep = state.currentStep+1
      },
      setCurrentStepDecr: (state)=>{
        state.currentStep= state.currentStep-1
      },
      resetCurrentStep: (state)=>{
        state.currentStep = 0
      },
      
  },
});

export const {
  setAuthentication,
  accountCreated,
  setToken,
  userLogout,
  setCurrentStepDecr,
  setCurrentStepIncr,
  resetCurrentStep,
} = authSlice.actions;
export default authSlice.reducer;
