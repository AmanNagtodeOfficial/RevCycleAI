import { PageHeader } from "@/components/page-header";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function BillingPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Billing" description="Manage patient statements and collections." />
            <PlaceholderPage title="Coming Soon" description="Patient statement generation, billing inquiries, and collections workflows will be managed here." />
        </div>
    )
}
