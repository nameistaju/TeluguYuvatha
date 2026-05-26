import type { ContactMessage, NewsletterSubscriber } from "@telugu-yuvatha/shared";
import { DataTable } from "@/components/DataTable";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default async function EngagementPage() {
  const [messages, subscribers] = await Promise.all([
    api.get<ContactMessage[]>("/contact").catch(() => []),
    api.get<NewsletterSubscriber[]>("/newsletter").catch(() => [])
  ]);
  return (
    <Shell>
      <h1 className="mb-5 text-3xl font-semibold">Messages</h1>
      <div className="grid gap-6 xl:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Contact submissions</h2>
          <DataTable rows={messages} columns={[{ key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "subject", label: "Subject" }, { key: "status", label: "Status" }]} />
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold">Newsletter</h2>
          <DataTable rows={subscribers} columns={[{ key: "email", label: "Email" }, { key: "source", label: "Source" }, { key: "subscribed", label: "Subscribed", render: (row) => (row.subscribed ? "Yes" : "No") }]} />
        </section>
      </div>
    </Shell>
  );
}
