import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAxios(url, config = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(url, config);
                setData(response.data);
            } catch (error) {
                setError(error);
            }

            setLoading(false);
        };

        fetchData();
    }, [url, config]);

    return [data, loading, error];
}