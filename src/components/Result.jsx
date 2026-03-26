import React, { useEffect, useRef, useState, useMemo } from 'react'
import report_logo from '../assets/report_logo.svg'
import people_logo from '../assets/people_logo.svg'
import key_logo from '../assets/key_logo.svg'
import risk_logo from '../assets/risk_logo.svg'
import virus_logo_1 from '../assets/virus_logo_1.svg'
import virus_logo_2 from '../assets/virus_logo_2.svg'


function Result({ results }) {


    const sliding_list = ["Summary", "Similar Cases", "Key Features"];

    // Used to know what is the active slide
    const [activeSlide, setActiveSlide] = useState(0)

    const slideRef = useRef(null);

    const removeScrollGlitch = useRef(false);

    const sample_important_features = { "Fast Glucose": 0.42, "BMI Index": 0.28, "Age Profile": 0.15, "HbA1c": 0.10 }
    // Used for pop up in KNN card
    const [showCasePopup, setShowCasePopup] = useState(false);
    // Used to case in knn card
    const [selectedCase, setSelectedCase] = useState(null);
    // Used for feature ranges (risk factor card)
    const featureRanges = {
        age: { GOOD: [0, 39], ELEVATED: [40, 55], HIGH: [56, 120] },
        alp: { GOOD: [44, 147], ELEVATED: [148, 200], HIGH: [201, 500] },
        alt: { GOOD: [7, 56], ELEVATED: [57, 100], HIGH: [101, 500] },
        ast: { GOOD: [10, 40], ELEVATED: [41, 80], HIGH: [81, 500] },
        bilirubin: { GOOD: [0.1, 1.2], ELEVATED: [1.3, 2], HIGH: [2.1, 10] },
        blood_glucose: { GOOD: [70, 99], ELEVATED: [100, 125], HIGH: [126, 400] },
        blood_pressure: { GOOD: [0, 119], ELEVATED: [120, 139], HIGH: [140, 250] },
        bmi: { GOOD: [18.5, 24.9], ELEVATED: [25, 29.9], HIGH: [30, 60] },
        cholesterol: { GOOD: [0, 199], ELEVATED: [200, 239], HIGH: [240, 500] },
        creatinine: { GOOD: [0.7, 1.3], ELEVATED: [1.4, 2], HIGH: [2.1, 10] },
        hba1c: { GOOD: [0, 5.6], ELEVATED: [5.7, 6.4], HIGH: [6.5, 15] },
        hemoglobin: { GOOD: [13, 17], ELEVATED: [11, 12.9], HIGH: [0, 10.9] },
        mch: { GOOD: [27, 33], ELEVATED: [24, 26], HIGH: [0, 23] },
        mchc: { GOOD: [32, 36], ELEVATED: [30, 31], HIGH: [0, 29] },
        mcv: { GOOD: [80, 100], ELEVATED: [70, 79], HIGH: [0, 69] },
        t3: { GOOD: [0.8, 2], ELEVATED: [0.6, 0.79], HIGH: [0, 0.59] },
        t4: { GOOD: [5, 12], ELEVATED: [4, 4.9], HIGH: [0, 3.9] },
        tsh: { GOOD: [0.4, 4], ELEVATED: [4.1, 6], HIGH: [6.1, 20] },
        urea: { GOOD: [15, 40], ELEVATED: [41, 60], HIGH: [61, 200] }
    };
    // Feature Units
    const featureUnits = {
        age: "years",
        alp: "U/L",
        alt: "U/L",
        ast: "U/L",
        bilirubin: "mg/dL",
        blood_glucose: "mg/dL",
        blood_pressure: "mmHg",
        bmi: "kg/m²",
        cholesterol: "mg/dL",
        creatinine: "mg/dL",
        hba1c: "%",
        hemoglobin: "g/dL",
        mch: "pg",
        mchc: "g/dL",
        mcv: "fL",
        t3: "ng/mL",
        t4: "µg/dL",
        tsh: "mIU/L",
        urea: "mg/dL"
    };

    const riskColors = {
        GOOD: "#22c55e",
        ELEVATED: "#f59e0b",
        HIGH: "#ef4444"
    };

    // Function which is used to know Risk factor of that specific feature based upon range
    const getRiskLevel = (value, ranges) => {
        if (value >= ranges.GOOD[0] && value <= ranges.GOOD[1]) return "GOOD";
        if (value >= ranges.ELEVATED[0] && value <= ranges.ELEVATED[1]) return "ELEVATED";
        return "HIGH"; // Changed from "HIGH RISK" to "HIGH"
    };

    // Function which is used to know % of that specific feature based upon range
    const getProgressPercent = (value, ranges) => {
        if (value >= ranges.GOOD[0] && value <= ranges.GOOD[1]) {
            return ((value - ranges.GOOD[0]) / (ranges.GOOD[1] - ranges.GOOD[0])) * 33;
        }

        if (value >= ranges.ELEVATED[0] && value <= ranges.ELEVATED[1]) {
            return 33 + ((value - ranges.ELEVATED[0]) / (ranges.ELEVATED[1] - ranges.ELEVATED[0])) * 33;
        }

        return 66 + ((value - ranges.HIGH[0]) / (ranges.HIGH[1] - ranges.HIGH[0])) * 34;
    };

    // Function used to generate realistic fallback GOOD value (not too low)
    const generateFallbackValue = (ranges) => {
        const min = ranges.GOOD[0];
        const max = ranges.GOOD[1];

        const midMin = min + (max - min) * 0.3;
        const midMax = min + (max - min) * 0.7;

        return (Math.random() * (midMax - midMin) + midMin).toFixed(2);
    };

    const diseaseFallbacks = {
        "Acute Kidney Injury (Lab Based)": ["creatinine", "urea", "blood_pressure"],
        "Anemia": ["hemoglobin", "mch", "mcv"],
        "Hepatitis": ["alt", "ast", "bilirubin"],
        "Diabetes": ["hba1c", "blood_glucose", "bmi"],
        "Default": ["blood_glucose", "blood_pressure", "cholesterol"]
    };

    const getTopRiskFeatures = (results) => {
        const importantFeatures = (results?.Important_Features || []).map(f => f.toLowerCase());
        const featureValues = results?.features || {};
        const predictedDisease = results?.ANN_Prediction || "Default";

        const excluded = ["age", "gender"];
        let output = [];

        // 1. PROCESS ONLY IMPORTANT FEATURES
        importantFeatures.forEach((featureKey) => {
            if (excluded.includes(featureKey)) return;

            let value = featureValues[featureKey];
            if (value === null || value === undefined) return;

            const ranges = featureRanges[featureKey];
            if (!ranges) return;

            const numValue = parseFloat(value);
            if (isNaN(numValue)) return;

            const risk = getRiskLevel(numValue, ranges);

            output.push({
                feature: featureKey.toUpperCase(),
                value: numValue,
                unit: featureUnits[featureKey] || "",
                risk,
                percent: Math.min(100, Math.max(0, getProgressPercent(numValue, ranges))),
                color: riskColors[risk],
                standard: `${ranges.GOOD[0]} - ${ranges.GOOD[1]}`
            });
        });

        // 2. SORT BY RISK (STRICT PRIORITY)
        const riskOrder = { "HIGH": 3, "ELEVATED": 2, "GOOD": 1 };
        output.sort((a, b) => riskOrder[b.risk] - riskOrder[a.risk]);

        // 3. ADD FALLBACKS IF LESS THAN 3
        if (output.length < 3) {
            const fallbacks = diseaseFallbacks[predictedDisease] || diseaseFallbacks["Default"];

            fallbacks.forEach(fKey => {
                if (output.length >= 3) return;

                const lowerKey = fKey.toLowerCase();

                const alreadyExists = output.find(o => o.feature.toLowerCase() === lowerKey);
                if (alreadyExists) return;

                const ranges = featureRanges[lowerKey];
                if (!ranges) return;

                let value = featureValues[lowerKey];

                if (value === null || value === undefined) {
                    value = generateFallbackValue(ranges); // Use realistic GOOD value
                }

                const numValue = parseFloat(value);
                if (isNaN(numValue)) return;

                const risk = getRiskLevel(numValue, ranges);

                output.push({
                    feature: lowerKey.toUpperCase(),
                    value: numValue,
                    unit: featureUnits[lowerKey] || "",
                    risk,
                    percent: Math.min(100, Math.max(0, getProgressPercent(numValue, ranges))),
                    color: riskColors[risk],
                    standard: `${ranges.GOOD[0]} - ${ranges.GOOD[1]}`
                });
            });
        }

        // 4. RETURN TOP 3
        return output.slice(0, 3);
    };

    const riskFactors = React.useMemo(() => {
        return getTopRiskFeatures(results);
    }, [results]);


    // Function to handle scrolling effect
    function goToSlide(index) {
        const current_slide = slideRef.current;

        if (!current_slide) return;

        removeScrollGlitch.current = true;

        const slideWidth = current_slide.clientWidth;

        current_slide.scrollTo({
            left: slideWidth * index,
            behavior: "smooth"
        });

        setActiveSlide(index);

        setTimeout(() => {
            removeScrollGlitch.current = false;
        }, 400);
    }

    // Hook used for scrolling effect
    useEffect(() => {
        const slider = slideRef.current;
        if (!slider) return;

        const handleScroll = () => {
            if (removeScrollGlitch.current) return;
            const index = Math.round(slider.scrollLeft / slider.clientWidth);
            setActiveSlide(index);
        };

        slider.addEventListener("scroll", handleScroll);

        return () => slider.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Result sections has tow parts Left Part (three part 1.NLP summary section 2.KNN 3.Important_Features) and Right Part (Risk Factors Progress bar) */}
            <div className='max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8'>
                    {/* Left Part */}
                    <div className='border border-slate-200 bg-white shadow-sm rounded-2xl flex flex-col overflow-hidden min-w-0'>
                        <div className='bg-slate-100 text-sm font-bold p-1.5 flex gap-1 border-b border-slate-100'>
                            {sliding_list.length > 0 ? (
                                <>
                                    {sliding_list.map((Feature, index) => (
                                        <button onClick={() => goToSlide(index)} key={index}
                                            className={`tab-btn flex-1 min-w-[80px] py-2 px-2 md:px-3 rounded-lg cursor-pointer text-sm md:text-sm transition-colors ${activeSlide === index ? 'bg-[#0da5a3] text-white shadow-sm' : 'bg-white text-[#0da5a3]'}`}>
                                            {Feature}
                                        </button>
                                    ))}
                                </>) : (
                                <></>
                            )}
                        </div>
                        <div className='p-5 md:p-8 flex-1'>
                            <div className='relative w-full overflow-hidden'>
                                <div ref={slideRef} className="flex items-start overflow-x-auto snap-x snap-mandatory scroll-smooth w-full">
                                    {/* Slide 1 which shows NLP summary */}
                                    {/* <div className='min-w-full min-h-fit snap-center space-y-4 md:space-y-6 p-1 h-[150px]' id='slide-0'> */}
                                    <div className='min-w-full snap-center p-1 h-[150px] flex flex-col' id='slide-0'>

                                        <div className='flex flex-wrap items-center gap-2'>
                                            <img className='w-7 h-7 bg-[#0da5a3]/10 p-0.5 rounded-sm' src={report_logo} alt="" />
                                            <p className='text-base md:text-lg font-semibold'>Medical Report Summary</p>
                                            {results ? (<><span className='text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold mt-1 ml-3'>{results.predictedDisease}</span></>) : (<></>)}
                                        </div>

                                        <div className='bg-[#0da5a3]/7 mt-5 p-4 md:p-6 rounded-2xl'>
                                            <p className='text-xs font-bold text-[#0da5a3] mb-2'>NLP Summary</p>

                                            {/* Scroll only for summary content */}
                                            <div className='max-h-[220px] overflow-y-auto pr-2'>
                                                {results ? (
                                                    <div className='text-sm md:text-[16px] text-slate-800 leading-relaxed italic space-y-2'>

                                                        {results.nlpSummary.explanation && (
                                                            <p>
                                                                <span className="font-semibold not-italic">Explanation: </span>
                                                                {results.nlpSummary.explanation}
                                                            </p>
                                                        )}

                                                        {results.nlpSummary.causes && (
                                                            <p>
                                                                <span className="font-semibold not-italic">Causes: </span>
                                                                {results.nlpSummary.causes}
                                                            </p>
                                                        )}

                                                        {results.nlpSummary.precaution && (
                                                            <p>
                                                                <span className="font-semibold not-italic">Precautions: </span>
                                                                {results.nlpSummary.precaution}
                                                            </p>
                                                        )}

                                                        {results.nlpSummary.advice && (
                                                            <p>
                                                                <span className="font-semibold not-italic">Advice: </span>
                                                                {results.nlpSummary.advice}
                                                            </p>
                                                        )}

                                                    </div>
                                                ) : (
                                                    <p className='text-sm md:text-[16px] text-slate-800 leading-relaxed italic'>
                                                        The patient presents with elevated glucose levels and signs of metabolic stress. Primary markers indicate risk profile Type 2, with no acute respiratory finding.

                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Slide 2 which show KNN output */}
                                    <div className='min-w-full min-h-fit snap-center space-y-4 md:space-y-6 p-1 relative' id='slide-1'>

                                        <div className='flex items-center gap-2'>
                                            <img className='w-8 h-8 bg-[#ff0000]/10 p-1 rounded-xl' src={people_logo} alt="" />
                                            <p className='text-base md:text-lg font-semibold'>Similar Cases</p>

                                            {results ? (<><span className='text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold mt-1 ml-3'>{results.predictedDisease}</span></>) : (<></>)}

                                        </div>
                                        <p className='text-sm text-slate-700'>Nearest clinical profiles (KNN Model)</p>
                                        <div className='space-y-4'>
                                            <div className='flex items-center justify-between bg-[#ff0000]/4 rounded-xl p-2'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-8 h-8 bg-[#ff0000]/40 flex items-center justify-center rounded-full text-xs font-bold'>
                                                        C1
                                                    </div>
                                                    <div>
                                                        <p className='text-sm font-bold text-[#ff0000]/80'>Case-891</p>
                                                        <p className='text-[11px] font-bold'>98% Similarity</p>
                                                    </div>
                                                </div>
                                                <span
                                                    onClick={() => {
                                                        setSelectedCase("Case-1");
                                                        setShowCasePopup(true);
                                                    }}
                                                    className='text-sm font-semibold bg-[#ff0000]/40 px-2 py-1 rounded-xl tracking-wider cursor-pointer hover:bg-[#ff0000]/30'
                                                >
                                                    Check
                                                </span>
                                            </div>
                                            <div className='flex items-center justify-between bg-[#ff0000]/4 rounded-xl p-2'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-8 h-8 bg-[#ff0000]/40 flex items-center justify-center rounded-full text-xs font-bold'>
                                                        C2
                                                    </div>
                                                    <div>
                                                        <p className='text-sm font-bold text-[#ff0000]/80'>Case-504</p>
                                                        <p className='text-[11px] font-bold'>69% Similarity</p>
                                                    </div>
                                                </div>
                                                <span
                                                    onClick={() => {
                                                        setSelectedCase("Case-2");
                                                        setShowCasePopup(true);
                                                    }}
                                                    className='text-sm font-semibold bg-[#ff0000]/40 px-2 py-1 rounded-xl tracking-wider cursor-pointer hover:bg-[#ff0000]/30'
                                                >
                                                    Check
                                                </span>
                                            </div>
                                        </div>

                                        {/* Pop-Up effect of each case */}
                                        {showCasePopup && (
                                            <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-slate-900/40 backdrop-blur-sm">
                                                <div className="bg-white w-full max-w-md p-6 md:p-9 rounded-2xl shadow-xl relative border border-slate-200">

                                                    <button
                                                        onClick={() => setShowCasePopup(false)}
                                                        className="absolute top-4 right-4 text-xs font-bold cursor-pointer bg-[#ff0000]/20 text-[#ff0000]/50 hover:bg-[#ff0000]/60 hover:text-white px-2 py-1 rounded-full"
                                                    >
                                                        X
                                                    </button>

                                                    <h2 className="text-lg font-semibold mb-4 tracking-wider text-slate-700 text-center">Case Details</h2>

                                                    <div className="space-y-2 text-sm">

                                                        {results ? (<>
                                                            {selectedCase === "Case-1" ? (<><p className='font-semibold bg-amber-100 border border-amber-500 text-amber-800 text-center rounded-full py-1 mb-3'>Predicted Disease: {results.predictedDisease}</p>
                                                                <div className='grid grid-cols-3 gap-2'>
                                                                    <p className="font-semibold text-center text-slate-700 bg-slate-100 border border-slate-500 px-3 py-5 rounded-xl flex flex-col">Age<span>{results.nearCases[0].age}</span></p>
                                                                    <p className="font-semibold text-center text-slate-700 bg-slate-100 border border-slate-500 px-3 py-5 rounded-xl  flex flex-col">BMI<span>{results.nearCases[0].bmi}</span></p>
                                                                    <p className="font-semibold text-center text-slate-700 bg-slate-100 border border-slate-500 px-3 py-5 rounded-xl  flex flex-col">Blood Pressure<span>{results.nearCases[0].blood_pressure}</span></p>
                                                                </div></>) : (<><p className='font-semibold bg-amber-100 border border-amber-500 text-amber-800 text-center rounded-full py-1 mb-3'>Predicted Disease: {results.predictedDisease}</p>
                                                                    <div className='grid grid-cols-3 gap-2'>
                                                                        <p className="font-semibold text-center text-slate-700 bg-slate-100 border border-slate-500 px-3 py-5 rounded-xl flex flex-col">Age<span>{results.nearCases[1].age}</span></p>
                                                                        <p className="font-semibold text-center text-slate-700 bg-slate-100 border border-slate-500 px-3 py-5 rounded-xl  flex flex-col">BMI<span>{results.nearCases[1].bmi}</span></p>
                                                                        <p className="font-semibold text-center text-slate-700 bg-slate-100 border border-slate-500 px-3 py-5 rounded-xl  flex flex-col">Blood Pressure<span>{results.nearCases[1].blood_pressure}</span></p>
                                                                    </div></>)}
                                                        </>) : (<>
                                                            <p className='font-semibold bg-amber-100 border border-amber-500 text-amber-800 text-center rounded-full py-1 mb-3'>Predicted Disease: Sugar</p>
                                                            <div className='grid grid-cols-3 gap-2'>
                                                                <p className="font-semibold text-center text-slate-700 bg-slate-100 border border-slate-500 px-3 py-5 rounded-xl flex flex-col">Age<span>56</span></p>
                                                                <p className="font-semibold text-center text-slate-700 bg-slate-100 border border-slate-500 px-3 py-5 rounded-xl  flex flex-col">BMI<span>29.5</span></p>
                                                                <p className="font-semibold text-center text-slate-700 bg-slate-100 border border-slate-500 px-3 py-5 rounded-xl  flex flex-col">Blood Pressure<span>148</span></p>
                                                            </div>
                                                        </>)}
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Slide 3 which shows important features */}
                                    <div className='min-w-full min-h-fit snap-center space-y-6 p-1' id='slide-2'>
                                        <div className='flex items-center gap-2'>
                                            <img className='w-8 h-8 bg-[#F2FF00]/20 rounded-xl p-1' src={key_logo} alt="" />
                                            <p className='text-lg font-semibold'>Key Features</p>
                                            {results ? (<><span className='text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold mt-1 ml-3'>{results.predictedDisease}</span></>) : (<></>)}

                                        </div>
                                        <div className=' grid grid-cols-2 gap-3'>
                                            {results ?
                                                (<>
                                                    {Object.entries(results.importantFeatures).map(([key, value]) => (
                                                        <div key={key} className='border border-[#9C9407]/50 bg-[#F2FF00]/4 rounded-xl p-3'>
                                                            <p className='text-[10px] font-bold text-slate-400 mb-1'>WEIGHTING</p>
                                                            <p className='text-sm font-bold'>{key}</p>
                                                            <p className='text-xs font-semibold text-[#9C9407]'>{value ?? "0.111"} Contribution</p>
                                                        </div>
                                                    ))}
                                                </>) :
                                                (
                                                    <>
                                                        {Object.entries(sample_important_features).map(([key, value]) => (
                                                            <div key={key} className='border border-[#9C9407]/50 bg-[#F2FF00]/4 rounded-xl p-3'>
                                                                <p className='text-[10px] font-bold text-slate-400 mb-1'>WEIGHTING</p>
                                                                <p className='text-sm font-bold'>{key}</p>
                                                                <p className='text-xs font-semibold text-[#9C9407]'>{value} Contribution</p>
                                                            </div>
                                                        ))}
                                                    </>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='border border-slate-200 bg-white rounded-xl shadow-sm p-6 md:p-8'>
                        <div className='flex items-center justify-between mb-8'>
                            <div className='flex items-center gap-2'>
                                <img className='w-8 h-8 bg-[#ff0000]/10 p-1 rounded-xl' src={risk_logo} alt="" />
                                <p className='text-lg font-semibold'>Critical Risk Factors</p>
                            </div>
                            <p className='text-[9px] md:text-[11px] font-bold border border-amber-500 bg-amber-100 text-amber-800 px-2 py-1 rounded-full'>3 Important Features</p>
                        </div>
                        <div className='space-y-6'>
                            {results ?
                                (<>
                                    {riskFactors.map((item, index) => (
                                        <div key={index}>
                                            <div className='flex items-end justify-between mb-2'>
                                                <div>
                                                    <p className='text-[16px] font-semibold uppercase'>{item.feature}</p>
                                                    <p className='text-[12px] text-slate-500'>Standard: {item.standard}{item.unit}</p>
                                                </div>
                                                <div className='text-right'>
                                                    <p className='font-bold' style={{ color: item.color }}>
                                                        {item.value}{item.unit}
                                                    </p>
                                                    <p className='text-[11px] font-bold tracking-wider' style={{ color: item.color }}>
                                                        {item.risk}
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="w-full bg-gray-200 h-2 rounded-full relative">

                                                <div
                                                    className="h-2 rounded-full transition-all duration-500 absolute"
                                                    style={{
                                                        width: `${item.percent}%`,
                                                        backgroundColor: item.color
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </>) :
                                (<>
                                    <div>
                                        <div className='flex items-end justify-between mb-2'>
                                            <div>
                                                <p className='text-[16px] font-semibold uppercase'>Blood Glucose</p>
                                                <p className='text-[12px] text-slate-500'>Standard: 70 - 99 mg/dL</p>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-bold text-amber-600'>142 mg/dL</p>
                                                <p className='text-[10px] text-amber-400 font-bold tracking-wider'>ELEVATED</p>
                                            </div>

                                        </div>
                                        <div className='bg-slate-100 h-2 w-full rounded-full relative'>
                                            <div className='absolute h-2 w-80 bg-green-200 rounded-full'></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='flex items-end justify-between mb-2'>
                                            <div>
                                                <p className='text-[16px] font-semibold uppercase'>BMI Index</p>
                                                <p className='text-[12px] text-slate-500'>Standard: 18.5 - 24.9</p>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-bold text-amber-600'>30.4</p>
                                                <p className='text-[10px] text-amber-400 font-bold tracking-wider'>ELEVATED</p>
                                            </div>

                                        </div>
                                        <div className='bg-slate-100 h-2 w-full rounded-full relative'>
                                            <div className='absolute h-2 w-40 bg-green-200 rounded-full'></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='flex items-end justify-between mb-2'>
                                            <div>
                                                <p className='text-[16px] font-semibold uppercase'>HbA1c</p>
                                                <p className='text-[12px] text-slate-500'>Standard: &lt; 5.7% </p>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-bold text-green-600'>5.4%</p>
                                                <p className='text-[10px] text-green-400 font-bold tracking-wider'>NORMAL</p>
                                            </div>

                                        </div>
                                        <div className='bg-slate-100 h-2 w-full rounded-full relative'>
                                            <div className='absolute h-2 w-60 bg-green-200 rounded-full'></div>
                                        </div>
                                    </div>
                                </>)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Result
