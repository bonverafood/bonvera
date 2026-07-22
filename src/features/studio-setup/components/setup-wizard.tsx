"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { SETUP_STEPS } from "../constants";
import { useSetupHydration } from "../hooks/use-setup-hydration";
import { useSetupStore } from "../store";
import { SetupNav } from "./setup-nav";
import { SetupProgress } from "./setup-progress";
import { BrandStep } from "./steps/brand-step";
import { CompanyStep } from "./steps/company-step";
import { ContactStep } from "./steps/contact-step";
import { FinishStep } from "./steps/finish-step";
import { HoursStep } from "./steps/hours-step";
import { LanguagesStep } from "./steps/languages-step";
import { SocialStep } from "./steps/social-step";
import { WelcomeStep } from "./steps/welcome-step";
import { StudioSurface } from "./studio-surface";

export function SetupWizard() {
  const t = useTranslations("StudioSetup");
  const hydrated = useSetupHydration();
  const reduceMotion = useReducedMotion();
  const currentStepIndex = useSetupStore((state) => state.currentStepIndex);
  const nextStep = useSetupStore((state) => state.nextStep);
  const prevStep = useSetupStore((state) => state.prevStep);
  const stepRegionRef = useRef<HTMLDivElement>(null);

  const step = SETUP_STEPS[currentStepIndex] ?? SETUP_STEPS[0];
  const showBack = currentStepIndex > 0;
  const showNav = step.id !== "welcome" && step.id !== "finish";

  useEffect(() => {
    if (!hydrated) return;
    stepRegionRef.current?.focus();
  }, [currentStepIndex, hydrated]);

  if (!hydrated) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">{t("loading")}</p>
      </div>
    );
  }

  return (
    <StudioSurface>
      {step.id !== "welcome" ? (
        <div className="mb-8">
          <SetupProgress currentStepIndex={currentStepIndex} />
        </div>
      ) : null}

      <header className="mb-6 space-y-1">
        {step.id !== "welcome" && step.id !== "finish" ? (
          <>
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              {t(step.titleKey)}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t(step.descriptionKey)}
            </p>
          </>
        ) : null}
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step.id}
          ref={stepRegionRef}
          tabIndex={-1}
          role="group"
          aria-label={t(step.titleKey)}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{
            duration: reduceMotion ? 0 : 0.22,
            ease: [0.2, 0, 0, 1],
          }}
          className="flex-1 outline-none"
        >
          {step.id === "welcome" ? <WelcomeStep onContinue={nextStep} /> : null}
          {step.id === "brand" ? <BrandStep onValid={nextStep} /> : null}
          {step.id === "company" ? <CompanyStep onValid={nextStep} /> : null}
          {step.id === "contact" ? <ContactStep onValid={nextStep} /> : null}
          {step.id === "social" ? <SocialStep onValid={nextStep} /> : null}
          {step.id === "languages" ? (
            <LanguagesStep onValid={nextStep} />
          ) : null}
          {step.id === "hours" ? <HoursStep onValid={nextStep} /> : null}
          {step.id === "finish" ? <FinishStep /> : null}
        </motion.div>
      </AnimatePresence>

      {showNav ? <SetupNav showBack={showBack} onBack={prevStep} /> : null}
    </StudioSurface>
  );
}
