import { PageHeader } from "@/components/page-header";
import { PlaceholderPage } from "@/components/placeholder-page";
import { insurancePlans } from "@/lib/insurance-data";
import { notFound } from "next/navigation";

export default function InsuranceDetailPage({ params }: { params: { id: string } }) {
    const plan = insurancePlans.find(p => p.id === params.id);

    if (!plan) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <PageHeader title={plan.planName} description={`Details for ${plan.payerName} plan.`} />
            <PlaceholderPage title="Coming Soon" description="Detailed plan analytics, fee schedules, and associated claims will be displayed here." />
        </div>
    )
}
