"""
Audio Recording Diagnostic and Fix Tool
Helps identify why microphone recording isn't working
"""

import os
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import tempfile

# Add this endpoint to main.py to diagnose audio issues
async def diagnose_audio(audio_file: UploadFile = File(...)):
    """Comprehensive audio diagnostics"""
    try:
        audio_data = await audio_file.read()

        diagnosis = {
            "file_name": audio_file.filename,
            "file_size_bytes": len(audio_data),
            "file_size_kb": round(len(audio_data) / 1024, 2),
            "likely_issue": None,
            "recommendations": [],
            "audio_format": "unknown",
            "has_audio_stream": False,
            "estimated_duration_ms": 0
        }

        # Check file size
        if len(audio_data) < 100:
            diagnosis["likely_issue"] = "Recording failed completely - no data captured"
            diagnosis["recommendations"].extend([
                "Check if microphone permissions are granted in browser",
                "Verify microphone is selected in browser settings",
                "Test microphone in other applications first"
            ])
        elif len(audio_data) < 1000:
            diagnosis["likely_issue"] = "Recording captured header only - no actual audio"
            diagnosis["recommendations"].extend([
                "Microphone may be muted or volume too low",
                "Try speaking louder and closer to microphone",
                "Record for at least 2-3 seconds",
                "Check browser console for recording errors"
            ])
        elif len(audio_data) < 5000:
            diagnosis["likely_issue"] = "Very short recording - insufficient audio captured"
            diagnosis["recommendations"].extend([
                "Record for longer duration (at least 3 seconds)",
                "Speak clearly and continuously",
                "Check if recording is stopping prematurely"
            ])
        else:
            diagnosis["likely_issue"] = "File size looks reasonable"
            diagnosis["recommendations"].append("Audio file size is adequate for speech recognition")

        # Analyze format
        if len(audio_data) >= 4:
            if audio_data[:4] == b'\x1a\x45\xdf\xa3':
                diagnosis["audio_format"] = "WebM"

                # Check for audio streams
                if b'OpusHead' in audio_data:
                    diagnosis["has_audio_stream"] = True
                    diagnosis["codec"] = "Opus"
                elif b'vorbis' in audio_data:
                    diagnosis["has_audio_stream"] = True
                    diagnosis["codec"] = "Vorbis"
                else:
                    diagnosis["has_audio_stream"] = False
                    diagnosis["recommendations"].append("WebM container found but no audio stream detected")

                # Estimate duration (very rough)
                if len(audio_data) > 1000:
                    estimated_duration = (len(audio_data) / 8000) * 1000  # rough estimate in ms
                    diagnosis["estimated_duration_ms"] = round(estimated_duration)

            elif audio_data[:4] == b'RIFF':
                diagnosis["audio_format"] = "WAV"
                diagnosis["has_audio_stream"] = True

        # Quality assessment
        if len(audio_data) >= 10000:  # 10KB+
            diagnosis["quality"] = "Good - should work for speech recognition"
        elif len(audio_data) >= 5000:  # 5-10KB
            diagnosis["quality"] = "Moderate - may work for short speech"
        elif len(audio_data) >= 1000:  # 1-5KB
            diagnosis["quality"] = "Poor - unlikely to contain clear speech"
        else:
            diagnosis["quality"] = "Insufficient - recording failed"

        return diagnosis

    except Exception as e:
        return {"error": str(e)}


# Frontend JavaScript fix for recording
FRONTEND_FIX = """
// Fix for browser audio recording
// Add this to your frontend code

class ImprovedAudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
    }

    async initialize() {
        try {
            console.log('🎤 Requesting microphone access...');
            
            // Request microphone with specific constraints
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 16000,  // Standard for speech
                    channelCount: 1      // Mono
                }
            });
            
            console.log('✅ Microphone access granted');
            console.log('Audio tracks:', this.stream.getAudioTracks());
            
            // Check if we got audio tracks
            const audioTracks = this.stream.getAudioTracks();
            if (audioTracks.length === 0) {
                throw new Error('No audio tracks available');
            }
            
            console.log('Microphone label:', audioTracks[0].label);
            console.log('Microphone settings:', audioTracks[0].getSettings());
            
            return true;
            
        } catch (error) {
            console.error('❌ Microphone access failed:', error);
            alert(`Microphone error: ${error.message}`);
            return false;
        }
    }

    async startRecording() {
        try {
            this.audioChunks = [];
            
            // Try different MIME types in order of preference
            const mimeTypes = [
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/ogg;codecs=opus',
                'audio/mp4'
            ];
            
            let mimeType = null;
            for (const type of mimeTypes) {
                if (MediaRecorder.isTypeSupported(type)) {
                    mimeType = type;
                    console.log('✅ Using MIME type:', type);
                    break;
                }
            }
            
            if (!mimeType) {
                throw new Error('No supported audio MIME type found');
            }
            
            // Create MediaRecorder with proper settings
            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: mimeType,
                audioBitsPerSecond: 128000  // Higher bitrate for better quality
            });
            
            console.log('MediaRecorder state:', this.mediaRecorder.state);
            
            // Handle data available
            this.mediaRecorder.ondataavailable = (event) => {
                console.log('📊 Audio data chunk:', event.data.size, 'bytes');
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            // Start recording with smaller timeslice for more frequent data
            this.mediaRecorder.start(100);  // Collect data every 100ms
            console.log('🔴 Recording started...');
            
            return true;
            
        } catch (error) {
            console.error('❌ Recording start failed:', error);
            return false;
        }
    }

    async stopRecording() {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
                reject(new Error('MediaRecorder not active'));
                return;
            }
            
            this.mediaRecorder.onstop = () => {
                console.log('⏹️ Recording stopped');
                console.log('Total chunks:', this.audioChunks.length);
                
                if (this.audioChunks.length === 0) {
                    console.error('❌ No audio data captured!');
                    reject(new Error('No audio data recorded'));
                    return;
                }
                
                // Create blob from chunks
                const blob = new Blob(this.audioChunks, { 
                    type: this.mediaRecorder.mimeType 
                });
                
                console.log('📦 Audio blob created:', blob.size, 'bytes');
                console.log('Blob type:', blob.type);
                
                // Validate blob size
                if (blob.size < 1000) {
                    console.warn('⚠️ Audio blob is very small, may be empty');
                }
                
                resolve(blob);
            };
            
            this.mediaRecorder.stop();
        });
    }

    cleanup() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            console.log('🛑 Microphone stream stopped');
        }
    }
}

// Usage example:
async function recordAndSendAudio() {
    const recorder = new ImprovedAudioRecorder();
    
    // Initialize
    const initialized = await recorder.initialize();
    if (!initialized) {
        console.error('Failed to initialize recorder');
        return;
    }
    
    // Start recording
    await recorder.startRecording();
    
    // Record for 3 seconds (minimum)
    console.log('Recording for 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Stop and get audio
    try {
        const audioBlob = await recorder.stopRecording();
        console.log('Final audio size:', audioBlob.size, 'bytes');
        
        // Send to server
        const formData = new FormData();
        formData.append('audio_file', audioBlob, 'recording.webm');
        formData.append('agent_id', 'your_agent_id');
        
        const response = await fetch('/api/speech-chat', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        console.log('Server response:', result);
        
    } catch (error) {
        console.error('Recording error:', error);
    } finally {
        recorder.cleanup();
    }
}
"""

if __name__ == "__main__":
    print("Audio Recording Diagnostic Tool")
    print("=" * 50)
    print("\nCommon Issues and Solutions:")
    print("\n1. Microphone Permissions:")
    print("   - Chrome: Settings > Privacy > Site Settings > Microphone")
    print("   - Firefox: Address bar > permissions icon > microphone")
    print("   - Edge: Settings > Site permissions > Microphone")
    print("\n2. Small Audio Files (< 1KB):")
    print("   - Recording is stopping too quickly")
    print("   - Microphone volume is too low")
    print("   - No actual speech being captured")
    print("\n3. Frontend Recording Issues:")
    print("   - Check browser console for errors")
    print("   - Ensure MediaRecorder is properly initialized")
    print("   - Record for at least 2-3 seconds")
    print("   - Use timeslice parameter in mediaRecorder.start()")
    print("\n" + "=" * 50)
    print("\nFrontend Fix Code:")
    print(FRONTEND_FIX)
