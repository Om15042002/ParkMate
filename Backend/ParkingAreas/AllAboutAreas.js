import firebase from '../myFirebase'

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

const getBookings = (BRef, booking) => {
    return new Promise(async (resolve, reject) => {
        let data = await BRef.limitToFirst(1).once("value")
        if (data.val() == null) {
            return resolve(null)
        }
        BRef.on("child_added", async (snap, prev) => {
            booking[snap.key] = snap.val()
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        BRef.on("child_changed", async (snap) => {
            booking[snap.key] = snap.val()
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        BRef.on("child_removed", async (snap) => {
            if (snap.key in booking) {
                delete booking[snap.key]
            }
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
    })
}


export const registerNewParking = async (parkingData) => {
    try {
        const PARef = firebase.database().ref("parkingAreas")
        const PAIRef = firebase.database().ref("paimages")
        let image = parkingData.areaimage
        let k = await PAIRef.push({ image: image })
        await PARef.push().set({ ...parkingData, areaimage: k.key })
        return true;
    } catch (error) {
        throw error;
    }
}


export const getParkingArea = async (providerId, status) => {
    try {
        const PARef = firebase.database().ref("parkingAreas").orderByChild("providerid").equalTo(providerId)
        let pareas = {}
        await getParkings(PARef, pareas)
        let areas = [];
        if (Object.keys(pareas).length !== 0) {
            for (let key in pareas) {
                let tstatus = pareas[key].status
                if (tstatus === "Cancelled") {
                    if (new Date(pareas[key].cancelleddate) > new Date()) {
                        tstatus = "Working"
                    }
                }
                if (tstatus == status) {
                    let PAIRef = firebase.database().ref("paimages/" + pareas[key].areaimage)
                    let image = {}
                    await getImage(PAIRef, image)
                    let img = null;
                    if (Object.keys(image).length !== 0) {
                        for (let k in image) {
                            img = image[k]
                        }
                    }
                    let data = { id: key, ...pareas[key], areaimage: img, areaimageloc: pareas[key].areaimage };
                    areas.push(data);
                }
            }
        }
        if (areas.length == 0) {
            return null
        }
        return areas;
    } catch (error) {
        throw error;
    }
}

export const editParkingAreaInfo = async (updatedArea) => {
    try {
        let data = updatedArea.data
        let areaimageloc = data.areaimageloc
        delete data["areaimage"]
        delete data["areaimageloc"]
        await firebase.database().ref("parkingAreas/" + updatedArea.id).update({ ...updatedArea.data, areaimage: areaimageloc })
        return true;
    } catch (error) {
        throw error;
    }
}

export const editParkingPicture = async (updatedArea) => {
    try {
        let imgloc = updatedArea.data.areaimageloc
        await firebase.database().ref("paimages/" + imgloc).update({ image: updatedArea.data.areaimage })
        return true;
    } catch (error) {
        throw error;
    }
}


export const cancelParkingArea = async (cancelAreaInfo, parkingAreaStatus, area_id) => {
    try {
        if (parkingAreaStatus == "Pending") {
            cancelAreaInfo = { ...cancelAreaInfo, status: "Approved", parking_id: area_id };
            await firebase.database().ref("cancelledAreas").push().set(cancelAreaInfo)
            await firebase.database().ref("parkingAreas/" + cancelAreaInfo.parkingareaid).update({ status: "Cancelled", cancelleddate: cancelAreaInfo.cancellationdate })
            return true;
        }
        else {
            let BRef = firebase.database().ref("bookings").orderByChild("parkingid").equalTo(cancelAreaInfo.parkingareaid)
            let bookings = {}
            await getBookings(BRef, bookings)
            let lastBookedDate = new Date();
            if (Object.keys(bookings).length !== 0) {
                for (let key in bookings) {
                    for (let date of bookings[key].dates) {
                        if (lastBookedDate < new Date(date)) {
                            lastBookedDate = new Date(date);
                        }
                    }x
                }
            }
            if (new Date(cancelAreaInfo.cancellationdate) > lastBookedDate) {
                cancelAreaInfo = { ...cancelAreaInfo, status: "Pending", parking_id: area_id };
                await firebase.database().ref("cancelledAreas").push().set(cancelAreaInfo)
                await firebase.database().ref("parkingAreas/" + cancelAreaInfo.parkingareaid).update({ status: "Cancelled", cancelleddate: cancelAreaInfo.cancellationdate })
                return true;
            }
            else
                return false;
        }

    } catch (error) {
        throw error;
    }
}


