'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

export default function Index() {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'ai', text: string}>>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';

  useEffect(() => {
    setSessionId(`session_${Date.now()}`);
  }, []);

  const startInterview = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${GATEWAY_URL}/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          position: 'Backend Developer',
          level: 'Junior'
        })
      });

      const data = await response.json();
      console.log('Start interview response:', data);
      console.log('Raw audio_url from API:', data.audio_url);
      console.log('GATEWAY_URL:', GATEWAY_URL);
      
      setMessages([{ role: 'ai', text: data.ai_message }]);
      
      // Ensure absolute URL
      let audioUrl = data.audio_url;
      if (!audioUrl.startsWith('http://') && !audioUrl.startsWith('https://')) {
        audioUrl = `${GATEWAY_URL}${audioUrl}`;
      }
      console.log('Final audio URL:', audioUrl);
      
      setCurrentAudio(audioUrl);
      setHasStarted(true);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        console.log('Audio element src set to:', audioRef.current.src);
        await audioRef.current.play().catch(e => console.error('Audio play error:', e));
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
      alert('Không thể kết nối với server. Vui lòng kiểm tra lại!');
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToBackend(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Không thể truy cập microphone!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch(`${GATEWAY_URL}/interview/respond-audio?session_id=${sessionId}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log('Audio response:', data);
      console.log('Raw audio_url from API:', data.audio_url);
      
      setMessages(prev => [
        ...prev,
        { role: 'user', text: data.user_message },
        { role: 'ai', text: data.ai_message }
      ]);

      // Ensure absolute URL
      let audioUrl = data.audio_url;
      if (!audioUrl.startsWith('http://') && !audioUrl.startsWith('https://')) {
        audioUrl = `${GATEWAY_URL}${audioUrl}`;
      }
      console.log('Final audio URL:', audioUrl);
      
      setCurrentAudio(audioUrl);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        console.log('Audio element src set to:', audioRef.current.src);
        await audioRef.current.play().catch(e => console.error('Audio play error:', e));
      }
    } catch (error) {
      console.error('Failed to process audio:', error);
      alert('Xử lý audio thất bại!');
    } finally {
      setIsProcessing(false);
    }
  };

  const sendTextMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem('textInput') as HTMLInputElement;
    const message = input.value.trim();
    
    if (!message) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`${GATEWAY_URL}/interview/respond-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: message
        })
      });

      const data = await response.json();
      console.log('Text response:', data);
      console.log('Raw audio_url from API:', data.audio_url);
      
      setMessages(prev => [
        ...prev,
        { role: 'user', text: data.user_message },
        { role: 'ai', text: data.ai_message }
      ]);

      // Ensure absolute URL
      let audioUrl = data.audio_url;
      if (!audioUrl.startsWith('http://') && !audioUrl.startsWith('https://')) {
        audioUrl = `${GATEWAY_URL}${audioUrl}`;
      }
      console.log('Final audio URL:', audioUrl);
      
      setCurrentAudio(audioUrl);
      input.value = '';

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        console.log('Audio element src set to:', audioRef.current.src);
        await audioRef.current.play().catch(e => console.error('Audio play error:', e));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Gửi tin nhắn thất bại!');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.page}>
      <header style={{textAlign: 'center', padding: '2rem', background: '#0070f3', color: 'white'}}>
        <h1 style={{margin: 0}}>🎯 AI Mock Interview</h1>
        <p style={{margin: '0.5rem 0 0'}}>Luyện tập phỏng vấn với AI Interviewer</p>
      </header>

      <main style={{maxWidth: '900px', margin: '2rem auto', padding: '0 1rem'}}>
        {!hasStarted ? (
          <div style={{textAlign: 'center', padding: '4rem 0'}}>
            <button 
              onClick={startInterview} 
              disabled={isProcessing}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                background: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isProcessing ? 'wait' : 'pointer',
                opacity: isProcessing ? 0.6 : 1
              }}
            >
              {isProcessing ? '⏳ Đang khởi động...' : '🚀 Bắt đầu phỏng vấn'}
            </button>
          </div>
        ) : (
          <>
            <div style={{
              minHeight: '400px',
              maxHeight: '500px',
              overflowY: 'auto',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              background: '#f9f9f9'
            }}>
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    background: msg.role === 'ai' ? '#e3f2fd' : '#fff3e0',
                    border: msg.role === 'ai' ? '1px solid #2196f3' : '1px solid #ff9800'
                  }}
                >
                  <strong>{msg.role === 'ai' ? '🤖 AI Interviewer:' : '👤 Bạn:'}</strong>
                  <p style={{margin: '0.5rem 0 0'}}>{msg.text}</p>
                </div>
              ))}
            </div>

            <div style={{marginBottom: '1rem'}}>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                style={{
                  padding: '0.75rem 1.5rem',
                  marginRight: '1rem',
                  fontSize: '1rem',
                  background: isRecording ? '#f44336' : '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isProcessing ? 'wait' : 'pointer',
                  opacity: isProcessing ? 0.6 : 1
                }}
              >
                {isRecording ? '⏹️ Dừng ghi âm' : '🎤 Ghi âm trả lời'}
              </button>
              
              {currentAudio && (
                <audio ref={audioRef} controls style={{verticalAlign: 'middle'}} />
              )}
            </div>

            <form onSubmit={sendTextMessage} style={{display: 'flex', gap: '0.5rem'}}>
              <input
                name="textInput"
                type="text"
                placeholder="Hoặc nhập văn bản..."
                disabled={isProcessing}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              />
              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  background: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isProcessing ? 'wait' : 'pointer',
                  opacity: isProcessing ? 0.6 : 1
                }}
              >
                📤 Gửi
              </button>
            </form>
          </>
        )}
      </main>

      <footer style={{textAlign: 'center', padding: '2rem', color: '#666', fontSize: '0.9rem'}}>
        {sessionId && <p>Session ID: {sessionId}</p>}
        <p>Microservices Architecture | Nx Monorepo</p>
      </footer>
    </div>
  );
}
