import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/database'

// const firebaseConfig = {
//   apiKey: "AIzaSyD8QDTApgOUYoZBWETWPhKaRsdJXJkvs1E",
//   authDomain: "parkingapplication-df612.firebaseapp.com",
//   databaseURL: "https://parkingapplication-df612-default-rtdb.firebaseio.com",
//   projectId: "parkingapplication-df612",
//   storageBucket: "parkingapplication-df612.appspot.com",
//   messagingSenderId: "1054528910632",
//   appId: "1:1054528910632:web:b04b6e1b859ee36a5c0c1d"
// };




// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD12yNnA9HocRMjLjyLKSZEMMTr4-vfBn8",
  authDomain: "parkingapp-173c1.firebaseapp.com",
  databaseURL: "https://parkingapp-173c1-default-rtdb.firebaseio.com",
  projectId: "parkingapp-173c1",
  storageBucket: "parkingapp-173c1.firebasestorage.app",
  messagingSenderId: "184859524329",
  appId: "1:184859524329:web:c44427e5cb4697b3fc8478",
  measurementId: "G-413X4GXB0T"
};

firebase.initializeApp(firebaseConfig);
console.log(firebaseConfig)
export default firebase