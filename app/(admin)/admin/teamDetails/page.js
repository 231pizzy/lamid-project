import TeamDetails from "./TeamDetails";
// import TeamData from "./TeamDetails";


export default function Page() {
    return <TeamDetails />
}

// import dynamic from 'next/dynamic';

// const TeamDetails = dynamic(() => import('./TeamDetails'), { ssr: false });
// import { useRouter } from 'next/router';

// export default function Page() {
//     const router = useRouter();
//     const { id, name, color } = router.query;

//     return <TeamDetails id={id} name={name} color={color} />;
// }
