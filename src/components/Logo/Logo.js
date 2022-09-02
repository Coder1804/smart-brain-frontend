import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './mental-health.png';

const Logo = ()=>{
    return (
       <div className='ma4 mt0 '>
            <Tilt className='Tilt br2 shadow-2 '
                  tiltMaxAngleX={25} 
                  tiltMaxAngleY={25}
                  gyroscope={true}  >
                 <div className='pa3' style={{ height: '150px', width:'150px'}}>
                    <img src={brain} alt='logo'/>
                 </div>
            </Tilt>
       </div>  
        );
}

export default Logo;