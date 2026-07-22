import { getTranslations } from "next-intl/server";

import { listConversations } from "@/lib/data";
import { StudioPageHeader } from "@/features/studio-shell/components/studio-page-header";

import { MessagesInbox } from "./messages-inbox";

export async function MessagesStudioPage() {
  const t = await getTranslations("MessagesStudio");
  const conversations = await listConversations().catch(() => []);

  return (
    <div className="space-y-6">
      <StudioPageHeader
        title={t("title")}
        description={t("description")}
      />
      <MessagesInbox initialConversations={conversations} />
    </div>
  );
}
