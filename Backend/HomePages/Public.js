import firebase from '../myFirebase'

const getCounts = (DBRef, counts) => {
    return new Promise(async (resolve, reject) => {
        let data = await DBRef.limitToFirst(1).once("value")
        if (data.val() == null) {
            return resolve(null)
        }
        DBRef.on("child_added", async (snap, prev) => {
            if (snap.val().dates.length > 1) {
                counts.nsubscriptions += 1
            }
            else {
                counts.nbookings += 1
            }
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
            if (snap.val().dates.length > 1) {
                counts.nsubscriptions -= 1
            }
            else {
                counts.nbookings -= 1
            }
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

export const getData = async (userId, clocation) => {
    const getDistance = (plocation, clocation) => {
        var R = 6371.0710;
        var rlat1 = plocation.latitude * (Math.PI / 180);
        var rlat2 = clocation.latitude * (Math.PI / 180);
        var difflat = rlat2 - rlat1;
        var rlon1 = plocation.longitude * (Math.PI / 180);
        var rlon2 = clocation.longitude * (Math.PI / 180);
        var difflon = rlon2 - rlon1;
        var distance = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
        return (distance)
    }
    const filterByDistance = (plocation, clocation) => {
        var distance = getDistance(plocation, clocation)
        return (distance <= 5)
    }
    try {
        const BRef = firebase.database().ref("bookings").orderByChild("userid").equalTo(userId)
        let bookingssubscriptions = {}
        bookingssubscriptions.nbookings = 0
        bookingssubscriptions.nsubscriptions = 0
        await getCounts(BRef, bookingssubscriptions)
        let locations = []
        if (clocation !== null) {
            const PARef = firebase.database().ref("parkingAreas")
            let parkings = {}
            await getParkings(PARef, parkings)
            if (Object.keys(parkings).length !== 0) {
                for (let key in parkings) {
                    if (filterByDistance(parkings[key].location, clocation)) {
                        let parking = { servicename: parkings[key].servicename, cartype: parkings[key].cartypes, location: parkings[key].location, ratings: parkings[key].ratings }
                        locations.push(parking)
                    }
                }
            }
            locations.sort((a, b) => {
                if ((b.ratings - a.ratings) == 0) {
                    return getDistance(clocation, a.location) - getDistance(clocation, b.location)
                }
                return b.ratings - a.ratings
            })
        }
        let bookings = bookingssubscriptions.nbookings
        let subscriptions = bookingssubscriptions.nsubscriptions
        if (locations.length > 3) {
            return [bookings, subscriptions, [locations[0], locations[1], locations[2]]];
        }
        if (locations.length > 0) {
            return [bookings, subscriptions, locations];
        }
        else {
            return [bookings, subscriptions, null];
        }
    } catch (error) {
        throw error;
    }
}