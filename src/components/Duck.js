
import React from 'react';
import './Duck.css'; 

const Duck = ({ duck, hitDuck }) => {
    const style = {
      top: `${duck.startPosition}%`,
    };
  
    return (
      <div
        className={`duck ${duck.hit ? 'hit' : ''}`} 
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          hitDuck(duck.id);
        }}
      ></div>
    );
  };
  
export default Duck;



