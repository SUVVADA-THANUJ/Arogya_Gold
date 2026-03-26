import React from 'react'
import verified_logo from '../assets/verified_logo.svg'
import verified_logo_1 from '../assets/verified_logo_1.svg'
import hero_logo from '../assets/hero_logo.jpg'

function Hero() {
    return (
        <>
            {/* Simple Hero Section includes huge title , some info. about the web and image on right side */}
            <div className='max-w-[1200px] mx-auto px-6 py-10'>
                <div className='grid lg:grid-cols-2 gap-12 border border-slate-200 items-center bg-white shadow-sm p-8 rounded-2xl'>
                    {/* Left part title ans some text */}
                    <div className='space-y-6'>
                        <div className='inline-flex items-center bg-[#0da5a3]/10 text-[#0da5a3] font-bold text-xs rounded-full gap-0.5 px-3 py-1 uppercase tracking-wider'>
                            <img className='w-4 h-4' src={verified_logo} alt="Verified_Logo" />
                            <span>AI DRIVEN PLATFORM</span>
                        </div>
                        <h1 className='text-4xl md:text-5xl font-black text-[#0d1b1b] leading-[1.1] tracking-tight'>
                            Instant Medical Analysis through <span className='text-[#0da5a3]'>Advanced AI</span>
                        </h1>
                        <p className='text-lg text-slate-600 leading-relaxed'>Upload your medical reports for disease prediction and NLP-powered summarization using ML models.</p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 group cursor-default p-4 sm:p-0">
                            <div className="flex-shrink-0 w-2.5 h-2.5 bg-[#0da5a3] rounded-full animate-pulse mt-2 sm:mt-0 shadow-[0_0_10px_rgba(13,165,163,0.5)]"></div>
                            <p className="text-sm sm:text-base md:text-lg text-slate-700 font-medium tracking-tight leading-relaxed group-hover:text-[#0da5a3] transition-colors duration-300">
                                Our <span className="font-mono text-[#0da5a3] bg-[#0da5a3]/10 px-1 rounded">NLP-Model</span> summarized
                                <span className="block sm:inline"> this sentence before you even finished reading it...</span>
                            </p>
                        </div>
                    </div>
                    {/* Right part Image */}
                    <div className='relative'>
                        <div className='rounded-2xl shadow-2xl overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500'>
                            <img className='aspect-video bg-cover bg-center' src={hero_logo} alt="" />
                        </div>
                        <div className='absolute -bottom-6 -left-6 bg-white border border-slate-100 shadow-xl max-w-[200px] p-4 rounded-xl'>
                            <div className='flex items-center gap-2'>
                                <img className='w-6 h-6 bg-green-200 rounded-xl' src={verified_logo_1} alt="" />
                                <p className='text-xs font-bold'>Analysis Completed</p>
                            </div>
                            <div className='h-1.5 w-full bg-slate-200 overflow-hidden rounded-full mt-3'>
                                <div className='bg-[#22c55e] h-full w-full'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hero
