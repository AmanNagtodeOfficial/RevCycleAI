import { PageHeader } from "@/components/page-header";
import { PlaceholderPage } from "@/components/placeholder-page";

// This page's content has been moved to the main /payments page under a tab.
// This file can be removed in the future.
export default function ManualEobPostingPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Manual Payment Posting" description="This section has moved." />
            <PlaceholderPage title="Moved" description="The Manual EOB Posting functionality can now be found under the 'Payments' page in the 'Manual EOB Posting' tab." />
        </div>
    )
}
