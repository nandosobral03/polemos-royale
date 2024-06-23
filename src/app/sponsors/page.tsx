import { api } from "@/trpc/server";
import SponsorCard from "../_components/teams/sponsor-card";
import PageHeading from "../_components/utils/page-heading";

export default async function Sponsors() {
  const sponsors = await api.sponsors.getAll();
  return (
    <>
      <PageHeading
        title="Sponsors"
        subtitle="Sponsors are behind one or more teams, they take the credit for the wins and losses. They have no control over the battle royale, nor do they have any influence on the outcome of the game."
      />
      <div className="flex flex-wrap justify-center gap-4">
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} />
        ))}
      </div>
    </>
  );
}
