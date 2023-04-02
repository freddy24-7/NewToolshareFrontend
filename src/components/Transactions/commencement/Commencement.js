// This component is used to display the commencement page
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import { PARTICIPANT_URL } from '../../../backend-urls/constants';
import Card from '../../Card/Card';
import classes from './Commencement.module.css';
import useApiCalls from '../../../hooks/useApiCalls';
import laptopworker from '../../../assets/pexels-karolina-grabowska-6920104.jpg';

function Commencement() {
  // Custom hook to keep track of API calls
  const [apiCalls, incrementApiCalls] = useApiCalls();

  //Getting the id from the URL
  const { id } = useParams();
  console.log(id);

  //Custom hook to make API calls
  const { data, loading, error, get, token } = useAxios();

  //Here we are making the API call to get the participant
  useEffect(() => {
    if (id) {
      get(`${PARTICIPANT_URL}/${id}`, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
    incrementApiCalls();
    console.log('API calls: ', apiCalls);
    // Storing the id in local storage
    localStorage.setItem('id', id);
  }, [id]);
  console.log(token);
  //Here we are checking if the data is loading
  if (loading) {
    return <div>Loading...</div>;
  }

  //Here we are checking if there is an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  //Conditional render: if there is a photoURL, the photo is displayed
  //alternatively, a default photo is displayed
  if (data.photoURL) {
    return (
      <>
        <Card className={classes.base}>
          <div className={classes.control}>
            <p className={classes.success}>Ready to go {data.firstName}!</p>
            <br />
            <br />
            <p>Klik boven op een balk om te beginnen. </p>
          </div>
        </Card>
        <div className={classes.photo}>
          <img src={data.photoURL} height={600} width={580} />
        </div>
      </>
    );
  } else {
    return (
      <>
        <Card className={classes.base}>
          <div className={classes.control}>
            <p className={classes.success}>Ready to go {data.firstName}!</p>
            <br />
            <br />
            <p>Klik op een link om te beginnen. </p>
          </div>
        </Card>
        <div className={classes.photo}>
          <img src={laptopworker} alt="laptopworker" height={600} width={580} />
        </div>
      </>
    );
  }
}

export default Commencement;
