import { PageHeader } from "@/components/page-header";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function CodingPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="AI Coder" description="Generate accurate medical codes from clinical notes instantly." />
            <PlaceholderPage title="Coming Soon" description="The AI Coder will help you find the right codes based on clinical notes." />
        </div>
    )
}
