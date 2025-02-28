import firebase from '../myFirebase'

const getUser = (URef, user) => {
    return new Promise(async (resolve, reject) => {
        let data = await URef.limitToFirst(1).once("value")
        if (data.val() == null) {
            return resolve(null)
        }
        URef.on("child_added", async (snap, prev) => {
            user[snap.key] = snap.val()
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        URef.on("child_changed", async (snap) => {
            user[snap.key] = snap.val()
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        URef.on("child_removed", async (snap) => {
            if (snap.key in user) {
                delete user[snap.key]
            }
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
    })
}

export const checkExistance = async (username) => {
    const userRef = firebase.database().ref("users").orderByChild("username").equalTo(username)
    const providerRef = firebase.database().ref("providers").orderByChild("username").equalTo(username)
    let user = {}
    await getUser(userRef, user)
    console.log("user is runnnig")
    if(user == undefined || user == null){
        
        console.log("if user")
        console.log(user)
    }

    if (Object.keys(user).length !== 0) {
        return false
    }
    let provider = {}
    await getUser(providerRef, provider)
    console.log("provider is runnnig")
    if(provider == undefined || provider == null){
        
        console.log("if provider")
        console.log(provider)
    }
    
    if (Object.keys(provider).length !== 0) {
        return false
    }
    return true
}

export const userRegister = async (userData) => {
    try {
        let valid = await checkExistance(userData.username);
        if (valid) {
            const usersRef = firebase.database().ref("users")
            const UIRef = firebase.database().ref("uimages")
            let k = await UIRef.push({ image: userData.profilepicture })
            await usersRef.push().set({ ...userData, profilepicture: k.key })
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
}

export const providerRegister = async (providerData) => {
    try {
        let valid = await checkExistance(providerData.username);
        if (valid) {
            const providersRef = firebase.database().ref("providers")
            const PIRef = firebase.database().ref("pimages")
            let k = await PIRef.push({ image: providerData.profilepicture })
            await providersRef.push().set({ ...providerData, profilepicture: k.key })
            return true;
        }
        return false
    } catch (error) {
        throw error;
    }
}