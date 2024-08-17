import React, { useState } from 'react';

const TextToSpeech: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    const handleSpeak = () => {
        if (!text) return;

        const utterance = new SpeechSynthesisUtterance(text);
        setIsSpeaking(true);

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <div>
            <h2>Text to Speech</h2>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text here"
            />
            <br />
            <button onClick={handleSpeak} disabled={isSpeaking}>
                {isSpeaking ? 'Speaking...' : 'Speak'}
            </button>
            <button onClick={handleStop} disabled={!isSpeaking}>
                Stop
            </button>
        </div>
    );
};

export default TextToSpeech;
