import { PageHeader } from "@/components/page-header";
import { PlaceholderPage } from "@/components/placeholder-page";
import { claims } from "@/lib/data";
import { notFound } from "next/navigation";


export default function ClaimDetailPage({ params }: { params: { id: string } }) {
  const claim = claims.find(c => c.id === params.id);

  if (!claim) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <PageHeader title={`Claim ${params.id}`} description={`Details for claim submitted for ${claim.patient} on ${claim.date}.`} />
      <PlaceholderPage title="Under Construction" description={`The detailed view for claim ${params.id} will be available here, including status timelines and AI-powered insights.`} />
    </div>
  );
}
