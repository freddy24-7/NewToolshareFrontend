import classes from './HomePage.module.css';
import workman from '../../assets/pexels-photo-1453499.jpeg'
import mapFragment from '../../assets/areamap.png'

const HomePage = () => {
    return (
        <>
            <section className={classes.starting}>
                <h1 className="starting h1">Spullen lenen op fietsafstand & geld sparen </h1>
                <h3>Een milieuvriendelijk initiatief om nuttige dingen met elkaar te delen in Utrecht Terwijde (postcode 3543)</h3>
             </section>
            <section className={classes.mapDetails}>
                <img src={mapFragment} alt="mapfragment" height={300} width={400}/>
            </section>
            <div className={classes.photo}>
                <img src={workman} alt="workman" height={500} width={500}/>
            </div>
        </>
    );
};

export default HomePage;