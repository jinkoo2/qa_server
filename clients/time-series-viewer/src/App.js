// src/App.js
import React from 'react';
import TimeSeriesChart from './components/TimeSeriesChart';

const App = () => {
    return (
        <div className="App">
            <h1>Time Series Viewer</h1>
            <TimeSeriesChart />
        </div>
    );
};

export default App;
