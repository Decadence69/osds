import React, { useState, useEffect } from 'react';
import '../../App.css';
import Cards from '../Cards';

function Debates() {

  return (
    <>
      <div className="debates">
        <Cards />
        <button /*onClick={}*/>Create Debate</button>
      </div>
    </>
  );
}

export default Debates;
