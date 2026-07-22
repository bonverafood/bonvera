import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Catch-all under `[locale]` ensures unknown paths resolve through the
 * locale layout (and its not-found UI) instead of a blank response.
 */
export default async function CatchAllPage({ params }: Props) {
  await params;
  notFound();
}
