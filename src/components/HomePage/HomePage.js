import classes from './HomePage.module.css';
import workman from '../../assets/pexels-photo-1453499.jpeg'

const HomePage = () => {
    return (
        <section className={classes.starting}>
            <h1>Spullen lenen - geld sparen</h1>
            <img src={workman} alt="workman" height={600} width={600}/>
        </section>
    );
};

export default HomePage;