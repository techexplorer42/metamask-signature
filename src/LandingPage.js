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
            <p className="disclaimer-text" style={{ color: '#094790' }}>
            <b> Disclaimer: </b> This website is currently in beta testing and may contain errors or inaccuracies. We do not guarantee the accuracy, completeness, or suitability of the information provided on this website, and we accept no liability for any loss or damage arising from the use of this website or its contents. 
            <br/>
            We also cannot guarantee the functionality of the website, as it is still in development and may experience technical issues or downtime.
            <br/>
            Please be aware that this website is intended for informational purposes only and is not intended to provide legal, financial, or investment advice. Any decisions made based on the information provided on this website are made at your own risk.
            <br/>
            Additionally, we are not responsible for any loss of funds or other damages that may result from your use of this website or its contents.
            <br/>
            Finally, please note that this website is not a professional or licensed service, and is not intended to replace the advice of a qualified professional.
            </p>
          </div>
          <div className="w-full h-6"> </div>
          <button onClick={() => setShowApp(true)} className="landing-cta btn btn-primary submit-button focus:ring focus:outline-none" style={{ backgroundColor: '#094790', color: 'white' }}>
            Launch Application
          </button>
        </main>
          <div className="w-full h-16"> </div>
            <div className="w-full items-center h-16 bg-gray-800 text-white">
              <center>
                <p className="text-white font-bold">
                  Contact us on Twitter at <a href="https://twitter.com/docrysign" target="_blank" rel="noopener noreferrer">@docrysign</a>
                </p>
                <p>&copy; 2023 DocrySign </p>
              </center>
            </div>
      </div>
    );
  }

  return <App />;
}

export default LandingPage;

