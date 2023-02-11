import { useEffect, useState, useRef } from "react";

export default function LogArea() {
  const [logValue, setLogValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
  }, [logValue]);

  const clearLog = async () => {
    setLogValue("");
  };

  const updateLogValue = (newValue) => {
    setLogValue(newValue);
  };

  return (
    <div>
      <div>
        <center>
          <label> Log </label>
        </center>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-10/12">
          <textarea
            id="logarea"
            ref={textareaRef}
            className="w-full border h-24"
            value={logValue}
            onChange={(event) => {
              updateLogValue(event.target.value);
            }}
          ></textarea>
        </div>
        <div className="w-full lg:w-2/12 flex bottom justify-center items-center bottom">
          <button
            id="clearlog"
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full w-64 h-24"
            onClick={clearLog}
          >
            Clear Log
          </button>
        </div>
      </div>
    </div>
  );
}

