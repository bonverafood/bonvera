"use client";

import { useRouter } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { Conversation, ConversationWithMessages } from "@/lib/data";
import { cn } from "@/lib/utils";

import {
  getInboxConversation,
  markConversationStatus,
} from "../actions";

type MessagesInboxProps = {
  initialConversations: Conversation[];
};

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function MessagesInbox({ initialConversations }: MessagesInboxProps) {
  const t = useTranslations("MessagesStudio");
  const router = useRouter();
  const [items, setItems] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(
    initialConversations[0]?.id ?? null,
  );
  const [detail, setDetail] = useState<ConversationWithMessages | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const active = useMemo(
    () => items.find((c) => c.id === activeId) ?? null,
    [items, activeId],
  );

  function loadDetail(id: string) {
    setActiveId(id);
    setError(null);
    startTransition(async () => {
      const result = await getInboxConversation(id);
      if (!result.ok) {
        setError(result.error);
        setDetail(null);
        return;
      }
      setDetail(result.data);
      if (result.data.status === "new") {
        const marked = await markConversationStatus(id, "read");
        if (marked.ok) {
          setItems((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: "read" } : c)),
          );
          setDetail((prev) =>
            prev && prev.id === id ? { ...prev, status: "read" } : prev,
          );
          router.refresh();
        }
      }
    });
  }

  useEffect(() => {
    if (initialConversations[0]?.id) {
      loadDetail(initialConversations[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate first thread once
  }, []);

  function archiveActive() {
    if (!activeId) return;
    startTransition(async () => {
      const result = await markConversationStatus(activeId, "archived");
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const next = items.filter((c) => c.id !== activeId);
      setItems(next);
      setActiveId(next[0]?.id ?? null);
      setDetail(null);
      router.refresh();
      if (next[0]?.id) {
        loadDetail(next[0].id);
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="border-border bg-card rounded-2xl border px-6 py-16 text-center">
        <p className="text-lg font-semibold tracking-tight">{t("emptyTitle")}</p>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
          {t("emptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="border-border grid min-h-[28rem] overflow-hidden rounded-2xl border lg:grid-cols-[minmax(0,18rem)_1fr]">
      <aside className="border-border divide-border max-h-[70vh] overflow-y-auto border-b lg:border-r lg:border-b-0">
        {items.map((item) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => loadDetail(item.id)}
              className={cn(
                "hover:bg-muted/60 flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors",
                selected && "bg-muted",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                    item.source === "ask"
                      ? "bg-sky-100 text-sky-900"
                      : "bg-amber-100 text-amber-900",
                  )}
                >
                  {item.source === "ask" ? t("sourceAsk") : t("sourceContact")}
                </span>
                {item.status === "new" ? (
                  <span className="size-2 shrink-0 rounded-full bg-red-500" />
                ) : null}
              </div>
              <p className="truncate text-sm font-medium">
                {item.visitorName ||
                  item.visitorEmail ||
                  t("anonymous")}
              </p>
              <p className="text-muted-foreground line-clamp-2 text-xs">
                {item.preview}
              </p>
              <p className="text-muted-foreground text-[11px]">
                {formatWhen(item.lastMessageAt)}
              </p>
            </button>
          );
        })}
      </aside>

      <section className="flex min-h-[20rem] flex-col">
        {active ? (
          <>
            <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {active.visitorName ||
                    active.visitorEmail ||
                    t("anonymous")}
                </p>
                <p className="text-muted-foreground text-xs">
                  {active.source === "ask"
                    ? t("sourceAsk")
                    : t("sourceContact")}
                  {" · "}
                  {active.locale.toUpperCase()}
                  {active.visitorEmail ? ` · ${active.visitorEmail}` : ""}
                  {active.visitorPhone ? ` · ${active.visitorPhone}` : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={archiveActive}
              >
                {t("archive")}
              </Button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {pending && !detail ? (
                <p className="text-muted-foreground text-sm">{t("loading")}</p>
              ) : null}
              {error ? (
                <p className="text-destructive text-sm">{error}</p>
              ) : null}
              {detail?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    msg.role === "visitor"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted ml-auto",
                  )}
                >
                  <p className="mb-1 text-[10px] font-semibold tracking-wide uppercase opacity-70">
                    {msg.role === "visitor" ? t("roleVisitor") : t("roleSystem")}
                  </p>
                  {msg.body}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-muted-foreground flex flex-1 items-center justify-center p-8 text-sm">
            {t("pickOne")}
          </div>
        )}
      </section>
    </div>
  );
}
