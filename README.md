
# AI-Powered Trip Recommendation Platform

- Developed a Reactjs based web application to provide personalized trip recommendations.
- Integrated Google Gemini's Generative AI API for intelligent trip planning and suggestions.
- Utilized Google Places API to fetch detailed location information and imagery.
- Implemented seamless user authentication and authorization using Google OAuth.
- Enhanced user interface and experience with Tailwind CSS and Shadcn.




## <a name="quick-start">🤸 Quick Start</a>

You can follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:


- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)



**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
VITE_GOOGLE_PLACE_APIKEY=
VITE_GOOGLE_GEMINI_AI_APIKEY=
VITE_GOOGLE_OAUTH_CLIENT_ID=

```

Replace the placeholder values with your actual credentials. You can obtain these credentials by signing up on the [Google Cloud Console](https://console.cloud.google.com/).
[Google AI Studio](https://aistudio.google.com/)

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the project.

