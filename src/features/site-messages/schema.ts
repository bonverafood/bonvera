import { z } from "zod";

export const localeSchema = z.enum(["fr", "tr"]);

export const askMessageSchema = z.object({
  locale: localeSchema,
  body: z.string().trim().min(1).max(4000),
  conversationId: z.string().uuid().optional(),
  /** Honeypot — must stay empty */
  website: z.string().max(0).optional(),
});

export const contactMessageSchema = z.object({
  locale: localeSchema,
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(2).max(4000),
  website: z.string().max(0).optional(),
});

export type AskMessageInput = z.infer<typeof askMessageSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export function systemAck(locale: "fr" | "tr", source: "ask" | "contact") {
  if (locale === "tr") {
    return source === "contact"
      ? "Teşekkürler! Mesajınız Bonvera ekibine iletildi. En kısa sürede dönüş yapacağız."
      : "Teşekkürler! Mesajınız iletildi. Ekibimiz en kısa sürede size dönüş yapacak.";
  }
  return source === "contact"
    ? "Merci ! Votre message a bien été transmis à l'équipe Bonvera. Nous vous répondrons bientôt."
    : "Merci ! Votre message a bien été transmis. Notre équipe vous répondra bientôt.";
}
