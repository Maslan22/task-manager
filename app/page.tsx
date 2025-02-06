
import { redirect } from "next/navigation";
import { requireUser } from "./utils/requireuser";
import { Hero } from "./frontend/Hero";
import { Features } from "./frontend/Features";
import { Logos } from "./frontend/logos";

export default async function Home() {
  
  // const session = await requireUser();

  // if (session?.user.id) {
  //   return redirect("/dashboard");
  // }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <Hero />
      <Logos />
      <Features />
      {/* <PricingTable /> */}
    </div>
  );
}
