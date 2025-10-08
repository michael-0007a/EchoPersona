#!/usr/bin/env python3
"""
Audio Recording Diagnostics Tool
Helps diagnose common audio recording issues
"""

import os
import tempfile
import logging
from datetime import datetime

def analyze_webm_file(file_path: str) -> dict:
    """Analyze a WebM file to diagnose recording issues"""
    try:
        if not os.path.exists(file_path):
            return {"error": "File not found"}

        file_size = os.path.getsize(file_path)

        with open(file_path, 'rb') as f:
            data = f.read()

        analysis = {
            "file_size": file_size,
            "file_path": file_path,
            "timestamp": datetime.now().isoformat(),
            "format_detected": "unknown",
            "likely_issues": [],
            "recommendations": []
        }

        # Check WebM format
        if data[:4] == b'\x1a\x45\xdf\xa3':
            analysis["format_detected"] = "webm"
        elif data[:4] == b'RIFF' and data[8:12] == b'WAVE':
            analysis["format_detected"] = "wav"
        elif b'ftyp' in data[:20]:
            analysis["format_detected"] = "mp4"

        # Analyze file size issues
        if file_size < 100:
            analysis["likely_issues"].append("File extremely small - likely recording failed")
            analysis["recommendations"].append("Check microphone permissions and try recording again")
        elif file_size < 500:
            analysis["likely_issues"].append("File very small - probably contains only silence")
            analysis["recommendations"].append("Speak closer to microphone and record for longer (3+ seconds)")
        elif file_size < 2000:
            analysis["likely_issues"].append("File small - may not contain enough speech")
            analysis["recommendations"].append("Try recording for 3-5 seconds with clear speech")

        # Check for audio stream indicators in WebM
        if analysis["format_detected"] == "webm":
            if b'OpusHead' in data:
                analysis["has_opus_stream"] = True
            elif b'vorbis' in data:
                analysis["has_vorbis_stream"] = True
            else:
                analysis["likely_issues"].append("No clear audio stream detected in WebM")
                analysis["recommendations"].append("Recording may have failed - check browser permissions")

        # Estimate recording duration
        if analysis["format_detected"] == "webm" and file_size > 1000:
            # Very rough estimate: WebM with speech is typically 8-15KB per second
            estimated_duration = file_size / 10000  # Conservative estimate
            analysis["estimated_duration_seconds"] = round(estimated_duration, 2)

            if estimated_duration < 0.5:
                analysis["likely_issues"].append("Recording duration very short")
                analysis["recommendations"].append("Record for at least 2-3 seconds")

        return analysis

    except Exception as e:
        return {"error": f"Analysis failed: {str(e)}"}

def generate_diagnostic_report(audio_data: bytes, filename: str = "audio.webm") -> str:
    """Generate a detailed diagnostic report for audio data"""

    # Save to temp file for analysis
    with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as tmp_file:
        tmp_file.write(audio_data)
        tmp_path = tmp_file.name

    try:
        analysis = analyze_webm_file(tmp_path)

        report = f"""
🎵 AUDIO RECORDING DIAGNOSTIC REPORT
=====================================

📁 File Information:
   • Filename: {filename}
   • Size: {len(audio_data)} bytes
   • Format: {analysis.get('format_detected', 'unknown')}
   • Timestamp: {analysis.get('timestamp', 'unknown')}

🔍 Analysis Results:
"""

        if analysis.get('estimated_duration_seconds'):
            report += f"   • Estimated Duration: {analysis['estimated_duration_seconds']} seconds\n"

        if analysis.get('has_opus_stream'):
            report += "   • ✅ Opus audio stream detected\n"
        elif analysis.get('has_vorbis_stream'):
            report += "   • ✅ Vorbis audio stream detected\n"

        if analysis.get('likely_issues'):
            report += "\n⚠️  Potential Issues:\n"
            for issue in analysis['likely_issues']:
                report += f"   • {issue}\n"

        if analysis.get('recommendations'):
            report += "\n💡 Recommendations:\n"
            for rec in analysis['recommendations']:
                report += f"   • {rec}\n"

        # Add general troubleshooting
        report += """
🛠️  General Troubleshooting:
   • Ensure microphone permissions are granted in browser
   • Speak clearly and directly into microphone
   • Record in a quiet environment
   • Try recording for at least 3-5 seconds
   • Check microphone volume levels
   • Test with a different browser if issues persist

📊 File Size Guidelines:
   • < 500 bytes: Likely empty/failed recording
   • 500-2KB: Very short, probably insufficient
   • 2-10KB: Short but may work for brief speech
   • 10KB+: Good size for speech recognition
"""

        return report

    finally:
        # Clean up temp file
        try:
            os.unlink(tmp_path)
        except:
            pass

if __name__ == "__main__":
    # Example usage
    test_file = "test_audio.webm"
    if os.path.exists(test_file):
        result = analyze_webm_file(test_file)
        print("Analysis Result:")
        for key, value in result.items():
            print(f"  {key}: {value}")
