import { PageHeader } from "@/components/page-header";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function NewInsurancePage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Add New Insurance Plan" description="Onboard a new payer plan and configure its details." />
            <PlaceholderPage title="Coming Soon" description="A form to add new insurance plans will be available here." />
        </div>
    )
}
