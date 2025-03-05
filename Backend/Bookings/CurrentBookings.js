import firebase from '../myFirebase'

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

const getParking = (PARef, parking, id) => {
    return new Promise(async (resolve, reject) => {
        let data = await PARef.limitToFirst(1).once("value")
        if (data.val() == null) {
            return resolve(null)
        }
        PARef.on("child_added", async (snap, prev) => {
            parking[snap.key] = snap.val()
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        PARef.on("child_changed", async (snap) => {
            parking[snap.key] = snap.val()
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        PARef.on("child_removed", async (snap) => {
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

const getProvider = (PRef, provider, id) => {
    return new Promise(async (resolve, reject) => {
        let data = await PRef.limitToFirst(1).once("value")
        if (data.val() == null) {
            return resolve(null)
        }
        PRef.on("child_added", async (snap, prev) => {
            provider[snap.key] = snap.val()
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        PRef.on("child_changed", async (snap) => {
            provider[snap.key] = snap.val()
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
        PRef.on("child_removed", async (snap) => {
            if (snap.key in provider) {
                delete provider[snap.key]
            }
            return resolve(true)
        }, (err) => {
            return reject(err)
        })
    })
}

export const currentBookings = async (searchData) => {
    try {
        let BRef = firebase.database().ref("bookings").orderByChild("userid").equalTo(searchData.userid)
        let abookings = {}
        await getBookings(BRef, abookings)
        let bookings = []
        var current = searchData.datetime;
        current.setSeconds(0)
        if (Object.keys(abookings).length !== 0) {
            for (let key in abookings) {
                if (abookings[key].dates.length < 2) {
                    var tdatestart = new Date(abookings[key].dates[0])
                    var tdateend = new Date(abookings[key].dates[0])
                    if (abookings[key].duration % 1 != 0) {
                        tdateend.setHours(tdatestart.getHours() + parseInt(abookings[key].duration))
                        tdateend.setMinutes(tdatestart.getMinutes() + 30)
                    }
                    else {
                        tdateend.setHours(tdatestart.getHours() + parseInt(abookings[key].duration))
                    }
                    if (tdateend > current) {
                        let PARef = firebase.database().ref("parkingAreas/" + abookings[key].parkingid)
                        let parking = {}
                        await getParking(PARef, parking, abookings[key].parkingid)
                        let PRef = firebase.database().ref("providers/" + parking.providerid)
                        let provider = {}
                        await getProvider(PRef, provider, parking.providerid)
                        const paiRef = firebase.database().ref("paimages/" + parking.areaimage)
                        let image = {}
                        await getImage(paiRef, image)
                        let img = null
                        if (Object.keys(image).length !== 0) {
                            for (const key in image) {
                                img = image[key]
                            }
                        }
                        bookings.push({ ...abookings[key], id: key, parkingname: parking.servicename, providername: provider.name, date: new Date(tdatestart), destination: parking.location, city: parking.city, address: parking.address, areaimage: img })
                    }
                }
            }
        }
        if (bookings.length == 0) {
            return null
        }
        bookings.sort((a, b) => {
            return a.date - b.date
        })
        return bookings;
    } catch (error) {
        throw error;
    }
}




export const currentSubscriptions = async (searchData) => {
    try {
        let BRef = firebase.database().ref("bookings").orderByChild("userid").equalTo(searchData.userid)
        let abookings = {}
        await getBookings(BRef, abookings)
        let bookings = []
        var current = searchData.datetime;
        current.setSeconds(0)
        if (Object.keys(abookings).length !== 0) {
            for (let key in abookings) {
                if (abookings[key].dates.length > 1) {
                    abookings[key].dates.sort(function (a, b) {
                        const date1 = new Date(a)
                        const date2 = new Date(b)
                        return date1 - date2
                    })
                    for (let date of abookings[key].dates) {
                        var tdatestart = new Date(date)
                        var tdateend = new Date(date)
                        if (abookings[key].duration % 1 != 0) {
                            tdateend.setHours(tdatestart.getHours() + parseInt(abookings[key].duration))
                            tdateend.setMinutes(tdatestart.getMinutes() + 30)
                        }
                        else {
                            tdateend.setHours(tdatestart.getHours() + parseInt(abookings[key].duration))
                        }
                        if (tdateend > current) {
                            let PARef = firebase.database().ref("parkingAreas/" + abookings[key].parkingid)
                            let parking = {}
                            await getParking(PARef, parking, abookings[key].parkingid)
                            let PRef = firebase.database().ref("providers/" + parking.providerid)
                            let provider = {}
                            await getProvider(PRef, provider, parking.providerid)
                            const paiRef = firebase.database().ref("paimages/" + parking.areaimage)
                            let image = {}
                            await getImage(paiRef, image)
                            let img = null
                            if (Object.keys(image).length !== 0) {
                                for (const key in image) {
                                    img = image[key]
                                }
                            }
                            bookings.push({ ...abookings[key], id: key, parkingname: parking.servicename, providername: provider.name, upcomingdate: new Date(tdatestart), destination: parking.location, city: parking.city, address: parking.address, areaimage: img })
                            break;
                        }
                    }
                }
            }
        }
        if (bookings.length == 0) {
            return null
        }
        bookings.sort((a, b) => {
            return a.upcomingdate - b.upcomingdate
        })
        return bookings;
    } catch (error) {
        throw error;
    }
}


export const changeCarNumber = async (carData) => {
    try {
        let BRef = firebase.database().ref("bookings/" + carData.bookingid)
        await BRef.update({ carnumber: carData.carnumber })
        return true;
    } catch (error) {
        throw error;
    }
}



export const cancelBooking = async (bookingData) => {
    try {
        let BRef = firebase.database().ref("bookings/" + bookingData.bookingid)
        let booking = {}
        await getBookings(BRef, booking)
        let PRef = firebase.database().ref("parkingAreas/" + booking.parkingid)
        let parking = {}
        await getParking(PRef, parking, booking.parkingid)
        var carrevenue = { ...parking.carrevenue }
        var cartraffic = { ...parking.cartraffic }
        carrevenue[booking.car] = carrevenue[booking.car] - booking.payment
        cartraffic[booking.car] = cartraffic[booking.car] - booking.dates.length
        await PRef.update({ carrevenue: carrevenue, cartraffic: cartraffic })
        await BRef.remove()
        return true;
    } catch (error) {
        throw error;
    }
}

export const cancelSubscrption = async (bookingData) => {
    try {
        let BRef = firebase.database().ref("bookings/" + bookingData.bookingid)
        let booking = {}
        await getBookings(BRef, booking)
        let PRef = firebase.database().ref("parkingAreas/" + booking.parkingid)
        let parking = {}
        await getParking(PRef, parking, booking.parkingid)
        var carrevenue = { ...parking.carrevenue }
        var cartraffic = { ...parking.cartraffic }
        carrevenue[booking.car] = carrevenue[booking.car] - booking.payment
        cartraffic[booking.car] = cartraffic[booking.car] - booking.dates.length
        await PRef.update({ carrevenue: carrevenue, cartraffic: cartraffic })
        await BRef.remove()
        return true;
    } catch (error) {
        throw error;
    }
}