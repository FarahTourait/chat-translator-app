# Chat Translator App

Real-time cross-platform chat application with automatic multilingual translation, specially designed for low-resource Pakistani languages (Urdu, Punjabi, Pashto, Sindhi, Balochi).

## Problem It Solves

Pakistan has over 70 languages, but most translation apps ignore low-resource languages. This app bridges that gap by enabling real-time translation during chat conversations.

## Features

- Real-time chat with automatic translation
- Supports low-resource Pakistani languages
- Seamless language switching during conversation
- Firebase Authentication for secure login
- Cloud storage for message history
- Cross-platform (iOS and Android)

## Tech Stack

Layer | Technology
-------------------|------------------------------------
Frontend (Mobile)  | React Native, Expo
Backend (API)      | Python, Flask
Database and Auth  | Firebase (Firestore and Auth)
Translation Module | Custom NLP for low-resource languages

## How It Works

1. User opens the app and logs in
2. Selects their preferred language
3. Starts chatting with another user
4. Messages are automatically translated in real-time

## How to Run This Project

Prerequisites:

- Node.js (v16 or later)
- npm or yarn
- Expo Go app on your phone (Android or iOS)
- Python 3.8 or later (for backend)

Step 1: Clone the repository

bash
git clone https://github.com/FarahTourait/chat-translator-app.git
cd chat-translator-app

Step 2: Install frontend dependencies

bash
npm install

Step 3: Set up Firebase

1. Create a Firebase project at firebase.google.com
2. Enable Authentication and Firestore
3. Download google-services.json (Android) or GoogleService-Info.plist (iOS)
4. Place in the correct folder
5. Update firebase.js with your config

Step 4: Run the app

bash
npm start

Scan the QR code with Expo Go app on your phone.

Step 5: Run Flask backend (optional)

bash
cd mobile_inference_server
pip install -r requirements.txt
python app.py

## Project Structure

chat-translator-app/
App.js              # Main React Native component
screens/            # Chat screens
components/         # Reusable UI components
assets/             # Images and fonts
android/            # Android build files
firebase.js         # Firebase configuration
package.json        # Dependencies

## Live Demo

Demo video coming soon

## Contact

Farah Tourait
Email: farahtourait@gmail.com
GitHub: github.com/FarahTourait
LinkedIn: linkedin.com/in/farah-tourait

## License

MIT License - free for anyone to use and learn from.

If you find this project useful, please give it a star.
