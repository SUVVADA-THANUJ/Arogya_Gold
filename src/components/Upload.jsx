import React, { useRef, useState } from 'react'
import axios from "axios";
import upload_logo from '../assets/upload_logo.svg'
import plus_logo from '../assets/plus_logo.svg'
import tag_logo from '../assets/tag_logo.svg'
import health_plus_logo from '../assets/health_plus_logo.svg'
import submit_arrow_logo from '../assets/submit_arrow_logo.svg'
import left_arrow_logo from '../assets/left_arrow_logo.svg'
import pdf_logo from '../assets/pdf_logo.svg'
import submit_logo from '../assets/submit_logo.svg'
import change_logo from '../assets/change_logo.svg'
import tick_logo from '../assets/tick_logo.svg'

function Upload({ setResults, startPolling }) {

    // Used to retrive current pdf
    const PDF_Input = useRef(null);
    // Used for pdf storeage
    const [pdf_User, setPdf_User] = useState(null);
    // Used to retrive current Manual_text
    const [inputText, setInputText] = useState(null);
    // Used for Manual_text storage
    const [text, setText] = useState(null);
    // Used to store Result from backend (object/dic)
    const [Data, setData] = useState(null);
    // Used for loading animation of submit button
    const [loading, setLoading] = useState(false);

    // Function to retrive current pdf
    const handlePdfUploadClick = () => {
        PDF_Input.current?.click();
    };

    // Function to change pdf
    const handlePdfChange = (e) => {
        const file = e.target.files[0]

        if (file && file.type === "application/pdf") {
            setPdf_User(file);
        }
        else {
            alert("Enter reports in form of PDF only!");
        }
    };

    // Function to store manual_text
    const handleTextInputClick = () => {

        if (!inputText || !inputText.trim()) {
            alert("Please enter symptoms or patient history");
            return;
        }
        setText(inputText)
    };

    // Main function which handles communication with backend , convert raw NLP summary text into Structured text and send result to all components
    // Upload.jsx is the main parent root and other all components acts as child (upload_logo.jsx receives results from backend and shares to other components)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('text', text);
        formData.append('pdf', pdf_User);

        try {

            startPolling();

            const express_response = await axios.post(
                // "http://localhost:5000/predict",
                "https://arogyaexpress.vercel.app/predict",
                formData
            );
            const data = express_response.data
            setData(data);

            function parseDiseaseSummary(text) {
                const result = {};
                const order = ["Explanation", "Causes", "Precautions", "Advice"];

                // Step 1: Clean raw text
                text = text
                    .replace(/\\n/g, " ")
                    .replace(/\n/g, " ")
                    .replace(/�/g, "")
                    .replace(/\s+/g, " ")
                    .trim();

                // Step 2: Split by section names
                const regex = /(Explanation|Causes|Precautions|Advice):/g;
                const parts = text.split(regex);

                // parts format:
                // ["", "Explanation", "text", "Causes", "text", "Advice", "text"]

                for (let i = 1; i < parts.length; i += 2) {
                    const section = parts[i].toLowerCase();
                    let content = parts[i + 1].trim();

                    result[section] = content;
                }

                // Step 3: Fix misalignment (move extra after dot to next section)
                const sectionOrder = ["explanation", "causes", "precautions", "advice"];

                for (let i = 0; i < sectionOrder.length; i++) {
                    const current = sectionOrder[i];
                    const next = sectionOrder[i + 1];

                    if (result[current]) {
                        const splitIndex = result[current].indexOf(". ");

                        if (splitIndex !== -1) {
                            const firstPart = result[current].substring(0, splitIndex);
                            const remaining = result[current].substring(splitIndex + 1);

                            result[current] = firstPart.trim();

                            if (next && !result[next]) {
                                result[next] = remaining.trim();
                            }
                        }
                    }
                }

                return result;
            }


            const NLP_data = data.NLP_Model_disease_summary_output;

            const structuredData = parseDiseaseSummary(NLP_data);

            setResults({
                confidenceList: data.Con_List,
                importantFeatures: data.important_features_values,
                nearCases: data.KNN_Prediction_similar_patient_data,
                nlpSummary: structuredData,
                predictedDisease: data.max_confidence_score_PD,
                lrModel: data.Logestic_Regression_Prediction,
                rfModel: data.Random_Forest_Prediction,
                svcModel: data.SVC_Prediction,
                annModel: data.ANN_Prediction
            });

            setLoading(false);

        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            {/* Upload Section as two parts Left part for pdf input and right part for text input */}
            <div className='max-w-[1200px] mx-auto px-4 md:px-6 py-10'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    <div className='md:col-span-2'>
                        {/* Left Part PDF section */}
                        <div className='border-2 border-dashed border-[#0da5a3]/30 rounded-2xl bg-white p-6 md:p-10 flex flex-col items-center justify-center text-center group hover:border-[#0da5a3] transition-colors h-full'>
                            {/* Input field which is hidden */}
                            <input type="file" accept='application/pdf' ref={PDF_Input} onChange={handlePdfChange} hidden />

                            {pdf_User ?
                                (<>
                                    <div>
                                        <div className='flex flex-col items-center justify-center text-center h-full'>
                                            <img className='w-13 h-13 bg-red-100 p-2 rounded-lg mb-5' src={pdf_logo} alt="" />
                                            <p className='text-[#0da5a3] text-xl md:text-2xl font-semibold mb-2'>Medical Report Selected</p>
                                            <p className='text-base md:text-lg text-slate-500 mb-4 break-all'>{pdf_User.name} (5 MB)</p>
                                        </div>
                                    </div>

                                    {text ?
                                        (<>
                                            {/* Two buttons one is for reloading the page another is for submiting both pdf and text */}
                                            <div className='flex flex-col items-center'>
                                                <p className='text-slate-700 font-semibold tracking-wider mb-8 px-4'>Manual Text Entered <span className='text-slate-500 tracking-wider'>{text}</span></p>
                                                <div className='flex flex-col sm:flex-row items-center gap-4 w-full justify-center'>
                                                    {/* Page Reload */}
                                                    <button onClick={() => window.location.reload()} className='flex gap-2 items-center bg-[#9C2007]/20 border border-[#9C2007]/50 text-[#9C2007] font-semibold tracking-wider px-3 py-2 rounded-xl cursor-pointer hover:bg-[#9C2007]/30'>
                                                        <img className='w-5 h-5' src={change_logo} alt="" />
                                                        Upload New Report
                                                    </button>
                                                    {/* Submit button */}
                                                    <button onClick={handleSubmit} disabled={loading} className='flex gap-2 items-center bg-[#0da5a3]/20 border border-[#0da5a3]/50 text-[#0da5a3] font-semibold tracking-wider px-3 py-2 rounded-xl cursor-pointer hover:bg-[#0da5a3]/30'>
                                                        {loading ? (<><div className='w-4 h-4 border-2 border-[#0da5a3] border-t-transparent rounded-full animate-spin'></div>Processing...</>) : (<><img className='w-5 h-5' src={submit_logo} alt="" />Submit & Analyze</>)}
                                                    </button>
                                                </div>
                                            </div>
                                        </>) : (<>
                                            {/* One Button (to change current pdf) and text (at these stage user need to upload text input) */}
                                            <div className='flex flex-col  sm:flex-row items-center justify-center gap-6 mt-5'>
                                                {/* Change PDF */}
                                                <button onClick={handlePdfUploadClick} className='flex gap-2 items-center bg-[#9C2007]/20 border border-[#9C2007]/50 text-[#9C2007] font-semibold tracking-wider px-3 py-2 rounded-xl cursor-pointer'>
                                                    <img className='w-5 h-5' src={change_logo} alt="" /> Change Report
                                                </button>
                                                <div className='flex gap-2 items-center'>
                                                    <p className='text-slate-600 font-semibold'>Any Manual Text Input</p>
                                                    <img className='w-5 h-5 bg-[#0da5a3] rounded-full p-1 rotate-90 sm:rotate-0' src={submit_arrow_logo} alt="" />
                                                </div>
                                            </div>
                                        </>)
                                    }
                                </>) :
                                (<>
                                    {/* Starting Upload UI which as two button one is cloud image and another is select file button*/}
                                    <div>
                                        <img onClick={handlePdfUploadClick} className='w-13 h-13 bg-[#0da5a3]/20 rounded-full p-1 mb-4 group-hover:scale-110 transition-transform cursor-pointer' src={upload_logo} alt="" />
                                    </div>
                                    <h2 className='text-xl font-bold mb-2'>
                                        Upload Medical Report
                                    </h2>
                                    <p className='max-w-sm text-sm text-slate-500 mb-6'>
                                        Drag and drop your PDF clinical reports. Our AI will automatically parse the data. <span>(Max 10 MB)</span>
                                    </p>
                                    {/* Select File Button */}
                                    <button onClick={handlePdfUploadClick} className='text-sm text-[#0da5a3] font-bold hover:bg-[#0da5a3] hover:text-white transition-all bg-[#0da5a3]/20 px-6 py-2.5 rounded-lg cursor-pointer'>
                                        Select File
                                    </button>
                                </>)}
                        </div>
                    </div>

                    {/* Right Part text section */}
                    <div className='bg-white border border-[#0da5a3]/30 hover:border-[#0da5a3] p-6 md:p-8 shadow-sm rounded-lg flex flex-col'>
                        <div className='flex items-center gap-2 mb-4'>
                            <img className='w-5 h-5' src={health_plus_logo} alt="" />
                            <p className='text-base font-semibold'>Manual Symptom Entry</p>
                        </div>
                        <textarea onChange={(e) => setInputText(e.target.value)} className='p-3 border border-slate-300 rounded-lg w-full h-24 focus:ring-1 focus:ring-[#0da5a3] focus:outline-none resize-none' placeholder="Describe symptoms or patient history..." name="" id=""></textarea>
                        <div className='flex items-center justify-between'>
                            <div>
                                <div className='flex items-center gap-1 mt-4'>
                                    <img className='w-5 h-5' src={tag_logo} alt="" />
                                    <p className='text-sm font-semibold'>Enter Tags Like</p>
                                </div>
                                <div className='flex items-center text-center gap-3 mt-3'>
                                    <span className='text-[#0da5a3] text-sm font-semibold bg-[#0da5a3]/10 px-3 py-1 rounded-xl cursor-pointer'>High Fever</span>
                                    <span className='text-[#0da5a3] text-sm font-semibold bg-[#0da5a3]/10 px-3 py-1 rounded-xl cursor-pointer'>Chest Pain</span>
                                    <img className='w-4 h-4 cursor-pointer' src={plus_logo} alt="" />
                                </div>
                            </div>
                            {text ? (
                                <>
                                    <div>
                                        <img className='w-8 h-8 cursor-pointer' src={tick_logo} alt="" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Submit Button */}
                                    <div>
                                        <img onClick={handleTextInputClick} className='w-8 h-8 bg-[#0da5a3]/80 hover:bg-[#0da5a3] rounded-full p-1 cursor-pointer' src={submit_arrow_logo} alt="" />
                                    </div>
                                </>
                            )}
                        </div>
                        {text ? (<><div className='flex gap-2 items-center justify-center mt-4 bg-slate-100 p-2 rounded-full '>
                            <img className='w-5 h-5 bg-[#0da5a3] rounded-full p-1 rotate-90 md:rotate-0' src={left_arrow_logo} alt="" />
                            <p className='text-slate-600 font-semibold'>Click For Analyze</p>
                        </div></>) : (<></>)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Upload
