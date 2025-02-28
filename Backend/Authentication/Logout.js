import firebase from '../myFirebase'

export const updateUserProfile=async (id,userData,profilepicture)=>{
    try {
        const URef=firebase.database().ref("users/"+id)
        const UIRef=firebase.database().ref("uimages/"+userData.profilepicture)
        await URef.update({...userData})
        await UIRef.update({image:profilepicture})   
    } catch (error) {
        throw error;
    }
}

export const updateProviderProfile=async (id,providerData,profilepicture)=>{
    try {
        const PRef=firebase.database().ref("providers/"+id)
        const PIRef=firebase.database().ref("pimages/"+providerData.profilepicture)
        await PRef.update({...providerData})
        await PIRef.update({image:profilepicture})   
    } catch (error) {
        throw error;
    }
}