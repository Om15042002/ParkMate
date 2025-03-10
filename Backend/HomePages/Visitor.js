import firebase from '../myFirebase'

const getCounts = (DBRef, counts) => {
    return new Promise(async (resolve, reject) => {
        let data = await DBRef.limitToFirst(1).once("value")
        if (data.val() == null) {
            return resolve(null)
        }
        DBRef.on("child_added", async (snap, prev) => {
            counts.count += 1
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        DBRef.on("child_changed", async (snap) => {
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        DBRef.on("child_removed", async (snap) => {
            counts.count -= 1
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
    })
}

const getParkings = (PRef, parking) => {
    return new Promise(async (resolve, reject) => {
        let data = await PRef.limitToFirst(1).once("value")
        if (data.val() == null) {
            return resolve(null)
        }
        PRef.on("child_added", async (snap, prev) => {
            parking[snap.key] = snap.val()
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        PRef.on("child_changed", async (snap) => {
            parking[snap.key] = snap.val()
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        PRef.on("child_removed", async (snap) => {
            if (snap.key in parking) {
                delete parking[snap.key]
            }
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
    })
}

export const getData = async () => {
    try {
        const PURef = firebase.database().ref("users")
        const PRef = firebase.database().ref("providers")
        const PARef = firebase.database().ref("parkingAreas")
        const BRef = firebase.database().ref("bookings")

        let usero = {}
        usero.count = 0
        await getCounts(PURef, usero)
        let nusers = usero.count
        let providero = {}
        providero.count = 0
        await getCounts(PRef, providero)
        let nproviders = providero.count
        let pareas = {}
        await getParkings(PARef, pareas)
        let nparkings = Object.keys(pareas).length
        let totalRevenue = 0;
        let y;
        if (Object.keys(pareas).length !== 0) {
            for (const key in pareas) {
                let pareainfo = pareas[key]
                y = 0;
                for (let i in pareainfo.carrevenue) {
                    y = y + pareainfo.carrevenue[i];
                }
                totalRevenue = totalRevenue + y;
            }
        }
        let bookingo = {}
        bookingo.count = 0
        await getCounts(BRef, bookingo)
        let nbookings = bookingo.count
        data = [nusers, nparkings, nbookings, nproviders, totalRevenue]
        return data;
    } catch (error) {
        throw error;
    }
}