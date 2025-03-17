import firebase from '../myFirebase'

export default postQuery=async (query)=>{
    try {
        const queryRef=firebase.database().ref("queries")
        await queryRef.push().set(query)
    } catch (error) {
        throw error;
    }
}
