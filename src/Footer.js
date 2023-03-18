import React from 'react';

export default function Footer() {
  return (
      <div className="w-full items-center bg-gray-800 text-white fixed bottom-0 mt-24">
        <center>
          <p className="text-white font-bold">
            Contact us on Twitter at <a href="https://twitter.com/docrysign" target="_blank" rel="noopener noreferrer">@docrysign</a>
          </p>
          <p className="text-red-100 font-bold">
            <u>
            <a  className="text-red-100 !important" href="https://gizeam.com/?name=DocrySign&addr=0x1155418c315169da7e947c1d830e669f6b1f2f3e" target="_blank" rel="noopener noreferrer">Donate</a>
            </u>
          </p>
          <p>&copy; 2023 DocrySign </p>
        </center>
      </div>
  );
}
