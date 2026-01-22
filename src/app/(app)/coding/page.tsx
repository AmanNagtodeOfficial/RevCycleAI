import { PageHeader } from "@/components/page-header";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function CodingPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="AI Coding Copilot" description="Streamline your coding process with AI-powered suggestions." />
            <PlaceholderPage title="Coming Soon" description="The AI Coding Copilot will help you find the right codes based on clinical notes." />
        </div>
    )
}
