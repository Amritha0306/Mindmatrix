<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
**About The App**

This project, MedSense, is a high-end AI-powered medical companion prototype designed to bridge the gap between complex doctor prescriptions and daily patient adherence. As a senior engineer, I've architected this to be a "Zero-Friction" application—meaning it uses AI to eliminate the tedious manual entry usually required by health apps.

Here is a detailed breakdown of the project prototype:
1. The Core Innovation: Multi-Modal AI Analysis
The heart of the app is the services/gemini.ts integration. Unlike standard reminder apps, MedSense uses Google Gemini 3 Flash to process three types of input:
Visual (Photo Scan): Uses computer vision to read handwritten or printed prescriptions.
Auditory (Voice Record): Uses the MediaRecorder API to capture doctor instructions. The AI doesn't just transcribe; it extracts intent (e.g., "Take this after lunch" becomes a schedule for 2:00 PM).
Textual: Simplifies medical jargon into "Patient-Friendly" explanations.
2. Intelligent Scheduling & Alarm System
The prototype implements a "Background Pulse" in App.tsx:
The Check Loop: A useEffect hook runs every 30 seconds to compare the system clock against the medication database.
Smart Notifications: It uses the browser's Notification API. If permissions are granted, you get a system-level alert.
Audio Context Alarms: Since browsers often block auto-playing sounds, I used the Web Audio API (OscillatorNode) to generate a synthetic "beep" that acts as a reliable audio cue.
Deduplication: A ref (notifiedTodayRef) tracks which doses have already alerted for the current day, ensuring the user isn't spammed with multiple alarms for the same pill within a single minute.
3. User Experience (UX) Architecture
Dashboard Prioritization: The dashboard doesn't just list meds alphabetically. It features a "Next Due Soon" algorithm that calculates the time difference between "Now" and the closest upcoming dose, highlighting it at the top.
Indian Standard Time (IST) Formatting: Every time string is passed through formatTimeToAMPM. This converts 14:00 into 2:00 PM, which is the standard cognitive model for patients in India.
Health Tips Carousel: To encourage daily app engagement, I implemented a rotating tip system. It cycles through 6 evidence-based health tips every 8 seconds with smooth CSS transitions.
4. Data Management & Persistence
LocalStorage Engine: The app uses a "Local-First" strategy. Your medication list is synced to the browser's storage instantly. This ensures that if you close the tab or lose internet, your schedule remains intact.
State Machine: Instead of complex routing libraries, I used a lightweight ViewState pattern (dashboard | add | detail). This makes the app feel like a native mobile app with instant transitions and no "page loads."
5. Accessibility and Safety
Simple Explanations: The AI is specifically instructed via the systemInstruction to provide "patient-friendly" language. For example, instead of saying "Antihypertensive," it says "This helps lower your blood pressure."
Side Effect Awareness: The prototype explicitly creates a separate visual block for side effects, ensuring users know what symptoms are normal and which are warnings.

Summary of the Workflow
Input: You snap a photo or record a 5-second voice clip of your doctor speaking.
Processing: Gemini extracts the medicine name, dosage, and frequency. It automatically generates 24-hour timestamps (e.g., "twice a day" -> 08:00 and 20:00).
Adherence: The app sits in the background. At 08:00, it triggers a system notification and an audio chirp.
Tracking: You tap the "Check" icon on the dashboard to mark it as taken.
This prototype demonstrates how Generative AI can be turned into a Utility that saves lives by ensuring medical compliance.

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1YT5_0BoO0BG9Zr2wNvn4VhbNfjccrvkk

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
