import Identification from "@/components/identification";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Identification | SyncUp",
};

export default function Home(): React.JSX.Element {
  return (
    <Identification />
  );
}
