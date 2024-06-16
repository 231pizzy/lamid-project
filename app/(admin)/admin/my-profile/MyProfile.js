
import StaffHome from "@/Components/StaffProfileTemplate"

export default function MyProfile() {
    return <StaffHome {...{ myProfile: true }} />
}