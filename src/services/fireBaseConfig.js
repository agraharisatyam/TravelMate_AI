// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiOB4r-HGqoiJ_Se_v9CsGJgxa1hlG6KY",
  authDomain: "travelmate-travel-planner.firebaseapp.com",
  projectId: "travelmate-travel-planner",
  storageBucket: "travelmate-travel-planner.appspot.com",
  messagingSenderId: "711452902013",
  appId: "1:711452902013:web:517d37768efe86ee2a6714",
  measurementId: "G-H32SFP57S0"
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);


// firebase login

// firebase init

// "site": "travel-mate",

// firebase deploy --only hosting:travel-mate