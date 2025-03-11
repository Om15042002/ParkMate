import firebase from "../myFirebase";

const getParkings = (PRef, parking) => {
  return new Promise(async (resolve, reject) => {
    let data = await PRef.limitToFirst(1).once("value");
    if (data.val() == null) {
      return resolve(null);
    }
    PRef.on(
      "child_added",
      async (snap, prev) => {
        parking[snap.key] = snap.val();
        return resolve(true);
      },
      (err) => {
        return reject(err);
      }
    );
    PRef.on(
      "child_changed",
      async (snap) => {
        parking[snap.key] = snap.val();
        return resolve(true);
      },
      (err) => {
        return reject(err);
      }
    );
    PRef.on(
      "child_removed",
      async (snap) => {
        if (snap.key in parking) {
          delete parking[snap.key];
        }
        return resolve(true);
      },
      (err) => {
        return reject(err);
      }
    );
  });
};

export const getData = async (providerId) => {
  try {
    const PARef = firebase
      .database()
      .ref("parkingAreas")
      .orderByChild("providerid")
      .equalTo(providerId);
    let pareas = {};
    await getParkings(PARef, pareas);
    let parkingareas = Object.keys(pareas).length;
    let totalRevenue = 0;
    let y;
    let areas = [];
    if (Object.keys(pareas).length !== 0) {
      for (const key in pareas) {
        let pareainfo = pareas[key];
        y = 0;
        for (let i in pareainfo.carrevenue) {
          y = y + pareainfo.carrevenue[i];
        }
        totalRevenue = totalRevenue + y;
        let item = {
          servicename: pareainfo.servicename,
          ratings: pareainfo.ratings,
          revenue: y,
        };
        areas.push(item);
      }
    }
    areas.sort((a, b) => {
      if (b.revenue - a.revenue == 0) {
        return b.ratings - a.ratings;
      }
      return b.revenue - a.revenue;
    });
    if (areas.length > 3) {
      return [parkingareas, totalRevenue, [areas[0], areas[1], areas[2]]];
    }
    if (areas.length > 0) {
      return [parkingareas, totalRevenue, areas];
    } else {
      return [parkingareas, totalRevenue, null];
    }
  } catch (error) {
    throw error;
  }
};
