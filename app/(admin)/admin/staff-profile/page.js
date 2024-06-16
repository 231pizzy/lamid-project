import StaffHome from "@/Components/StaffProfileTemplate";

export default function Page() {
    return <StaffHome {...{ myProfile: false }} />
}