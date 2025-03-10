import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import * as Crypto from "expo-crypto";

export const firebaseConfig = {
  apiKey: "AIzaSyD12yNnA9HocRMjLjyLKSZEMMTr4-vfBn8",
  authDomain: "parkingapp-173c1.firebaseapp.com",
  databaseURL: "https://parkingapp-173c1-default-rtdb.firebaseio.com",
  projectId: "parkingapp-173c1",
  storageBucket: "parkingapp-173c1.firebasestorage.app",
  messagingSenderId: "184859524329",
  appId: "1:184859524329:web:c44427e5cb4697b3fc8478",
  measurementId: "G-413X4GXB0T",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const getUser = (URef, user) => {
  return new Promise(async (resolve, reject) => {
    let data = await URef.limitToFirst(1).once("value");
    if (data.val() == null) {
      return resolve(null);
    }
    URef.on(
      "child_added",
      async (snap, prev) => {
        user[snap.key] = snap.val();
        return resolve(true);
      },
      (err) => {
        return reject(err);
      }
    );
    URef.on(
      "child_changed",
      async (snap) => {
        user[snap.key] = snap.val();
        return resolve(true);
      },
      (err) => {
        return reject(err);
      }
    );
    URef.on(
      "child_removed",
      async (snap) => {
        if (snap.key in user) {
          delete user[snap.key];
        }
        return resolve(true);
      },
      (err) => {
        return reject(err);
      }
    );
  });
};

export const getUserContactNo = async (username) => {
  try {
    const providerRef = firebase
      .database()
      .ref("providers")
      .orderByChild("username")
      .equalTo(username);
    let provider = {};
    await getUser(providerRef, provider);
    console.log("provider is runnnig");
    if (provider == undefined || provider == null) {
      console.log("if provider");
      console.log(provider);
    }
    if (Object.keys(provider).length !== 0) {
      for (const key in provider) {
        let providerinfo = provider[key];
        let phno =
          "+91 " +
          providerinfo.contactno.substr(0, 4) +
          "" +
          providerinfo.contactno.substr(4, 3) +
          "" +
          providerinfo.contactno.substr(7, 3);
        return [null, phno, "providers", key];
      }
    }

    const userRef = firebase
      .database()
      .ref("users")
      .orderByChild("username")
      .equalTo(username);
    let user = {};
    await getUser(userRef, user);
    console.log("user is runnnig");
    if (user == undefined || user == null) {
      console.log("if user");
      console.log(user);
    }
    if (Object.keys(user).length !== 0) {
      for (const key in user) {
        let userinfo = user[key];
        let phno =
          "+91 " +
          userinfo.contactno.substr(0, 4) +
          "" +
          userinfo.contactno.substr(4, 3) +
          "" +
          userinfo.contactno.substr(7, 3);
        return [null, phno, "users", key];
      }
    }

    return false;
  } catch (error) {
    throw error;
  }
};

export const setUserPassword = async (userdata, usertype) => {
  try {
    const hashpass = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      userdata.password
    );
    userdata.password = hashpass;
    const dbRef = firebase.database().ref(usertype + "/" + userdata.id);
    await dbRef.update({ password: userdata.password });

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
