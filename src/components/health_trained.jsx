import React from 'react'
import model_logo from '../assets/l_ml_logo.svg'
import classes_logo from '../assets/classes_logo.svg'

function Health_trained() {

    const health_issues = [
        "Acute Kidney Injury (Lab Based)",
        "Anemia",
        "Chronic Kidney Disease",
        "Coronary Artery Disease Risk",
        "Fatty Liver Disease",
        "Hepatitis",
        "Hyperlipidemia",
        "Hypertension",
        "Metabolic Syndrome",
        "Obesity (BMI-Based)",
        "Prediabetes",
        "Stroke Risk",
        "Thyroid Disorder (Hypo/Hyper)",
        "Type 2 Diabetes",
        "Vitamin Deficiency / Nutritional Anemia Variant"
    ]
    return (
        // ------------------------ Scroll Effect For Model Trained On (ALL HEALTH Classes)--------------------
        <div>
            <div className='w-full mb-20'>
                <div className='flex items-center justify-center md:justify-start gap-2 mb-4 px-1'>
                    <img className='w-8 h-8' src={model_logo} alt="model_logo" />
                    <p className='text-sm font-bold text-[#0da5a3] tracking-wider'>MODEL TRAINED ON</p>
                </div>
                <div className='relative w-full overflow-hidden'>
                    <div className='absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#f6f8f6] to-transparent z-10 pointer-events-none'></div>
                    <div className='absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#f6f8f6] to-transparent z-10 pointer-events-none'></div>
                    <div className='flex w-max animate-scroll-x gap-3 px-4'>
                        {[...health_issues, ...health_issues].map((health, index) => (
                            <div key={index} className='flex-none flex items-center gap-2 px-4 py-2 mb-1 border border-[#e5e7eb] rounded-full bg-white shadow-sm hover:border-[#13ec5b]/50 transition-colors cursor-pointer'>
                                <img className='w-5 h-5' src={classes_logo} alt="health_item" />
                                <p className='text-sm font-medium text-[#111813]'>{health}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <p className='mt-3 flex items-center justify-center md:justify-start text-xs font-bold text-gray-600'>(Model will give predictions on these health issues only)</p>
            </div>
        </div>
    )
}

export default Health_trained
