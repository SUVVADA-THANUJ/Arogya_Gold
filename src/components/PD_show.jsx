import React, { useEffect, useState } from 'react'
import human_brain_logo from '../assets/human_brain_logo.svg'
import brain_logo from '../assets/brain_logo.svg'
import heart_beat_logo from '../assets/heart_beat_logo.svg'
import l_pdf_logo from '../assets/l_pdf_logo.svg'
import l_ml_logo from '../assets/l_ml_logo.svg'
import l_nlp_logo from '../assets/l_nlp_logo.svg'

function Pd_show({ results, progress }) {

    return (
        // These component has two part Left part (Shows predicted disease) Right Part (progress bar of pdf_text ectraction,prediction of ml models and generating nlp summary)
        <div className='max-w-[1200px] mx-auto px-4 md:px-6 py-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Left Part */}
                <div className='bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl p-6 md:p-8'>
                    <div className='flex flex-col md:flex-row items-center gap-8'>
                        <div>
                            <div className='flex items-center justify-center md:justify-start tracking-wider gap-2 mb-3'>
                                <img className='w-8 h-8' src={brain_logo} alt="" />
                                <p className='font-semibold text-base md:text-lg'>Machine Learning & NLP</p>
                            </div>
                            {/*  */}
                            {results ? (<><p className='text-2xl md:text-xl font-bold mb-4'>{results.predictedDisease}</p></>) : (<><p className='text-2xl md:text-3xl font-bold mb-4'>Type-2 Sugar Detected</p></>)}
                            <p className='text-sm  italic opacity-90'>This result is produced by machine learning and NLP models that analyze the input data, extract key patterns, and generate a prediction score. The completed analysis indicates that all models have finished processing and the final prediction has been generated successfully.
                            </p>
                        </div>
                        <img className='w-20 h-20 md:w-24 md:h-24' src={human_brain_logo} alt="" />
                    </div>
                    <div className='flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6 pt-6 border-t border-white/20'>
                        <p className='text-lg font-bold pr-4 md:border-r border-white/40 tracking-wider'>High Prediction Score</p>
                        {results ? (<>
                            <div className='flex items-center gap-1 text-center bg-white px-2 py-1 rounded-full shadow-sm'><span className='bg-[#00FF22] w-2 h-2 animate-pulse rounded-full'></span>
                                <p className='text-[11px] text-green-600 tracking-wider'>Analysis Completed</p></div>
                        </>) : (<>
                            <div className='flex items-center gap-1 text-center bg-white px-2 py-1 rounded-full shadow-sm'><span className='bg-red-400 w-2 h-2 animate-pulse rounded-full'></span>
                                <p className='text-[11px] text-red-600 tracking-wider'>Start Prediction</p></div>
                        </>)}

                    </div>
                </div>

                {/* Right Part */}
                <div>
                    <div className='bg-white border border-slate-200 rounded-xl shadow p-6 md:p-8'>
                        <div className='flex items-center justify-between mb-6'>
                            <div className='flex items-center gap-2'>
                                <img className='w-10 h-10 bg-[#0da5a3]/10 p-2 rounded-full' src={heart_beat_logo} alt="" />
                                <h2 className="text-xl md:text-2xl text-[#0da5a3] font-semibold tracking-wider">Processing State</h2>
                            </div>
                            {results ? (<><div className='flex items-center gap-1 text-center bg-green-100 px-2 py-1 rounded-full shadow-sm'>
                                <span className='bg-[#00FF22] w-2 h-2 rounded-full'></span>
                                <p className='text-[11px] text-green-800 animate-pulse tracking-wider'>Analysis Completed</p>
                            </div></>) : (<><div className='flex items-center gap-1 text-center bg-red-100 px-2 py-1 rounded-full shadow-sm'>
                                <span className='bg-red-400 w-2 h-2 animate-pulse rounded-full'></span>
                                <p className='text-[11px] text-red-800 tracking-wider'>Start Prediction</p>
                            </div></>)}
                        </div>

                        <ProgressBar title="PDF Text Extraction" value={progress.pdf_extraction} image={l_pdf_logo} color={"#9C2007"} />
                        <ProgressBar title="ML Prediction" value={progress.ml_prediction} image={l_ml_logo} color={"#0da5a3"} />
                        <ProgressBar title="NLP Summarization" value={progress.nlp_summary} image={l_nlp_logo} color={"#cb9900"} />
                    </div>
                </div>
            </div>
        </div>
    )
}

// Function for progress bars
function ProgressBar({ title, value, image, color }) {
    return (
        <div className="mb-10">
            <div className="flex justify-between mb-2">
                <div className='flex items-center gap-2'>
                    <img className='w-5 h-5' src={image} alt="" />
                    <p
                        className="text-xs md:text-sm tracking-wider font-semibold"
                        style={{ color: color }}
                    >
                        {title}
                    </p>
                </div>

                {value === 100 ? (
                    <div className='flex items-center gap-1 text-center'>
                        <span
                            className='w-2 h-2 rounded-full'
                            style={{ backgroundColor: color }}
                        ></span>
                        <p
                            className="text-sm font-semibold"
                            style={{ color: color }}
                        >
                            Done
                        </p>
                    </div>
                ) : (
                    <p
                        className="text-sm font-semibold"
                        style={{ color: color }}
                    >
                        {value}%
                    </p>
                )}
            </div>

            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                        width: `${value}%`,
                        backgroundColor: color
                    }}
                ></div>
            </div>
        </div>
    );
}

export default Pd_show

