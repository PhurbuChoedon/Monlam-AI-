import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

type AudioRecorderProps = {
  onRecordingComplete: (audioBlob: Blob) => void;
  onReset: () => void;
  shouldReset: boolean;
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecordingComplete, 
  onReset,
  shouldReset 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (shouldReset) {
      setAudioBlob(null);
      setAudioUrl(null);
    }
  }, [shouldReset]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event: BlobEvent) => {
        const blob = event.data;
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        onRecordingComplete(blob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  const handleReset = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    onReset();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Button
        variant="contained"
        onClick={isRecording ? stopRecording : startRecording}
        startIcon={isRecording ? <MicOffIcon /> : <MicIcon />}
        color={isRecording ? "error" : "primary"}
        disabled={!!audioBlob && !isRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      {isRecording && <CircularProgress />}
      {audioUrl && (
        <>
          <audio controls src={audioUrl} />
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
        </>
      )}
    </Box>
  );
};

export default AudioRecorder;
