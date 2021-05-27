import { Component } from 'react';
import {Link} from 'react-router-dom'
import '../styles/Home.css'
import Cloud from '../resources/cloud.png'

class Home extends Component {
    render() {
        return(
            <div style = {{height: '100%', width: '100%'}}>
                <div className = 'headerDivStyle'>
                    <p className = 'headerStyle'>CLOUD SERVICE OPTIMIZER</p>
                    <img src = { Cloud } alt = "Error" className = 'logoStyle'/>
                </div>
                <div className = 'linkDivStyle'>
                    <Link className = 'linkStyle' to = "/about-us">About Us</Link>
                    <Link className = 'linkStyle' to = "/contact-us">Contact Us</Link>
                    <Link class = 'linkStyle' to = "/dashboard">Dashboard</Link>
                </div>
            </div>
        )};
    }

export default Home;
