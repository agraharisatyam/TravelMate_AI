
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

**Deploying on Vercel (fix "Error 400: redirect_uri_mismatch")**

Google sign-in will fail until your Vercel URL is allowed in the OAuth client. Do this in Google Cloud, then redeploy.

1. Open [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Click your **OAuth 2.0 Client ID** (type: Web application).
3. **Authorized JavaScript origins** – click **+ ADD URI** and add **both** (no trailing slash on the first):
   - `https://travel-mate-ai-72t6.vercel.app`
   - If you use a custom domain or other Vercel URL, add that too (e.g. `https://your-custom.vercel.app`).
4. **Authorized redirect URIs** – click **+ ADD URI** and add **both**:
   - `https://travel-mate-ai-72t6.vercel.app`
   - `https://travel-mate-ai-72t6.vercel.app/`
   (Add your custom Vercel URL here too if you use one.)
5. Click **SAVE**.
6. In **Vercel** → your project → **Settings** → **Environment Variables**, set:
   - `VITE_GOOGLE_OAUTH_CLIENT_ID` = your Google OAuth Web client ID.
7. **Redeploy** the app on Vercel after saving the env var and Google Console settings.

The app sends `window.location.origin` as the redirect URI (e.g. `https://travel-mate-ai-72t6.vercel.app`). It must appear in **Authorized redirect URIs** exactly (including `https://` and no typos).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the project.

