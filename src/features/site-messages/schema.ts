import { z } from "zod";

export const localeSchema = z.enum(["fr", "tr"]);

export const askMessageSchema = z.object({
  locale: localeSchema,
  body: z.string().trim().min(1).max(4000),
  conversationId: z.string().uuid().optional(),
  /** Honeypot — must stay empty */
  website: z.string().max(0).optional(),
});

export const askNameSchema = z.object({
  locale: localeSchema,
  conversationId: z.string().uuid(),
  name: z.string().trim().min(2).max(120),
  website: z.string().max(0).optional(),
});

/** Phone is free-form (FR / TR); email validated only when provided. */
export const askContactSchema = z
  .object({
    locale: localeSchema,
    conversationId: z.string().uuid(),
    email: z.string().trim().max(200).optional(),
    phone: z.string().trim().max(40).optional(),
    website: z.string().max(0).optional(),
  })
  .superRefine((value, ctx) => {
    const email = value.email?.trim() ?? "";
    const phone = value.phone?.trim() ?? "";
    if (!email && !phone) {
      ctx.addIssue({
        code: "custom",
        message: "contactRequired",
        path: ["email"],
      });
    }
    if (email && !z.string().email().safeParse(email).success) {
      ctx.addIssue({
        code: "custom",
        message: "invalidEmail",
        path: ["email"],
      });
    }
  });

export const contactMessageSchema = z.object({
  locale: localeSchema,
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(2).max(4000),
  website: z.string().max(0).optional(),
});

export type AskMessageInput = z.infer<typeof askMessageSchema>;
export type AskNameInput = z.infer<typeof askNameSchema>;
export type AskContactInput = z.infer<typeof askContactSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export function askPromptAskName(locale: "fr" | "tr") {
  return locale === "tr"
    ? "Teşekkürler! Size hitap edebilmemiz için adınızı öğrenebilir miyim?"
    : "Merci ! Pour mieux vous accompagner, puis-je avoir votre prénom ?";
}

export function askPromptAskContact(locale: "fr" | "tr", name: string) {
  const safe = name.trim();
  return locale === "tr"
    ? `Teşekkürler ${safe}! Size ulaşabilmemiz için iletişim bilgilerinizi alabilir miyiz? E-posta ve/veya telefon yeterlidir.`
    : `Merci ${safe} ! Pour pouvoir vous recontacter, puis-je avoir vos coordonnées ? E-mail et/ou téléphone suffisent.`;
}

export function askFollowUpAck(locale: "fr" | "tr") {
  return locale === "tr"
    ? "Mesajınız alındı, teşekkürler! Ekibimiz en kısa sürede size dönüş yapacak."
    : "Message bien reçu, merci ! Notre équipe vous répondra bientôt.";
}

export function systemAck(locale: "fr" | "tr", source: "ask" | "contact") {
  if (locale === "tr") {
    return source === "contact"
      ? "Teşekkürler! Mesajınız Bonvera ekibine iletildi. En kısa sürede dönüş yapacağız."
      : "Teşekkürler! Bilgileriniz kaydedildi. Ekibimiz en kısa sürede size dönüş yapacak.";
  }
  return source === "contact"
    ? "Merci ! Votre message a bien été transmis à l'équipe Bonvera. Nous vous répondrons bientôt."
    : "Merci ! Vos coordonnées sont enregistrées. Notre équipe vous répondra bientôt.";
}
