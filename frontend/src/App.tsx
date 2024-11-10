import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import TranscriptionArea from './components/TranscriptionArea';
import { Box } from '@mui/material';

const App: React.FC = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState<string>('');

  const handleRecordingComplete = (blob: Blob) => setAudioBlob(blob);
  const handleReset = () => {
    setAudioBlob(null);
    setTranscription('');
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={4} sx={{ height: "100vh", padding: "20px" }}>
      <Box display="flex" justifyContent="space-around" alignItems="center" gap={3} width="100%">
        <AudioRecorder 
          onRecordingComplete={handleRecordingComplete} 
          onReset={handleReset}
          shouldReset={!audioBlob} 
        />
        <Box>
        {audioBlob && (
          <TranscriptionArea
            audioBlob={audioBlob}
            onReset={handleReset}
            setTranscription={setTranscription}
            transcription={transcription}
          />
        )}
        </Box>
      </Box>
    </Box>
  );
};

export default App;
