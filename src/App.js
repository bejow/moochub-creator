import './App.css';
import React from 'react'
import { Routes, Route } from "react-router-dom";
import { MoochubEditor } from './components/MoochubEditor/MoochubEditor';
import Layout from './components/Layout/Layout';

function App() {

  return (
    <div className="App-wrapper">
      <Routes>
        <Route path="/" element={<Layout/>}>
          
          <Route path="/course" element={<MoochubEditor/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
