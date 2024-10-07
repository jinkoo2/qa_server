import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Brush, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const number1d_url = 'http://roweb3.uhmc.sbuh.stonybrook.edu:4000/api/number1ds';

// Function to get the date in "YYYY-MM-DD" format
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

// Get today at 11:59 PM
const getEndOfToday = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return formatDate(today);
};

// Get 7 days before today
const getStartDate = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    return formatDate(startDate);
};

const TimeSeriesChart = () => {
    // Set default start and end dates
    const [startDate, setStartDate] = useState(getStartDate);
    const [endDate, setEndDate] = useState(getEndOfToday);

    const [data, setData] = useState([]);
    const [deviceId, setDeviceId] = useState('');
    const [suggestedDeviceIds, setSuggestedDeviceIds] = useState([]);
    const [filteredDeviceIds, setFilteredDeviceIds] = useState([]);
    const [seriesId, setSeriesId] = useState('');
    const [suggestedSeriesIds, setSuggestedSeriesIds] = useState([]);
    const [filteredSeriesIds, setFilteredSeriesIds] = useState([]);

    // Function to fetch data from the server
    const fetchData = async () => {
        try {
            const response = await axios.get(number1d_url, {
                params: {
                    device_id: deviceId,
                    series_id: seriesId,
                    start_date: startDate,
                    end_date: endDate
                }
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fetch all available device IDs
    useEffect(() => {
        const fetchDeviceIds = async () => {
            try {
                const response = await axios.get(number1d_url + '/device/ids');
                setSuggestedDeviceIds(response.data);
            } catch (error) {
                console.error('Error fetching device IDs:', error);
            }
        };
        fetchDeviceIds();
    }, []);

    // Filter device IDs as user types
    const handleDeviceIdChange = (e) => {
        const input = e.target.value;
        setDeviceId(input);

        // Filter the suggested device IDs
        const filtered = suggestedDeviceIds.filter(id =>
            id.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredDeviceIds(filtered);
    };

    // Fetch series IDs based on selected device ID
    const fetchSeriesIds = async (id) => {
        try {
            const response = await axios.get(number1d_url + '/series/ids', {
                params: { device_id: id }
            });
            setSuggestedSeriesIds(response.data);
        } catch (error) {
            console.error('Error fetching series IDs:', error);
        }
    };

    // Handle selecting a suggestion from the dropdown for device ID
    const handleDeviceIdSelect = (id) => {
        setDeviceId(id);
        setFilteredDeviceIds([]); // Clear suggestions after selection
        fetchSeriesIds(id); // Fetch series IDs for the selected device
    };

    // Filter series IDs as user types
    const handleSeriesIdChange = (e) => {
        const input = e.target.value;
        setSeriesId(input);

        // Filter the suggested series IDs
        const filtered = suggestedSeriesIds.filter(id =>
            id.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredSeriesIds(filtered);
    };

    // Handle selecting a suggestion from the dropdown for series ID
    const handleSeriesIdSelect = (id) => {
        setSeriesId(id);
        setFilteredSeriesIds([]); // Clear suggestions after selection
    };

    // Handle date change and dismiss date picker
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        e.target.blur(); // Dismiss date picker
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        e.target.blur(); // Dismiss date picker
    };

    // Form submission to fetch data based on user input
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    // Convert data to CSV
    const convertToCSV = (data) => {
        const header = ['time', 'value', 'device_id', 'series_id'];
        const rows = data.map(item => [item.time, item.value, item.device_id, item.series_id]);
        return [header, ...rows].map(e => e.join(",")).join("\n");
    };

    // Download the data as a CSV file
    const downloadCSV = () => {
        const csvData = convertToCSV(data);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `data.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div>
            {/* Form to filter the data */}
            <form onSubmit={handleSubmit}>
                <label>
                    Device ID:
                    <input 
                        type="text" 
                        value={deviceId} 
                        onChange={handleDeviceIdChange} 
                        placeholder="Type to search..."
                    />
                    {/* Dropdown for auto-suggest */}
                    {deviceId && filteredDeviceIds.length > 0 && (
                        <ul style={{ border: '1px solid #ccc', margin: 0, padding: 0 }}>
                            {filteredDeviceIds.map((id) => (
                                <li 
                                    key={id} 
                                    style={{ cursor: 'pointer', listStyle: 'none', padding: '5px' }}
                                    onClick={() => handleDeviceIdSelect(id)} // Use the new select function
                                >
                                    {id}
                                </li>
                            ))}
                        </ul>
                    )}
                </label>
                
                <label>
                    Series ID:
                    <input 
                        type="text" 
                        value={seriesId} 
                        onChange={handleSeriesIdChange} 
                        placeholder="Type to search..."
                    />
                    {/* Dropdown for auto-suggest */}
                    {seriesId && filteredSeriesIds.length > 0 && (
                        <ul style={{ border: '1px solid #ccc', margin: 0, padding: 0 }}>
                            {filteredSeriesIds.map((id) => (
                                <li 
                                    key={id} 
                                    style={{ cursor: 'pointer', listStyle: 'none', padding: '5px' }}
                                    onClick={() => handleSeriesIdSelect(id)} // Use the new select function
                                >
                                    {id}
                                </li>
                            ))}
                        </ul>
                    )}
                </label>
                
                <label>
                    Start Date:
                    <input type="date" value={startDate} onChange={handleStartDateChange} />
                </label>
                <label>
                    End Date:
                    <input type="date" value={endDate} onChange={handleEndDateChange} />
                </label>
                <button type="submit">Fetch Data</button>
            </form>

            {/* Download Button */}
            {data.length > 0 && (
                <button onClick={downloadCSV}>Download as CSV</button>
            )}

            {/* Chart */}
            {data.length > 0 && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="time" 
                            tickFormatter={(tickItem) => new Date(tickItem).toLocaleDateString()} // Format date on x-axis
                        />
                        <YAxis />
                        <Tooltip/> 
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        {/* Brush for zooming */}
                        <Brush dataKey="time" height={30} stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default TimeSeriesChart;
