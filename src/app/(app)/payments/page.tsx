import { PageHeader } from "@/components/page-header";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function PaymentsPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Payments" description="Track and manage all payments and remittances." />
            <PlaceholderPage title="Coming Soon" description="Payment posting, ERA/EOB management, and reconciliation features will be available here." />
        </div>
    )
}
