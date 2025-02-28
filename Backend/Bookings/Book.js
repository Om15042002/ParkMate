import firebase from '../myFirebase'


const getParking = (PRef, parking) => {
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


export const bookParking = async (bookingData) => {
    try {
        const PRef = firebase.database().ref("parkingAreas/" + bookingData.parkingid)
        const BRef = firebase.database().ref("bookings")
        let parking = {}
        await getParking(PRef, parking)
        if (Object.keys(parking).length !== 0) {
            var carrevenue = { ...parking.carrevenue }
            var cartraffic = { ...parking.cartraffic }
            carrevenue[bookingData.car] = carrevenue[bookingData.car] + bookingData.payment
            cartraffic[bookingData.car] = cartraffic[bookingData.car] + bookingData.dates.length
            let updatedData = { ...parking, carrevenue: carrevenue, cartraffic: cartraffic }
            await PRef.update({ carrevenue: carrevenue, cartraffic: cartraffic })
        }
        await BRef.push().set(bookingData)
        return true
    } catch (error) {
        throw error;
    }
}
