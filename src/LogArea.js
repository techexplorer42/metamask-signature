import { useEffect, useState, useRef } from "react";

export function Logout(msg) {
    const logarea = document.getElementById("logarea");
    logarea.value += msg;
}

export default function LogArea() {
  const [logValue, setLogValue] = useState("");
  const textareaRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const hiddenClass = isVisible ? '' : 'hidden';

  useEffect(() => {
    textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
  }, [logValue]);

  const updateLogValue = (newValue) => {
    setLogValue(newValue);
  };

  return (
   <div>
      <div className="flex justify-center">
        <button
          onClick={toggleVisibility}
          className="btn btn-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Show Log
        </button>
      </div>
      <div className={`log-container ${hiddenClass}`}>
        {
        /* ... The rest of your log container */
        <div>
          <div>
            <center>
              <label> Log </label>
            </center>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full">
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
          </div>
        </div>
        }
      </div>
    </div>
  );
}

