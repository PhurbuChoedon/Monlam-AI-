import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextareaAutosize, Button, CircularProgress } from '@mui/material';

type TranscriptionAreaProps = {
  audioBlob: Blob | null;
  onReset: () => void;
  setTranscription: (text: string) => void;
  transcription: string;
};

const TranscriptionArea: React.FC<TranscriptionAreaProps> = ({
  audioBlob,
  onReset,
  setTranscription,
  transcription
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!audioBlob) {
      alert('No audio file available for transcription.');
      return;
    }

    if (!transcription.trim()) {
      alert('Please provide some transcription text.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('transcription', transcription);

    try {
      const response = await axios.post('http://localhost:8000/api/save', formData);
      console.log('Submission successful:', response.data);
      alert('Transcription submitted successfully!');
      onReset();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data : 'An error occurred';
      console.error('Submission error:', errorMessage);
      alert(`Failed to submit transcription. ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <TextareaAutosize
        minRows={4}
        value={transcription}
        onChange={(e) => setTranscription(e.target.value)}
        placeholder="Transcribe the audio here"
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '12px',
        }}
        disabled={isSubmitting}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Submit Transcription'}
      </Button>
    </Box>
  );
};

export default TranscriptionArea;
