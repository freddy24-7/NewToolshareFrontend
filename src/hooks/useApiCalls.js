import { useState } from 'react';

function useApiCalls() {
  const [apiCalls, setApiCalls] = useState(0);

  function incrementApiCalls() {
    setApiCalls(apiCalls + 1);
  }

  return [apiCalls, incrementApiCalls];
}
export default useApiCalls;
