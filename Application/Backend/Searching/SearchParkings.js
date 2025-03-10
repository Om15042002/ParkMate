import Bookings from '../../Screens/UserScreens/Bookings'
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

export const searchByCity = async (searchData) => {
    try {
        const PARef = firebase.database().ref("parkingAreas").orderByChild("city").equalTo(searchData.city)
        let parkings = {}
        await getParkings(PARef, parkings)
        if (Object.keys(parkings).length === 0) {
            return null
        }
        var start = searchData.datetime;
        start.setSeconds(0)
        var end = new Date(start)
        end.setHours(start.getHours() + parseInt(searchData.duration))
        end.setSeconds(0)
        if (searchData.duration % 1 != 0) {
            end.setMinutes(start.getMinutes() + 30)
        }
        var locations = []
        const BRef = firebase.database().ref("bookings").orderByChild("parkingid")
        for (let key in parkings) {
            if (parkings[key].status === "Pending") { continue }
            if (parkings[key].status === "Cancelled") {
                if (new Date(parkings[key].cancelleddate) < end) {
                    continue
                }
            }
            if (parkings[key].cartypes.includes(searchData.car) && parkings[key].carservices[searchData.car] === "Working") {
                let bookings = {}
                let PBRef = BRef.equalTo(key)
                await getBookings(PBRef, bookings)
                var index = parkings[key].cartypes.indexOf(searchData.car)
                var count = 0;
                if (Object.keys(bookings).length !== 0) {
                    for (let k in bookings) {
                        if (bookings[k].car === searchData.car) {
                            for (let date of bookings[k].dates) {
                                var tdatestart = new Date(date)
                                var tdateend = new Date(date)
                                if (bookings[k].duration % 1 != 0) {
                                    tdateend.setHours(tdatestart.getHours() + parseInt(bookings[k].duration))
                                    tdateend.setMinutes(tdatestart.getMinutes() + 30)
                                }
                                else {
                                    tdateend.setHours(tdatestart.getHours() + parseInt(bookings[k].duration))
                                }
                                if (start < tdateend && end > tdatestart) {
                                    count++;
                                }
                            }
                        }
                    }
                }
                if (parkings[key].capacities[index] - count > 0) {
                    let providers = await firebase.database().ref("providers").orderByKey().equalTo(parkings[key].providerid).once("value")
                    let provider;
                    for (const p in providers.val()) {
                        provider = providers.val()[p]
                    }
                    const paiRef = firebase.database().ref("paimages/" + parkings[key].areaimage)
                    let image = {}
                    await getImage(paiRef, image)
                    let img = null
                    if (Object.keys(image).length !== 0) {
                        for (const key in image) {
                            img = image[key]
                        }
                    }
                    let parking = { serviceid: key, servicename: parkings[key].servicename, providername: provider.name, availbale: "yes", cartype: parkings[key].cartypes, rates: parkings[key].rates, capacities: parkings[key].capacities, city: parkings[key].city, location: parkings[key].location, ratings: parkings[key].ratings, address: parkings[key].address, areaimage: img }
                    locations.push(parking)
                }
            }
        }
        if (locations.length == 0) {
            return null
        }
        locations.sort((a, b) => {
            return b.ratings - a.ratings
        })
        return locations;
    } catch (error) {
        throw error;
    }
}

export const searchNearBy = async (searchData) => {
    const filterByDistance = (plocation, clocation) => {
        var R = 6371.0710;
        var rlat1 = plocation.latitude * (Math.PI / 180);
        var rlat2 = clocation.latitude * (Math.PI / 180);
        var difflat = rlat2 - rlat1;
        var rlon1 = plocation.longitude * (Math.PI / 180);
        var rlon2 = clocation.longitude * (Math.PI / 180);
        var difflon = rlon2 - rlon1;
        var distance = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
        return (distance <= 5)
    }
    try {
        const PARef = firebase.database().ref("parkingAreas")
        let parkings = {}
        await getParkings(PARef, parkings)
        if (Object.keys(parkings).length === 0) {
            return null
        }
        var start = searchData.datetime;
        start.setSeconds(0)
        var end = new Date(start)
        end.setHours(start.getHours() + parseInt(searchData.duration))
        end.setSeconds(0)
        if (searchData.duration % 1 != 0) {
            end.setMinutes(start.getMinutes() + 30)
        }
        var locations = []
        const BRef = firebase.database().ref("bookings").orderByChild("parkingid")
        for (let key in parkings) {
            if (parkings[key].status === "Pending") { continue }
            if (parkings[key].status === "Cancelled") {
                if (new Date(parkings[key].cancelleddate) < end) {
                    continue
                }
            }
            if (parkings[key].cartypes.includes(searchData.car) && parkings[key].carservices[searchData.car] === "Working" && filterByDistance(parkings[key].location, searchData.clocation)) {
                let bookings = {}
                let PBRef = BRef.equalTo(key)
                await getBookings(PBRef, bookings)
                var index = parkings[key].cartypes.indexOf(searchData.car)
                var count = 0;
                if (Object.keys(bookings).length !== 0) {
                    for (let k in bookings) {
                        if (bookings[k].car === searchData.car) {
                            for (let date of bookings[k].dates) {
                                var tdatestart = new Date(date)
                                var tdateend = new Date(date)
                                if (bookings[k].duration % 1 != 0) {
                                    tdateend.setHours(tdatestart.getHours() + parseInt(bookings[k].duration))
                                    tdateend.setMinutes(tdatestart.getMinutes() + 30)
                                }
                                else {
                                    tdateend.setHours(tdatestart.getHours() + parseInt(bookings[k].duration))
                                }
                                if (start < tdateend && end > tdatestart) {
                                    count++;
                                }
                            }
                        }
                    }
                }
                if ((parkings[key].capacities[index] - count > 0)) {
                    let providers = await firebase.database().ref("providers").orderByKey().equalTo(parkings[key].providerid).once("value")
                    let provider;
                    for (const p in providers.val()) {
                        provider = providers.val()[p]
                    }
                    const paiRef = firebase.database().ref("paimages/" + parkings[key].areaimage)
                    let image = {}
                    await getImage(paiRef, image)
                    let img = null
                    if (Object.keys(image).length !== 0) {
                        for (const key in image) {
                            img = image[key]
                        }
                    }
                    let parking = { serviceid: key, servicename: parkings[key].servicename, providername: provider.name, availbale: "yes", cartype: parkings[key].cartypes, rates: parkings[key].rates, capacities: parkings[key].capacities, city: parkings[key].city, location: parkings[key].location, ratings: parkings[key].ratings, address: parkings[key].address, areaimage: img }
                    locations.push(parking)
                }
            }
        }
        if (locations.length == 0) {
            return null
        }
        locations.sort((a, b) => {
            return b.ratings - a.ratings
        })
        return locations;
    } catch (error) {
        throw error;
    }
}

export const checkAvailibility = async (checkingData) => {
    try {
        let PRef = firebase.database().ref("parkingAreas/" + checkingData.parkingid)
        let parking = {}
        await getParkings(PRef, parking)
        if (parking.status === "Pending" || parking.carservices[checkingData.car] === "Pending") {
            return false
        }
        let BRef = firebase.database().ref("bookings").orderByChild("parkingid").equalTo(checkingData.parkingid)
        let bookings = {}
        await getBookings(BRef, bookings)
        let datescounts = {}
        console.log("booking is runnnig")
        if(bookings == undefined || bookings == null){
            
            console.log("if booking")
            console.log(bookings)
        }
        if (Object.keys(bookings).length !== 0) {
            for (let key in bookings) {
                if (bookings[key].car === checkingData.car) {
                    for (let date of bookings[key].dates) {
                        var tdatestart = new Date(date)
                        var tdateend = new Date(date)
                        if (bookings[key].duration % 1 != 0) {
                            tdateend.setHours(tdatestart.getHours() + parseInt(bookings[key].duration))
                            tdateend.setMinutes(tdatestart.getMinutes() + 30)
                        }
                        else {
                            tdateend.setHours(tdatestart.getHours() + parseInt(bookings[key].duration))
                        }
                        for (let cdate of checkingData.dates) {
                            var start = new Date(cdate);
                            start.setSeconds(0)
                            var end = new Date(start)
                            end.setHours(start.getHours() + parseInt(checkingData.duration))
                            end.setSeconds(0)
                            if (checkingData.duration % 1 != 0) {
                                end.setMinutes(start.getMinutes() + 30)
                            }
                            if (parking.status === "Cancelled") {
                                if (new Date(parking.cancelleddate) < end) {
                                    return false
                                }
                            }
                            if (start < tdateend && end > tdatestart) {
                                if (!datescounts[cdate]) {
                                    datescounts[cdate] = 1;
                                }
                                else {
                                    datescounts[cdate] = datescounts[cdate] + 1;
                                }
                            }
                        }
                    }
                }
            }
        }
        var index = parking.cartypes.indexOf(checkingData.car)
        let capacity = parking.capacities[index]
        for (let k in datescounts) {
            if (capacity - datescounts[k] < 1) {
                return false;
            }
        }
        return true;
    } catch (error) {
        throw error;
    }
}

export const checkAvailibilityForEdit = async (checkingData) => {
    try {
        let PRef = firebase.database().ref("parkingAreas/" + checkingData.parkingid)
        let parking = {}
        await getParkings(PRef, parking)
        if (parking.status === "Pending" || parking.carservices[checkingData.car] === "Pending") {
            return false
        }
        let BRef = firebase.database().ref("bookings").orderByChild("parkingid").equalTo(checkingData.parkingid)
        let bookings = {}
        await getBookings(BRef, bookings)
        var start = new Date(checkingData.datetime);
        start.setSeconds(0)
        var end = new Date(start)
        end.setHours(start.getHours() + parseInt(checkingData.duration))
        end.setSeconds(0)
        if (checkingData.duration % 1 != 0) {
            end.setMinutes(start.getMinutes() + 30)
        }
        if (parking.status === "Cancelled") {
            if (new Date(parking.cancelleddate) < end) {
                return false
            }
        }
        let datescounts = {}
        if (Object.keys(bookings).length !== 0) {
            for (let key in bookings) {
                if (key != checkingData.bookingid && bookings[key].car === checkingData.car) {
                    for (let date of bookings[key].dates) {
                        var tdatestart = new Date(date)
                        var tdateend = new Date(date)
                        if (bookings[key].duration % 1 != 0) {
                            tdateend.setHours(tdatestart.getHours() + parseInt(bookings[key].duration))
                            tdateend.setMinutes(tdatestart.getMinutes() + 30)
                        }
                        else {
                            tdateend.setHours(tdatestart.getHours() + parseInt(bookings[key].duration))
                        }
                        if (start < tdateend && end > tdatestart) {
                            if (!datescounts[checkingData.datetime]) {
                                datescounts[checkingData.datetime] = 1;
                            }
                            else {
                                datescounts[checkingData.datetime] = datescounts[checkingData.datetime] + 1;
                            }
                        }
                    }
                }
            }
        }
        var index = parking.cartypes.indexOf(checkingData.car)
        let capacity = parking.capacities[index]
        for (let k in datescounts) {
            if (capacity - datescounts[k] < 1) {
                return false;
            }
        }
        let booking = bookings[checkingData.bookingid]
        let payment = booking.payment
        let duration = booking.duration
        payment = parseInt((checkingData.duration * payment) / duration)

        var carrevenue = { ...parking.carrevenue }
        carrevenue[booking.car] = carrevenue[booking.car] - booking.payment + payment
        await PRef.update({ carrevenue: carrevenue })
        await firebase.database().ref("bookings/" + checkingData.bookingid).update({ dates: [checkingData.datetime.toString()], duration: checkingData.duration, carnumber: checkingData.carnumber, payment: payment })
        return true;
    } catch (error) {
        throw error;
    }
}


export const checkAvailibilityForEditSubscription = async (checkingData) => {
    try {
        let PRef = firebase.database().ref("parkingAreas/" + checkingData.parkingid)
        let parking = {}
        await getParkings(PRef, parking)
        if (parking.status === "Pending" || parking.carservices[checkingData.car] === "Pending") {
            return false
        }
        let BRef = firebase.database().ref("bookings").orderByChild("parkingid").equalTo(checkingData.parkingid)
        let bookings = {}
        await getBookings(BRef, bookings)
        var start = new Date(checkingData.datetime);
        start.setSeconds(0)
        var end = new Date(start)
        end.setHours(start.getHours() + parseInt(checkingData.duration))
        end.setSeconds(0)
        if (checkingData.duration % 1 != 0) {
            end.setMinutes(start.getMinutes() + 30)
        }
        let datescounts = {}
        if (Object.keys(bookings).length !== 0) {
            for (let key in bookings) {
                if (key != checkingData.bookingid && bookings[key].car === checkingData.car) {
                    for (let date of bookings[key].dates) {
                        var tdatestart = new Date(date)
                        var tdateend = new Date(date)
                        if (bookings[key].duration % 1 != 0) {
                            tdateend.setHours(tdatestart.getHours() + parseInt(bookings[key].duration))
                            tdateend.setMinutes(tdatestart.getMinutes() + 30)
                        }
                        else {
                            tdateend.setHours(tdatestart.getHours() + parseInt(bookings[key].duration))
                        }
                        for (let cdate of checkingData.dates) {
                            var start = new Date(cdate);
                            start.setSeconds(0)
                            var end = new Date(start)
                            end.setHours(start.getHours() + parseInt(checkingData.duration))
                            end.setSeconds(0)
                            if (checkingData.duration % 1 != 0) {
                                end.setMinutes(start.getMinutes() + 30)
                            }
                            if (parking.status === "Cancelled") {
                                if (new Date(parking.cancelleddate) < end) {
                                    return false
                                }
                            }
                            if (start < tdateend && end > tdatestart) {
                                if (!datescounts[cdate]) {
                                    datescounts[cdate] = 1;
                                }
                                else {
                                    datescounts[cdate] = datescounts[cdate] + 1;
                                }
                            }
                        }
                    }
                }
            }
        }
        var index = parking.cartypes.indexOf(checkingData.car)
        let capacity = parking.capacities[index]
        for (let k in datescounts) {
            if (capacity - datescounts[k] < 1) {
                return false;
            }
        }
        let booking = bookings[checkingData.bookingid]
        let payment = booking.payment
        let duration = booking.duration * booking.dates.length
        payment = parseInt((checkingData.duration * checkingData.dates.length * payment) / duration)
        var carrevenue = { ...parking.carrevenue }
        var cartraffic = { ...parking.cartraffic }
        carrevenue[booking.car] = carrevenue[booking.car] - booking.payment + payment
        cartraffic[booking.car] = cartraffic[booking.car] - booking.dates.length + checkingData.dates.length
        await PRef.update({ carrevenue: carrevenue, cartraffic: cartraffic })
        await firebase.database().ref("bookings/" + checkingData.bookingid).update({ dates: checkingData.dates, days: checkingData.days, duration: checkingData.duration, carnumber: checkingData.carnumber, payment: payment })
        return true;
    } catch (error) {
        throw error;
    }
}



export const checkAvailibilityForRepeatSubscription = async (checkingData) => {
    try {
        let PRef = firebase.database().ref("parkingAreas/" + checkingData.parkingid)
        let parking = {}
        await getParkings(PRef, parking)
        if (parking.status === "Pending" || parking.carservices[checkingData.car] === "Pending") {
            return false
        }
        let BRef = firebase.database().ref("bookings").orderByChild("parkingid").equalTo(checkingData.parkingid)
        let bookings = {}
        await getBookings(BRef, bookings)
        var start = new Date(checkingData.datetime);
        start.setSeconds(0)
        var end = new Date(start)
        end.setHours(start.getHours() + parseInt(checkingData.duration))
        end.setSeconds(0)
        if (checkingData.duration % 1 != 0) {
            end.setMinutes(start.getMinutes() + 30)
        }
        let datescounts = {}
        if (Object.keys(bookings).length !== 0) {
            for (let key in bookings) {
                if (bookings[key].car === checkingData.car) {
                    for (let date of bookings[key].dates) {
                        var tdatestart = new Date(date)
                        var tdateend = new Date(date)
                        if (bookings[key].duration % 1 != 0) {
                            tdateend.setHours(tdatestart.getHours() + parseInt(bookings[key].duration))
                            tdateend.setMinutes(tdatestart.getMinutes() + 30)
                        }
                        else {
                            tdateend.setHours(tdatestart.getHours() + parseInt(bookings[key].duration))
                        }
                        for (let cdate of checkingData.dates) {
                            var start = new Date(cdate);
                            start.setSeconds(0)
                            var end = new Date(start)
                            end.setHours(start.getHours() + parseInt(checkingData.duration))
                            end.setSeconds(0)
                            if (checkingData.duration % 1 != 0) {
                                end.setMinutes(start.getMinutes() + 30)
                            }
                            if (parking.status === "Cancelled") {
                                if (new Date(parking.cancelleddate) < end) {
                                    return false
                                }
                            }
                            if (start < tdateend && end > tdatestart) {
                                if (!datescounts[cdate]) {
                                    datescounts[cdate] = 1;
                                }
                                else {
                                    datescounts[cdate] = datescounts[cdate] + 1;
                                }
                            }
                        }
                    }
                }
            }
        }
        var index = parking.cartypes.indexOf(checkingData.car)
        let capacity = parking.capacities[index]
        for (let k in datescounts) {
            if (capacity - datescounts[k] < 1) {
                return false;
            }
        }
        let booking = bookings[checkingData.bookingid]
        var carrevenue = { ...parking.carrevenue }
        var cartraffic = { ...parking.cartraffic }
        carrevenue[booking.car] = carrevenue[booking.car] + booking.payment
        cartraffic[booking.car] = cartraffic[booking.car] + booking.dates.length
        await PRef.update({ carrevenue: carrevenue, cartraffic: cartraffic })
        let newData = { ...booking, dates: checkingData.dates, days: checkingData.days, duration: checkingData.duration, carnumber: checkingData.carnumber, payment: booking.payment }
        await firebase.database().ref("bookings").push().set(newData)
        return true;
    } catch (error) {
        throw error;
    }
}