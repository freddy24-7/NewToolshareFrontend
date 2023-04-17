//This file is used to get all the items from the backend
import { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { GET_ALL_SHARE_ITEM_URL } from '../backend-urls/constants';
const AllItems = () => {
  const [allItems, setAllItems] = useState([]);

  const { data, loading, error, get, token } = useAxios();

  useEffect(() => {
    get(GET_ALL_SHARE_ITEM_URL, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }, []);

  useEffect(() => {
    if (data) {
      setAllItems(data);
    }
  }, [data, error]);
  console.log(allItems);

  return {
    data,
    loading,
    error,
  };
};

export default AllItems;
