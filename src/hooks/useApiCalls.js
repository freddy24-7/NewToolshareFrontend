import { useState } from 'react';

function useApiCalls() {
  //This variable manages the number of API calls
  const [apiCalls, setApiCalls] = useState(1);

  //This function increments the number of API calls
  function incrementApiCalls() {
    setApiCalls(apiCalls + 1);
  }

  return [apiCalls, incrementApiCalls];
}
export default useApiCalls;
