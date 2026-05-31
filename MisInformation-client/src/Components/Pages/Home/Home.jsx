import React from 'react';
import Banner from './Banner';
import RiskAnalysisEngine from './RiskAnalysisEngine'

const Home = () => {
    return (
        <div className='mt-5'>
            <Banner></Banner>
            <div className='my-10'></div>
            <RiskAnalysisEngine></RiskAnalysisEngine>
        </div>
    );
};

export default Home;