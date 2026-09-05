import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "authcramlyai.firebaseapp.com",
  projectId: "authcramlyai",
  storageBucket: "authcramlyai.firebasestorage.app",
  messagingSenderId: "365340983229",
  appId: "1:365340983229:web:2e53493273c2d091ea9cd4"
};

const app = initializeApp(firebaseConfig);

const auth= getAuth(app)

const provider=new GoogleAuthProvider()

provider.setCustomParameters({
  prompt: "select_account"
})

export {auth, provider}
