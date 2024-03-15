import React from 'react'
import CardItem from './CardItem';
import './Cards.css';
import coolBackgroundImage from "../images/cool_background_57.jpg";

function Cards() {
  return (
    <div className='cards'>
      <h1>Check out these Debates!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
            <ul className='cards__items'>
                <CardItem 
                src={coolBackgroundImage}
                text="Debate lmao"
                label="wow a debate"
                path="/debates"/>
                <CardItem 
                src={coolBackgroundImage}
                text="Debate lmao 2"
                label="wow 2"
                path="/debates"/>
                <CardItem 
                src={coolBackgroundImage}
                text="Debate lmao 3"
                label="wow 3"
                path="/debates"/>
            </ul>
        </div>
      </div>
    </div>
  )
}

export default Cards;
