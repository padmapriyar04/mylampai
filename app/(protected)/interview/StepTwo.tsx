import React, { useState } from 'react';
import Image from 'next/image';

interface StepTwoProps {
  JD: string;
  isResumeUploaded: boolean;
  jobDescriptionFile: boolean;
  isManualEntry: boolean;
  manualJobDescription: string;
  selectedJobProfile: string;
  jobProfiles: string[];
  setJD: (description: string) => void;
  handleManualJDUpload: () => void;
  handleNextClick: () => void;
  handleBackClick: () => void;
  setSelectedJobProfile: (profile: string) => void;
  setManualJobDescription: (description: string) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({
  JD,
  isResumeUploaded,
  jobDescriptionFile,
  isManualEntry,
  manualJobDescription,
  selectedJobProfile,
  jobProfiles,
  handleManualJDUpload,
  handleNextClick,
  handleBackClick,
  setSelectedJobProfile,
  setManualJobDescription,
  setJD,

}) => {
  const [showTextbox, setShowTextbox] = useState(false);
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const handleProfileChange = (profile: string) => {
    setSelectedJobProfile(profile);
    setShowTextbox(profile === 'Other');
    setIsNextEnabled(profile !== '');
  
    // Set JD when profile is selected, except for "Other"
    if (profile !== 'Other' && profile.trim() !== '') {
      setJD(profile); // Ensure JD is set when a profile is selected
    }
  };

  const handleManualDescriptionChange = (description: string) => {
    setManualJobDescription(description);
    setIsNextEnabled(description.trim().length > 0); // Enable "Next" when description is not empty
  };

  return (
    <div className="max-w-[1200px] gap-4 w-full flex flex-col items-center md:flex-row md:justify-between">
      {/* Left Section */}
      <div className="max-w-[450px] w-[90vw] md:mt-[8vh] md:w-[50vw] flex flex-col items-center justify-end bg-primary shadow-lg mt-[16vh] h-[62vh] md:h-auto ml-[5vw] mr-[5vw] md:m-10 text-white rounded-3xl p-10 relative">
        <Image
          src="/images/Globe.svg"
          className="w-full h-auto"
          alt="image"
          width={100}
          height={100}
        />
        <div className="relative flex flex-col items-center mt-auto">
          <h2 className="text-xl font-bold text-center leading-snug">
            Take the wiZe AI mock Interview
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed">
            You'll be taking a 20-minute interview to have your skills evaluated. Just relax and take the interview.{' '}
            <span className="font-semibold">All the best!</span>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:max-w-[500px] max-h-[89vh] scrollbar-hide overflow-hidden lg:max-w-[700px] overflow-x-hidden flex flex-col items-center justify-center bg-primary-foreground p-10 md:mr-8 lg:mr-0">
        <div className="w-full flex flex-col items-center mb-2">
          <div>
            <p className="text-2xl font-bold text-primary mb-2">Get Started!</p>
          </div>
          <div className="flex mx-auto items-center max-w-[450px] justify-center mb-2 w-full">
            {/* Progress Bar */}
            <div className="relative flex-1">
              <div className={`w-8 h-8 ${isResumeUploaded ? 'bg-purple-500' : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                {isResumeUploaded ? (
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
                ) : (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
              <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${isResumeUploaded ? 'bg-primary w-full' : 'bg-gray-400 w-full'} z-0`}></div>
            </div>
            {/* Step 2 */}
            <div className="relative flex-1">
              <div
                className={`w-8 h-8 ${jobDescriptionFile || isManualEntry ? 'bg-primary' : 'bg-gray-400'} rounded-full flex items-center justify-center`}
              >
                {jobDescriptionFile || isManualEntry ? (
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
                ) : (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
              <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${jobDescriptionFile || isManualEntry ? 'bg-primary w-full' : 'bg-gray-400 w-full'} z-0`}></div>
            </div>
            {/* Step 3 */}
            <div className="relative flex items-center">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-sm xl:text-2xl mb-6 font-bold text-gray-800">
          Choose your Interview Profile
        </h3>

        {/* Job Profile Section */}
        <div className="bg-white py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px] lg:max-h-[280px] shadow-lg text-center flex flex-col items-center">
          <select
            id="jobProfileDropdown"
            className="w-full p-4 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedJobProfile}
            onChange={(e) => handleProfileChange(e.target.value)}
          >
            <option value="" disabled={!!selectedJobProfile}>
              Select a profile
            </option>
            {jobProfiles.map((profile) => (
              <option key={profile} value={profile}>
                {profile}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

          {/* Textbox appears only when "Other" is selected */}
          {showTextbox && (
            <div className="w-full p-4 bg-white rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center lg:max-h-[180px]">
              <textarea
                className="w-full h-28 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-center placeholder:text-gray-500 text-sm"
                placeholder="Write or paste here complete job details (Word limit 1000 words)"
                maxLength={1000}
                value={manualJobDescription}
                onChange={(e) => handleManualDescriptionChange(e.target.value)}
              />
              <p className="text-gray-400 text-xs mt-2">Word limit 1000 words.</p>
              <div className="w-full text-center mt-4">
                <button
                  onClick={handleManualJDUpload}
                  className="bg-purple-500 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-purple-600 focus:outline-none"
                >
                  Submit JD
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 w-full px-4 flex flex-col items-center">
          <button
            className={`w-[40vw] max-w-[700px] h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${
              isNextEnabled ? 'bg-gray-600 hover:bg-gray-800 text-white' : 'bg-gray-300 text-gray-800 cursor-not-allowed'
            }`}
            disabled={!isNextEnabled}
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
  );
};

export default StepTwo;
