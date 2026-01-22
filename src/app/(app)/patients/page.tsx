import { PageHeader } from "@/components/page-header";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function PatientsPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Patients" description="Manage patient demographics and insurance information." />
            <PlaceholderPage title="Coming Soon" description="Patient registration, search, and management features will be available here." />
        </div>
    )
}
