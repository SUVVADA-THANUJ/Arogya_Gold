import React from 'react'

function Model({ results }) {

    // Calculates % bar of each model
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    const confidence_LR = results
        ? Math.floor(results.confidenceList.LR * 100) / 100
        : 0.75;

    const offset_LR = circumference - confidence_LR * circumference;

    const confidence_RF = results
        ? Math.floor(results.confidenceList.RF * 100) / 100
        : 0.90;

    const offset_RF = circumference - confidence_RF * circumference;

    const confidence_SVC = results
        ? Math.floor(results.confidenceList.SVC * 100) / 100
        : 0.80;

    const offset_SVC = circumference - confidence_SVC * circumference;

    const confidence_ANN = results
        ? Math.floor(results.confidenceList.ANN * 100) / 100
        : 0.60;

    const offset_ANN = circumference - confidence_ANN * circumference;


    return (
        // These Component delas with model info. (More details of each model) in form of animated card
        // Each card has two side front side (model name and conf score) back side other scores (3d animation Fliping)
        <div className='max-w-[1400px] mx-auto px-6 sm:px-6 py-10'>
            <div className='grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center'>

                {/* Card 1 Logestic_Regression model info (model predicted idsease,score of recall,precision,F1 and confidence score)*/}
                <div className='group w-full max-w-[320px] h-56 perspective'>
                    <div className='relative w-full h-full duration-500 transform-style preserve-3d group-hover:rotate-y-180'>
                        <div className='absolute w-full h-full backface-hidden border border-slate-200 bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center'>
                            <p className='text-[15px] text-slate-600 font-semibold uppercase tracking-widest mb-4'>Logestic Regression</p>
                            <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle className="text-slate-100" cx="48" cy="48" fill="transparent" r="40"
                                        stroke="currentColor" strokeWidth="8"></circle>
                                    <circle className="text-blue-200" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor"
                                        strokeDasharray={circumference} strokeDashoffset={offset_LR} strokeWidth="8"></circle>
                                </svg>
                                {results ? (<><span className="absolute text-xl font-black">{(Math.floor(results.confidenceList.LR * 100) / 100).toFixed(2)}</span></>) : (<><span className="absolute text-xl font-black">75%</span></>)}
                            </div>
                            <span className='text-sm font-semibold tracking-wider text-slate-500'>Model Confidence</span>
                        </div>
                        <div className="absolute w-full h-full rotate-y-180 backface-hidden border border-slate-200 p-6 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                            {results ? (<><p className='text-xs text-amber-800 font-semibold tracking-wider bg-amber-100 border border-amber-500 px-2 py-1 rounded-full'>Predicted Disease: {results.lrModel}</p></>) : (<><p className='text-xs text-amber-800 font-semibold tracking-wider bg-amber-100 border border-amber-500 px-2 py-1 rounded-full'>Predicted Disease: Heart Attack</p></>)}
                            <div className='flex flex-col items-center justify-center text-center bg-slate-100 p-3 mt-6 rounded-xl border border-slate-500 w-50 h-auto'>
                                <p className='text-slate-800 font-semibold tracking-wider mb-2'>Precision : 0.81</p>
                                <p className='text-slate-800 font-semibold tracking-wider'>F1-Score : 0.82</p>
                                <p className='text-slate-800 font-semibold tracking-wider mt-2'>Recall : 0.85</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2 Random_Forest model info (model predicted idsease,score of recall,precision,F1 and confidence score)*/}
                <div className='group w-full max-w-[320px] h-56 perspective'>
                    <div className='relative w-full h-full duration-500 transform-style preserve-3d group-hover:rotate-y-180'>
                        <div className='absolute w-full h-full backface-hidden border border-slate-200 bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center'>
                            <p className='text-[15px] text-slate-600 font-semibold uppercase tracking-widest mb-4'>Random Forest</p>
                            <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle className="text-slate-100" cx="48" cy="48" fill="transparent" r="40"
                                        stroke="currentColor" strokeWidth="8"></circle>
                                    <circle className="text-green-200" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor"
                                        strokeDasharray={circumference} strokeDashoffset={offset_RF} strokeWidth="8"></circle>
                                </svg>
                                {results ? (<><span className="absolute text-xl font-black">{(Math.floor(results.confidenceList.RF * 100) / 100).toFixed(2)}</span></>) : (<><span className="absolute text-xl font-black">90%</span></>)}

                            </div>
                            <span className='text-sm font-semibold tracking-wider text-slate-500'>Model Confidence</span>
                        </div>
                        <div className="absolute w-full h-full rotate-y-180 backface-hidden border border-slate-200 p-6 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                            {results ? (<><p className='text-xs text-amber-800 font-semibold tracking-wider bg-amber-100 border border-amber-500 px-2 py-1 rounded-full'>Predicted Disease: {results.rfModel}</p></>) : (<><p className='text-xs text-amber-800 font-semibold tracking-wider bg-amber-100 border border-amber-500 px-2 py-1 rounded-full'>Predicted Disease: Heart Attack</p></>)}
                            <div className='flex flex-col items-center justify-center text-center bg-slate-100 p-3 mt-6 rounded-xl border border-slate-500 w-50 h-auto'>
                                <p className='text-slate-800 font-semibold tracking-wider mb-2'>Precision : 0.87</p>
                                <p className='text-slate-800 font-semibold tracking-wider'>F1-Score : 0.87</p>
                                <p className='text-slate-800 font-semibold tracking-wider mt-2'>Recall : 0.87</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3 SVC model info (model predicted idsease,score of recall,precision,F1 and confidence score)*/}
                <div className='group w-full max-w-[320px] h-56 perspective'>
                    <div className='relative w-full h-full duration-500 transform-style preserve-3d group-hover:rotate-y-180'>
                        <div className='absolute w-full h-full backface-hidden border border-slate-200 bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center'>
                            <p className='text-[15px] text-slate-600 font-semibold uppercase tracking-widest mb-4'>SVC</p>
                            <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle className="text-slate-100" cx="48" cy="48" fill="transparent" r="40"
                                        stroke="currentColor" strokeWidth="8"></circle>
                                    <circle className="text-red-200" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor"
                                        strokeDasharray={circumference} strokeDashoffset={offset_SVC} strokeWidth="8"></circle>
                                </svg>
                                {results ? (<><span className="absolute text-xl font-black">{(Math.floor(results.confidenceList.SVC * 100) / 100).toFixed(2)}</span></>) : (<><span className="absolute text-xl font-black">80%</span></>)}
                            </div>
                            <span className='text-sm font-semibold tracking-wider text-slate-500'>Model Confidence</span>

                        </div>
                        <div className="absolute w-full h-full rotate-y-180 backface-hidden border border-slate-200 p-6 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                            {results ? (<><p className='text-xs text-amber-800 font-semibold tracking-wider bg-amber-100 border border-amber-500 px-2 py-1 rounded-full'>Predicted Disease: {results.svcModel}</p></>) : (<><p className='text-xs text-amber-800 font-semibold tracking-wider bg-amber-100 border border-amber-500 px-2 py-1 rounded-full'>Predicted Disease: Heart Attack</p></>)}
                            <div className='flex flex-col items-center justify-center text-center bg-slate-100 p-3 mt-6 rounded-xl border border-slate-500 w-50 h-auto'>
                                <p className='text-slate-800 font-semibold tracking-wider mb-2'>Precision : 0.83</p>
                                <p className='text-slate-800 font-semibold tracking-wider'>F1-Score : 0.81</p>
                                <p className='text-slate-800 font-semibold tracking-wider mt-2'>Recall : 0.82</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 4 ANN model info (model predicted idsease,score of recall,precision,F1 and confidence score)*/}
                <div className='bg-[#0da5a3]/20 border border-[#0da5a3]/70 p-6 rounded-lg shadow-sm flex flex-col items-center text-center relative overflow-hidden w-full'>
                    <div className='absolute top-0 right-0 bg-[#0da5a3] text-white text-[11px] font-bold px-2 py-1 rounded-bl-lg'>CORE MODEL</div>
                    <p className='text-[15px] text-slate-600 font-semibold uppercase tracking-widest mb-4'>Neural Network</p>
                    <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle className="text-slate-100" cx="48" cy="48" fill="transparent" r="40"
                                stroke="currentColor" strokeWidth="8"></circle>
                            <circle className="text-[#0da5a3]/70" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor"
                                strokeDasharray={circumference} strokeDashoffset={offset_ANN} strokeWidth="8"></circle>
                        </svg>
                        {results ? (<><span className="absolute text-xl font-black">{(Math.floor(results.confidenceList.ANN * 100) / 100).toFixed(2)}</span></>) : (<><span className="absolute text-xl font-black">60%</span></>)}
                    </div>
                    <span className='text-sm font-semibold tracking-wider text-slate-500'>Model Confidence</span>
                </div>
            </div>
        </div>
    )
}

export default Model
