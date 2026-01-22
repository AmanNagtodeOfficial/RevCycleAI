import { PageHeader } from "@/components/page-header";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Analytics" description="Deep dive into your revenue cycle performance." />
            <PlaceholderPage title="Coming Soon" description="Advanced analytics and insights will be available here." />
        </div>
    )
}
