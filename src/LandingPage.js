import React, { useState } from 'react';
import App from './App';
import './landing.css';

function LandingPage() {
  const [showApp, setShowApp] = useState(false);

  if (!showApp) {
    return (
      <div className="landing-page">
        <header className="landing-header">
          <div id="box" className="text-white font-bold text-lg bg-gray-800">
            <center>
              <h1>DocrySign</h1>
              <p class="small-text">Document crypto Sign</p>
            </center>
          </div>
        </header>
        <main className="landing-main">
          <p className="landing-subtitle" style={{ color: '#094790' }}>Sign any document using a web3 wallet extension such as Metamask</p>
          <div className="disclaimer-box">
            <p className="disclaimer-text" style={{ color: '#094790' }}>Disclaimer: This is a beta version of the website and we are not responsible for any crypto funds lost. There is no guarantee of the website's functioning. This is an amateur website.</p>
          </div>
          <div className="w-full h-6"> </div>
          <button onClick={() => setShowApp(true)} className="landing-cta btn btn-primary submit-button focus:ring focus:outline-none" style={{ backgroundColor: '#094790', color: 'white' }}>
            Launch Application
          </button>
        </main>
      </div>
    );
  }

  return <App />;
}

export default LandingPage;

