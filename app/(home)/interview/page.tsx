"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";

function InitialView({ onStartInterview }) {
  return (
    <div className="min-h-screen flex flex-col bg-purple-50 p-6">
      <div className="flex flex-col items-left mt-4 flex-shrink-0">
        <h1 className="text-4xl font-bold mb-4 text-left">Take the wiZe AI mock Interview</h1>
        <p className="text-gray-600 text-2xl text-left">
          You'll be taking a 20-minute interview to have your skills evaluated. Just relax and take the
          <br />
          interview. All the best!
        </p>
      </div>

      <div className="flex-grow flex flex-col md:flex-row justify-center items-center gap-12 mt-6 w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-md w-full md:w-1/2 lg:w-1/3 h-96">
          <div className="flex flex-col items-center mb-4">
            <svg className="w-12 h-12 mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-4.418 2.686-8 6-8s6 3.582 6 8a6 6 0 11-12 0zM6 22a6 6 0 1112 0H6z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700">Get Started</h2>
          </div>
          <p className="text-center text-lg text-gray-600 mb-4">
            Upload your latest resume for a more personalized discussion.
          </p>
          <Button variant="outline" className="mb-4">Upload Resume</Button>
          <PasteManuallyButton label="Paste your resume details manually" isFileUpload={true} />
        </div>

        <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-md w-full md:w-1/2 lg:w-2/3 h-96">
          <div className="flex flex-col items-center mb-4">
            <svg className="w-12 h-12 mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v-2a4 4 0 014-4h2a4 4 0 014 4v2m4 0h.01M16 12h.01M8 12h.01M12 12h.01M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2m16 0H4" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700">Interview Profile details</h2>
          </div>
          <p className="text-center text-lg text-gray-600 mb-4">
            Mention details about the company profile and job description so we can interview you better.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center w-full mb-4">
            <Button variant="outline" className="mb-4 md:mr-4">Upload Job Description</Button>
            <span className="text-lg text-gray-600 mx-2">or</span>
            <Button variant="outline" className="mb-4 md:ml-4">Choose Domain</Button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-11">
            <PasteManuallyButton label="Paste your job description manually" />
            <PasteManuallyButton label="Paste your domain details manually" />
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 mb-4 w-full max-w-6xl mx-auto">
        <button className="text-lg text-gray-600 mr-4">Back</button>
        <button onClick={onStartInterview} className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700">Start Interview</button>
      </div>

      <div className="flex justify-center items-center mt-4 mb-4 w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center text-gray-600 w-full gap-8">
          <div className="flex flex-col items-center w-1/3">
            <div className="w-full h-2 bg-gray-300 rounded-full mb-2"></div>
            <span className="text-lg font-semibold text-center">Upload Resume and Profile information</span>
            <span className="text-lg text-center">2 mins</span>
          </div>
          <div className="flex flex-col items-center w-1/3">
            <div className="w-full h-2 bg-gray-300 rounded-full mb-2"></div>
            <span className="text-lg font-semibold text-center">Interview</span>
            <span className="text-lg text-center">20 mins</span>
          </div>
          <div className="flex flex-col items-center w-1/3">
            <div className="w-full h-2 bg-gray-300 rounded-full mb-2"></div>
            <span className="text-lg font-semibold text-center">Detailed Analysis & report</span>
            <span className="text-lg text-center">10 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasteManuallyButton({ label, isFileUpload }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Paste manually</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            {isFileUpload
              ? "Upload your resume file from local storage."
              : "Provide the necessary information."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          {isFileUpload ? (
            <>
              <Label htmlFor="resumeFile">Upload your resume</Label>
              <Input id="resumeFile" type="file" accept=".pdf,.doc,.docx" />
            </>
          ) : (
            <>
              <Label htmlFor="manualInput">Enter your details</Label>
              <Input id="manualInput" placeholder="Type your details here..." />
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



function InterviewView() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(false);
  const [speakerTestActive, setSpeakerTestActive] = useState(false);
  const [speakerTestCompleted, setSpeakerTestCompleted] = useState(false);
  const [microphoneTestActive, setMicrophoneTestActive] = useState(false);
  const [microphoneTestCompleted, setMicrophoneTestCompleted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const videoRef = useRef(null);
  const audioRef = useRef(new Audio("app/(home)/interview/audio.mp3")); // Ensure the correct path to the sound file
  const [soundEnded, setSoundEnded] = useState(false);

  useEffect(() => {
    let audioContext;
    let analyzer;
    let microphone;
    let javascriptNode;

    if (microphoneTestActive) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          analyzer = audioContext.createAnalyser();
          microphone = audioContext.createMediaStreamSource(stream);
          javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

          analyzer.smoothingTimeConstant = 0.8;
          analyzer.fftSize = 1024;

          microphone.connect(analyzer);
          analyzer.connect(javascriptNode);
          javascriptNode.connect(audioContext.destination);

          javascriptNode.onaudioprocess = () => {
            const array = new Uint8Array(analyzer.frequencyBinCount);
            analyzer.getByteFrequencyData(array);
            const average = array.reduce((a, b) => a + b, 0) / array.length;
            setAudioLevel(average);
          };
        })
        .catch(error => {
          console.error("Error accessing microphone:", error);
        });
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
      if (microphone && microphone.mediaStream) {
        microphone.mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [microphoneTestActive]);

  const handleSpeakerTest = () => {
    setSpeakerTestActive(true);
    setSoundEnded(false);

    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Error playing the sound:", error);
      });

      audioRef.current.onended = () => {
        setSoundEnded(true);
      };

      audioRef.current.onerror = (error) => {
        console.error("Error during sound playback:", error);
      };
    }
  };

  const handleSpeakerTestComplete = () => {
    setSpeakerTestCompleted(true);
    setSpeakerTestActive(false);
    setSpeakerEnabled(true); // This restores the checkbox and ticks it
  };

  const handleMicrophoneTest = () => {
    setMicrophoneTestActive(true);
  };

  const handleMicrophoneTestComplete = () => {
    setMicrophoneTestCompleted(true);
    setMicrophoneTestActive(false);
    setMicrophoneEnabled(true); // This restores the checkbox and ticks it
  };

  const handleCameraToggle = () => {
    if (!cameraEnabled) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
          setCameraEnabled(true);
        })
        .catch(error => {
          console.error("Error accessing camera:", error);
        });
    } else {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraEnabled(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-purple-50 p-6">
      <div className="flex flex-col items-left mt-4 ml-11 flex-shrink-0">
        <h1 className="text-4xl font-bold mb-4 text-left">Take the wiZe AI mock Interview</h1>
        <p className="text-gray-600 text-2xl text-left">
          You'll be taking a 20-minute interview to have your skills evaluated. Just relax and take the
          <br />
          interview. All the best!
        </p>
      </div>
      <div className="flex-grow flex flex-col md:flex-row justify-center items-center gap-12 w-full max-w-8xl ">
        <div className="flex flex-col items-center bg-black rounded-2xl w-full md:w-[60%] lg:w-[60%] h-[32rem] relative">
          {/* Video element to display camera feed */}
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full object-cover rounded-2xl"
            style={{ display: cameraEnabled ? 'block' : 'none' }}
          />
        </div>

        {speakerTestActive ? (
          // Speaker test UI as per the provided design
          <div className="flex flex-col items-center w-full md:w-[30%] lg:w-[30%] h-auto bg-purple-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How do we sound?</h2>
            <p className="text-lg text-gray-600 mb-2">
              Make sure your speakers are connected properly.
            </p>
            <div className="flex flex-col items-center mb-4">
              <img src="path_to_your_image" alt="wiZe AI" className="w-24 h-24 mb-2" />
              <p className="text-sm text-gray-600">wiZe AI is speaking</p>
            </div>
            <div className="flex items-center p-4 border border-gray-300 rounded-lg w-full mb-4">
              <span className="text-lg text-gray-800">🔊 Default - External Speaker</span>
              <span className="ml-auto">▼</span>
            </div>
            {soundEnded ? (
              <>
                <button
                  className="bg-purple-600 text-white text-xl px-6 py-4 rounded-xl hover:bg-purple-700 w-full"
                  onClick={handleSpeakerTestComplete}
                >
                  I can hear wiZe AI
                </button>
                <button
                  className="bg-gray-300 text-gray-800 text-xl px-6 py-4 rounded-xl hover:bg-gray-400 w-full mt-4"
                  onClick={handleSpeakerTest}
                >
                  Play Sound Again
                </button>
              </>
            ) : (
              <p className="text-lg text-gray-600">Playing sound...</p>
            )}
            <a href="#" className="text-purple-600 text-md mt-4">Facing issues? Report here.</a>
          </div>
        ) : microphoneTestActive ? (
          // Microphone test UI with actual microphone input
          <div className="flex flex-col items-center w-full md:w-[30%] lg:w-[30%] h-auto bg-purple-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test your microphone</h2>
            <p className="text-lg text-gray-600 mb-2">
              Say ‘Hello wiZe, I’m excited for the Interview!’ Make sure we can hear you properly.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div className="bg-purple-600 h-4 rounded-full" style={{ width: `${Math.min(100, audioLevel)}%` }}></div>
            </div>
            <p className="text-sm text-gray-700 mb-4">You’re audible</p>
            <div className="flex items-center mb-4 p-4 border border-gray-300 rounded-lg w-full">
              <span className="text-lg text-gray-800">🎙️ Default - External Microphone</span>
              <span className="ml-auto">▼</span>
            </div>
            <button
              className="bg-purple-600 text-white text-xl px-6 py-4 rounded-xl hover:bg-purple-700 w-full"
              onClick={handleMicrophoneTestComplete}
            >
              My mic is working
            </button>
            <a href="#" className="text-purple-600 text-md mt-4">Facing issues? Report here.</a>
          </div>
        ) : (
          <div className="flex flex-col items-start w-full md:w-[30%] lg:w-[30%] h-[32rem] ml-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2 flex-1">Ready to join?</h2>
            <p className="text-xl text-gray-600 mb-6 flex-1">Ensure your devices are properly configured.</p>

            <div className="flex items-center mb-4 p-4 border border-gray-800 rounded-lg w-full flex-1">
              <div className="flex items-center">
                <div className="bg-black w-8 h-8 mr-4"></div>
                <span className="text-xl font-medium text-gray-800">Enable Camera</span>
              </div>
              <input
                type="checkbox"
                className="ml-auto w-6 h-6"
                checked={cameraEnabled}
                onChange={handleCameraToggle}
              />
            </div>

            <div className="flex items-center mb-4 p-4 border border-gray-800 rounded-lg w-full flex-1">
              <div className="flex items-center">
                <div className="bg-black w-8 h-8 mr-4"></div>
                <span className="text-xl font-medium text-gray-800">Enable Microphone</span>
              </div>
              <input
                type="checkbox"
                className="ml-auto w-6 h-6"
                checked={microphoneEnabled || microphoneTestCompleted}
                onChange={() => {
                  if (!microphoneTestCompleted) {
                    setMicrophoneEnabled(!microphoneEnabled);
                    handleMicrophoneTest();
                  }
                }}
              />
            </div>

            <div className="flex items-center mb-6 p-4 border border-gray-800 rounded-lg w-full flex-1">
              <div className="flex items-center">
                <div className="bg-black w-8 h-8 mr-4"></div>
                <span className="text-xl font-medium text-gray-800">Enable Speaker</span>
              </div>
              <input
                type="checkbox"
                className="ml-auto w-6 h-6"
                checked={speakerEnabled || speakerTestCompleted}
                onChange={() => {
                  if (!speakerTestCompleted) {
                    setSpeakerEnabled(!speakerEnabled);
                    handleSpeakerTest();
                  }
                }}
              />
            </div>

            <button className="bg-gray-400 text-white text-2xl px-6 py-4 rounded-xl hover:bg-gray-600 w-full flex-1">Join Now</button>
          </div>
        )}
      </div>

      {/* Device Selection Area Below the Black Container */}
      <div className="flex justify-around items-center w-[70%] p-4 bg-purple-50 rounded-t-xl -ml-11">
        <div className="flex items-center text-gray-700">
          <span className="material-icons">mic</span>
          <span className="ml-2">Default - External Mic</span>
        </div>
        <div className="flex items-center text-gray-700">
          <span className="material-icons">volume_up</span>
          <span className="ml-2">Default - External Speaker</span>
        </div>
        <div className="flex items-center text-gray-700">
          <span className="material-icons">videocam</span>
          <span className="ml-2">Default - External Web Cam</span>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 mb-4 w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center text-gray-600 w-full gap-8">
          <div className="flex flex-col items-center w-1/3">
            <div className="w-full h-2 bg-purple-600 rounded-full mb-2"></div>
            <span className="text-lg font-semibold text-center">Upload Resume and Profile information</span>
            <span className="text-lg text-center">2 mins</span>
          </div>
          <div className="flex flex-col items-center w-1/3">
            <div className="w-full h-2 bg-gray-300 rounded-full mb-2"></div>
            <span className="text-lg font-semibold text-center">Interview</span>
            <span className="text-lg text-center">20 mins</span>
          </div>
          <div className="flex flex-col items-center w-1/3">
            <div className="w-full h-2 bg-gray-300 rounded-full mb-2"></div>
            <span className="text-lg font-semibold text-center">Detailed Analysis & report</span>
            <span className="text-lg text-center">10 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExamplePage() {
  const [view, setView] = useState('initial');

  return view === 'initial' ? <InitialView onStartInterview={() => setView('interview')} /> : <InterviewView />;
}
