#!/usr/bin/env python3
"""
Alternative Speech-to-Text Approaches
Multiple fallback methods for WebM audio processing
"""

import os
import tempfile
import logging
import subprocess
import json
from typing import Optional
import requests

try:
    from pydub import AudioSegment
    PYDUB_AVAILABLE = True
except ImportError:
    PYDUB_AVAILABLE = False

class AlternativeSpeechProcessor:
    def __init__(self):
        self.temp_files = []

    def __del__(self):
        """Clean up temporary files"""
        for temp_file in self.temp_files:
            try:
                if os.path.exists(temp_file):
                    os.unlink(temp_file)
            except:
                pass

    async def process_webm_alternative(self, audio_data: bytes) -> Optional[str]:
        """Try alternative methods to extract and process WebM audio"""

        logging.info(f"🔄 Trying alternative WebM processing for {len(audio_data)} bytes")

        # Method 1: FFmpeg direct extraction
        result = await self._try_ffmpeg_extraction(audio_data)
        if result:
            return result

        # Method 2: Raw audio data extraction
        result = await self._try_raw_audio_extraction(audio_data)
        if result:
            return result

        # Method 3: Online speech API (if available)
        result = await self._try_online_speech_api(audio_data)
        if result:
            return result

        # Method 4: Whisper API (if available)
        result = await self._try_whisper_api(audio_data)
        if result:
            return result

        return None

    async def _try_ffmpeg_extraction(self, audio_data: bytes) -> Optional[str]:
        """Use FFmpeg to extract audio and convert to text"""
        try:
            # Check if ffmpeg is available
            if not self._is_ffmpeg_available():
                logging.warning("⚠️ FFmpeg not available")
                return None

            # Save WebM to temp file
            webm_path = self._save_temp_file(audio_data, '.webm')
            wav_path = webm_path.replace('.webm', '.wav')

            # Use FFmpeg to convert WebM to WAV
            cmd = [
                'ffmpeg', '-i', webm_path,
                '-ar', '16000',  # 16kHz sample rate
                '-ac', '1',      # Mono
                '-f', 'wav',     # WAV format
                '-y',            # Overwrite output
                wav_path
            ]

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0 and os.path.exists(wav_path):
                # Read the converted WAV file
                with open(wav_path, 'rb') as f:
                    wav_data = f.read()

                logging.info(f"✅ FFmpeg conversion successful: {len(wav_data)} bytes")

                # Try speech recognition on the converted file
                from .voice_processor import VoiceProcessor
                voice_processor = VoiceProcessor()
                return await voice_processor._try_speech_recognition("ffmpeg_converted", wav_data)
            else:
                logging.warning(f"⚠️ FFmpeg conversion failed: {result.stderr}")
                return None

        except Exception as e:
            logging.error(f"❌ FFmpeg extraction failed: {e}")
            return None

    async def _try_raw_audio_extraction(self, audio_data: bytes) -> Optional[str]:
        """Try to extract raw audio data from WebM container"""
        try:
            logging.info("🔄 Attempting raw audio extraction...")

            # Look for common audio patterns in WebM
            audio_patterns = [
                b'OpusHead',  # Opus audio header
                b'vorbis',    # Vorbis audio
                b'\x7fFLAC',  # FLAC audio
            ]

            for pattern in audio_patterns:
                if pattern in audio_data:
                    # Find the start of audio data
                    audio_start = audio_data.find(pattern)
                    logging.info(f"📍 Found {pattern} at position {audio_start}")

                    # Extract everything after the header
                    extracted_audio = audio_data[audio_start:]

                    # Try different approaches to decode this
                    result = await self._decode_extracted_audio(extracted_audio, pattern.decode('utf-8', errors='ignore'))
                    if result:
                        return result

            # If no patterns found, try splitting the file into chunks and testing each
            chunk_size = 1024
            for i in range(0, len(audio_data), chunk_size):
                chunk = audio_data[i:i+chunk_size]
                if len(chunk) < 100:  # Skip very small chunks
                    continue

                # Try to process chunk as raw PCM
                result = await self._try_chunk_as_pcm(chunk, i)
                if result:
                    return result

            return None

        except Exception as e:
            logging.error(f"❌ Raw extraction failed: {e}")
            return None

    async def _decode_extracted_audio(self, audio_data: bytes, format_hint: str) -> Optional[str]:
        """Try to decode extracted audio data"""
        try:
            # Save to temp file with appropriate extension
            if 'opus' in format_hint.lower():
                temp_path = self._save_temp_file(audio_data, '.opus')
            elif 'vorbis' in format_hint.lower():
                temp_path = self._save_temp_file(audio_data, '.ogg')
            elif 'flac' in format_hint.lower():
                temp_path = self._save_temp_file(audio_data, '.flac')
            else:
                temp_path = self._save_temp_file(audio_data, '.raw')

            # Try to convert using pydub
            if PYDUB_AVAILABLE:
                try:
                    audio_segment = AudioSegment.from_file(temp_path)
                    wav_path = temp_path.replace(temp_path.split('.')[-1], 'wav')
                    audio_segment.export(wav_path, format="wav")

                    with open(wav_path, 'rb') as f:
                        wav_data = f.read()

                    from .voice_processor import VoiceProcessor
                    voice_processor = VoiceProcessor()
                    return await voice_processor._try_speech_recognition(f"extracted_{format_hint}", wav_data)

                except Exception as e:
                    logging.warning(f"⚠️ Pydub decode failed for {format_hint}: {e}")

            return None

        except Exception as e:
            logging.error(f"❌ Audio decode failed: {e}")
            return None

    async def _try_chunk_as_pcm(self, chunk_data: bytes, chunk_index: int) -> Optional[str]:
        """Try to interpret a chunk as raw PCM audio"""
        try:
            # Create WAV header for this chunk
            from .voice_processor import VoiceProcessor
            voice_processor = VoiceProcessor()

            # Try different sample rates
            for sample_rate in [16000, 22050, 44100]:
                wav_data = voice_processor._create_wav_from_raw_pcm(
                    chunk_data,
                    sample_rate=sample_rate,
                    channels=1,
                    sample_width=2
                )

                result = await voice_processor._try_speech_recognition(f"chunk_{chunk_index}_{sample_rate}", wav_data)
                if result:
                    logging.info(f"✅ Success with chunk {chunk_index} at {sample_rate}Hz")
                    return result

            return None

        except Exception as e:
            logging.warning(f"⚠️ Chunk processing failed: {e}")
            return None

    async def _try_online_speech_api(self, audio_data: bytes) -> Optional[str]:
        """Try online speech recognition services"""
        try:
            # This is a placeholder for online APIs like AssemblyAI, Speechmatics, etc.
            # You would need API keys and implement the specific API calls

            logging.info("🌐 Online speech API not implemented yet")
            return None

        except Exception as e:
            logging.error(f"❌ Online API failed: {e}")
            return None

    async def _try_whisper_api(self, audio_data: bytes) -> Optional[str]:
        """Try OpenAI Whisper API"""
        try:
            # This would require OpenAI API key
            # Placeholder implementation

            logging.info("🤖 Whisper API not implemented yet")
            return None

        except Exception as e:
            logging.error(f"❌ Whisper API failed: {e}")
            return None

    def _is_ffmpeg_available(self) -> bool:
        """Check if FFmpeg is available on the system"""
        try:
            result = subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True)
            return result.returncode == 0
        except FileNotFoundError:
            return False

    def _save_temp_file(self, data: bytes, extension: str) -> str:
        """Save data to a temporary file and track it for cleanup"""
        temp_path = tempfile.mktemp(suffix=extension)
        with open(temp_path, 'wb') as f:
            f.write(data)
        self.temp_files.append(temp_path)
        return temp_path

# Mock recognition for testing without actual audio
async def mock_speech_recognition(audio_data: bytes) -> str:
    """Mock speech recognition that returns a test response"""
    size_kb = len(audio_data) / 1024

    if size_kb < 0.5:
        return None  # Too small, like real recognition
    else:
        # Return a mock transcription based on file size
        return f"Hello, this is a test transcription for a {size_kb:.1f}KB audio file."

# Integration with existing voice processor
def integrate_alternative_processing():
    """Add alternative processing to the existing voice processor"""

    # This would modify the existing VoiceProcessor class
    additional_code = '''
    async def try_alternative_processing(self, audio_data: bytes) -> Optional[str]:
        """Try alternative speech processing methods"""
        alt_processor = AlternativeSpeechProcessor()
        return await alt_processor.process_webm_alternative(audio_data)
    '''

    return additional_code
