import React, { useContext, useLayoutEffect } from 'react'
import { userContext } from '../../App'
import { updateUserProfile, updateProviderProfile } from '../../Backend/Authentication/Logout'

export var changed = { changed: false }
function LogoutScreen() {
    const currentUser = useContext(userContext)
    useLayoutEffect(() => {
        try {
            let profile = {
                name: currentUser.user.name, username: currentUser.user.username, gender: currentUser.user.gender, emailid: currentUser.user.emailid, contactno: currentUser.user.contactno, profilepicture: currentUser.user.profilepictureloc, password: currentUser.user.password
            }
            let profilepicture = currentUser.user.profilepicture
            const updateProfile = async () => {
                if (currentUser.user.usertype === "Public") {
                    await updateUserProfile(currentUser.user.id, profile, profilepicture)
                }
                else {
                    await updateProviderProfile(currentUser.user.id, profile, profilepicture)
                }
            }
            currentUser.setUser({ usertype: "", id: "", name: "", username: "", gender: "", emailid: "", contactno: "", profilepicture: null, profilepictureloc: null, password: "" })
            if (changed.changed) {
                updateProfile();
            }
        }
        catch (error) { }
    }, [])
    return (
        <></>
    )
}

export default LogoutScreen