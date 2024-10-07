// src/App.js
import React from 'react';
import TimeSeriesChart from './components/TimeSeriesChart';

const App = () => {
    return (
        <div className="App">
            <h2>Time Series Viewer</h2>
            <TimeSeriesChart />
        </div>
    );
};

export default App;
