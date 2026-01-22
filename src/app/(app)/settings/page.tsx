import { PageHeader } from "@/components/page-header";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Settings" description="Configure your application and manage your account." />
            <PlaceholderPage title="Coming Soon" description="User settings, team management, and integration options will be configured here." />
        </div>
    )
}
