import React, { useState, useEffect } from 'react';
import { FiMic, FiSpeaker, FiVideo } from "react-icons/fi";

const DeviceSelection = ({
  videoRef,
  isCameraEnabled,
  isMicEnabled,
  isSoundEnabled,
  setIsCameraEnabled,
  setIsMicEnabled,
  setIsMicTestEnabled,
  setIsSoundEnabled,
  setIsSoundTesting,
  isMicTestEnabled,
  isSoundTesting,
  handleSoundConfirmation,
  startMicrophoneTest,
  stopMicrophoneTest,
  volume,
  handleNextClick,
  handleBackClick,
  allDevicesConfigured,
}) => {
  const [audioOutputDevices, setAudioOutputDevices] = useState([]);

  const handleMicTestConfirmation = () => {
    setIsMicTestEnabled(false);
    setIsMicEnabled(true);
    stopMicrophoneTest();
  };

  useEffect(() => {
    // Fetch available devices
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audioOutputs = devices.filter((device) => device.kind === "audiooutput");

      setAudioOutputDevices(audioOutputs);
    });
  }, []);

  const handleMicToggle = (e) => {
    if (e.target.checked) {
      startMicrophoneTest();
      setIsMicTestEnabled(true);
    } else {
      setIsMicEnabled(false);
      stopMicrophoneTest();
    }
  };

  const handleCameraToggle = () => {
    setIsCameraEnabled(!isCameraEnabled);
  };

  const handleSoundToggle = (e) => {
    setIsSoundEnabled(e.target.checked);
    if (e.target.checked) {
      setIsSoundTesting(true);
      playTestSound();
    } else {
      setIsSoundTesting(false);
      stopTestSound();
    }
  };

  const playTestSound = () => {
    if (videoRef.current) {
      console.log("Playing sound");
      videoRef.current.src = "/sounds/audio.mp3";
      videoRef.current.play().then(() => {
        console.log("Sound started successfully");
      }).catch((error) => {
        console.error("Error playing sound: ", error);
      });
    }
  };

  const stopTestSound = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="md:h-[calc(100vh)] h-[140vh] bg-primary-foreground flex items-center md:justify-center justify-top w-full border-[#eeeeee] ">
    <div className="max-w-[1200px] gap-4 w-full flex flex-col  items-center md:flex-row md:justify-between">
      <div className="max-w-[450px] w-[90vw] md:mt-[8vh] md:w-[50vw] flex flex-col items-center justify-end bg-primary shadow-lg mt-[16vh] h-[62vh] md:h-auto ml-[5vw] mr-[5vw] md:m-10 text-white rounded-3xl p-10 relative ">
        <video ref={videoRef} autoPlay className="w-full bg-black rounded-lg h-[19vh] md:h-[22vh] mb-2"></video>
        <div className="flex justify-between w-full text-sm mb-32">
          <span className="flex items-center">
            <FiMic className="w-5 h-5 mr-1" />
            Default - External Mic
          </span>
          <span className="flex items-center">
            <FiSpeaker className="w-5 h-5 mr-1" />
            Default - External Speaker
          </span>
          <span className="flex items-center">
            <FiVideo className="w-5 h-5 mr-1" />
            Default - Web Cam
          </span>
        </div>
        <p className="text-center text-lg font-bold leading-relaxed">
          Take the wiZe AI mock Interview
        </p>
        <p className="text-center text-sm mt-2 leading-relaxed">
          You&apos;ll be taking a 20-minute interview to have your skills evaluated. Just relax and take the interview. <span className="font-semibold"> All the best!</span>
        </p>
      </div>

      {/* Right Section */}
      <div className="w-full  md:max-w-[500px] max-h-[89vh] scrollbar-hide overflow-hidden lg:max-w-[700px] overflow-x-hidden flex flex-col items-center justify-center bg-primary-foreground p-10 md:mr-8 lg:mr-0">
        <div>
          <p className="text-2xl font-bold text-primary mb-2">Get Started!</p>
        </div>
        <div className="flex mx-auto items-center max-w-[450px] justify-center mb-2 w-full">
          {/* Progress Bar */}
          <div className="relative flex-1">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out bg-primary w-full z-0`}></div>
          </div>
          {/* Step 2 */}
          <div className="relative flex-1">
              <div
                className={`w-8 h-8 bg-primary rounded-full flex items-center justify-center`}
              >
                
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                
              </div>
              <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out bg-primary w-full z-0`}></div>
            </div>
          {/* Step 3 */}
          <div className="relative">
            <div className={`w-8 h-8 ${allDevicesConfigured ? "bg-primary" : "bg-gray-400"} rounded-full flex items-center justify-center`}>
              {allDevicesConfigured ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center text-center mt-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Ready to join? Configure Devices</h2>
        </div>
        <div className="bg-white py-4 px-8 rounded-3xl w-full max-w-[400px] shadow-lg text-center max-h-[280px]">
          {!isMicTestEnabled && !isSoundTesting && (
            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-full max-w-md flex-col flex gap-2 justify-evenly">
                <div className="flex items-center justify-between pt-6 pb-6 pr-8 pl-8 border-dashed border-2 border-gray-400 rounded-2xl">
                  <span className="flex items-center gap-2">
                    <FiVideo className="h-6 w-6" />
                    Enable Camera
                  </span>
                  <input
                    type="checkbox"
                    className="form-checkbox h-6 w-6 text-purple-600"
                    checked={isCameraEnabled}
                    onChange={handleCameraToggle}
                  />
                </div>
                <div className="flex items-center justify-between pt-6 pb-6 pr-8 pl-8 border-dashed border-2 border-gray-400 rounded-2xl">
                  <span className="flex items-center gap-2">
                    <FiMic className="h-6 w-6" />
                    Enable Microphone
                  </span>
                  <input
                    type="checkbox"
                    className="form-checkbox h-6 w-6 text-purple-600"
                    checked={isMicEnabled}
                    onChange={handleMicToggle}
                  />
                </div>
                <div className="flex items-center justify-between pt-6 pb-6 pr-8 pl-8 border-dashed border-2 border-gray-400 rounded-2xl">
                  <span className="flex items-center gap-2">
                    <FiSpeaker className="h-6 w-6" />
                    Enable Speaker
                  </span>
                  <input
                    type="checkbox"
                    className="form-checkbox h-6 w-6 text-purple-600"
                    checked={isSoundEnabled}
                    onChange={handleSoundToggle}
                  />
                </div>
              </div>
            </div>
          )}

          {isMicTestEnabled && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-full px-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Test your microphone</h2>
                <div className="text-center mb-4">
                  <p className="text-gray-600">You&apos;re audible</p>
                </div>

                {/* Volume Indicator */}
                <div className="w-full flex flex-col items-center mb-4">
                  <div className="w-full bg-gray-300 rounded-full h-4">
                    <div
                      style={{ width: `${volume}%` }}
                      className={`h-full rounded-full transition-all duration-200 ${volume >= 20 ? "bg-purple-600" : "bg-red-600"}`}
                    />
                  </div>
                  <p className={`text-gray-600 mt-2 ${volume < 20 ? "text-red-600" : ""}`}>
                    Microphone volume level: {Math.round(volume)}
                    {volume < 20 ? " (Too low)" : ""}
                  </p>
                </div>

                <p className="text-lg font-semibold text-gray-500 underline cursor-pointer mb-4">Facing issues? Report here.</p>
                <button
                  className={`font-bold py-4 px-4 rounded-xl transition w-64 ${volume >= 20 ? "bg-primary text-white hover:bg-purple-600 focus:ring-4 focus:ring-primary-foreground" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                  onClick={handleMicTestConfirmation}
                  disabled={volume < 20} // Disable button if volume is less than 20%
                >
                  My mic is working
                </button>
              </div>
            </div>
          )}

          {isSoundTesting && (
            <div className="w-full h-[95%] flex flex-col items-center justify-center rounder-2xl">
              <div className="w-full px-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Test your speakers</h2>
                <div className="text-center mb-4">
                  <p className="text-gray-600">WizeAI is speaking</p>
                </div>
                <audio ref={videoRef} className="hidden" autoPlay></audio>
                <div className="relative mb-4">
                  <select className="block w-full pl-3 pr-10 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-3xl border-2 py-4">
                    {audioOutputDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Speaker ${device.deviceId}`}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-lg font-semibold text-gray-500 underline cursor-pointer mb-4">Facing issues? Report here.</p>
                <button
                  className="bg-primary text-white font-bold py-4 px-4 rounded-xl hover:bg-purple-600 focus:ring-4 focus:ring-primary-foreground transition w-64"
                  onClick={handleSoundConfirmation}
                >
                  I can hear the sound
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 w-full px-4 flex flex-col items-center">
          <button
           
              className={`w-[40vw]  xl:w-[32vw] md:max-w-[700px] h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${
              allDevicesConfigured ? 'bg-gray-600 text-black hover:bg-gray-800' : 'bg-gray-300 text-gray-800 cursor-not-allowed'}`}

            disabled={!allDevicesConfigured}
            onClick={handleNextClick}
          >
            Next
          </button>
          <button
            className="bg-transparent text-gray-700 w-full font-semibold py-3 mt-2 rounded-lg hover:text-gray-900 focus:ring-4 focus:ring-gray-200 transition"
            onClick={handleBackClick}
          >
            Back
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DeviceSelection;
