import * as Crypto from 'expo-crypto'
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

const getImage = (IRef, image) => {
    return new Promise(async (resolve, reject) => {
        let data = await IRef.limitToFirst(1).once("value")
        if (data.val() == null) {
            return resolve(null)
        }
        IRef.on("child_added", async (snap, prev) => {
            image[snap.key] = snap.val()
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        IRef.on("child_changed", async (snap) => {
            image[snap.key] = snap.val()
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        IRef.on("child_removed", async (snap) => {
            if (snap.key in image) {
                delete image[snap.key]
            }
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
    })
}

export const userLogin = async (userData) => {
    try {
        const userLoginRef = firebase.database().ref("users").orderByChild("username").equalTo(userData.uname)
        let user = {}
        await getUser(userLoginRef, user)
        console.log("user is runnnig")
        if(user == undefined || user == null){
            
            console.log("if user")
            console.log(user)
        }
        if (Object.keys(user).length !== 0) {
            for (const key in user) {
                let userinfo = user[key]
                const hashpass = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, userData.pass)
                if (userinfo.password === hashpass) {
                    const uiRef = firebase.database().ref("uimages/" + userinfo.profilepicture)
                    let image = {}
                    await getImage(uiRef, image)
                    console.log("image is runnnig")
                    if(image == undefined || image == null){
                        
                        console.log("if image")
                        console.log(image)
                    }
                    let img = null
                    if (Object.keys(image).length !== 0) {
                        for (const key in image) {
                            img = image[key]
                        }
                    }
                    return [key, { ...userinfo, profilepicture: img, profilepictureloc: userinfo.profilepicture }];
                }
                else {
                    return [false, false]
                }
            }
        }
        else {
            return [false, false];
        }
    } catch (error) {
        throw error;
    }
}

export const providerLogin = async (providerData) => {
    try {
        const providerLoginRef = firebase.database().ref("providers").orderByChild("username").equalTo(providerData.uname)
        let provider = {}
        await getUser(providerLoginRef, provider)
        console.log("provider is runnnig")
        if(provider == undefined || provider == null){
            
            console.log("if provider")
            console.log(provider)
        }
        if (Object.keys(provider).length !== 0) {
            for (const key in provider) {
                let providerinfo = provider[key]
                const hashpass = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, providerData.pass)
                if (providerinfo.password === hashpass) {
                    const piRef = firebase.database().ref("pimages/" + providerinfo.profilepicture)
                    let image = {}
                    await getImage(piRef, image)
                    let img = null
                    console.log("image is runnnig")
                    if(image == undefined || image == null){
                        
                        console.log("if image")
                        console.log(image)
                    }
                    if (Object.keys(image).length !== 0) {
                        for (const key in image) {
                            img = image[key]
                        }
                    }
                    return [key, { ...providerinfo, profilepicture: img, profilepictureloc: providerinfo.profilepicture }];
                }
                else {
                    return [false, false]
                }
            }
        }
        else {
            return [false, false];
        }
    } catch (error) {
        throw error;
    }
}
