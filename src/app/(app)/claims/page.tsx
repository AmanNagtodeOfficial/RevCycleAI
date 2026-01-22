import { claims } from "@/lib/data"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ClaimsPage() {
  const data = claims;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Claims"
        description="Track, manage, and resolve all your medical claims."
        action={
            <Link href="/claims/new" passHref>
                <Button>New Claim</Button>
            </Link>
        }
      />
      <DataTable columns={columns} data={data} />
    </div>
  )
}
