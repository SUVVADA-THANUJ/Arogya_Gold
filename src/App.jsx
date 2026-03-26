import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Upload from './components/Upload'
import Result from './components/Result'
import Model from './components/Model_results'
import Footer from './components/Footer'
import { useState } from 'react'
import Pd_show from './components/PD_show'
import { useRef } from 'react'

function App() {

  const [results, setResults] = useState(null);

  const [progress, setProgress] = useState({
    pdf_extraction: 0,
    ml_prediction: 0,
    nlp_summary: 0,
    status: "idle"
  });

  const intervalRef = useRef(null);

  const startPolling = () => {
    setProgress({
      pdf_extraction: 0,
      ml_prediction: 0,
      nlp_summary: 0,
      status: "processing"
    });
    intervalRef.current = setInterval(async () => {
      // Here comes API
      const res={"API":1};
      const data = await res.json();

      setProgress(data);

      if (data.status === "completed") {
        clearInterval(intervalRef.current);
      }
    }, 1000);
  };
  return (
    <div>
      <Navbar />
      <Hero/>
      <Upload setResults={setResults} startPolling={startPolling} />
      <Pd_show results={results} progress={progress} />
      <Result results={results} />
      <Model results={results} />
      <Footer />
    </div>
  )

}

export default App
