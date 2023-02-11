import React, { useState } from 'react';
import App from './App';
import './landing.css';

function LandingPage() {
  const [showApp, setShowApp] = useState(false);

  return (
    <div style={{ textAlign: 'center' }}>
      {!showApp && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="brand.png" alt="DocrySign" width="280" style={{ margin: '0 auto' }} />
          </div>
          <div className="w-full h-6"> </div>
          <h1>Welcome to DocrySign</h1>
          <div className="w-full h-3"> </div>
          <p>Sign any document using a web3 extension wallet such as Metamask</p>
          <div className="w-full h-3"> </div>
          <button onClick={() => setShowApp(true)} className="btn btn-primary submit-button focus:ring focus:outline-none" >
            Launch Application
          </button>
        </>
      )}
      {showApp && <App />}
    </div>
  );
}


export default LandingPage;
