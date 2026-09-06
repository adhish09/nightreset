import type { Metadata } from "next";
import { ShieldCheck, Phone, Users, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Safety",
  description: "NightReset is a wellness tool, not medical care.",
};

export default function SafetyPage() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-accent" aria-hidden="true" />
          <h1 className="text-3xl font-semibold tracking-tight">Safety</h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">
          NightReset is a wellness tool, not medical care.
        </p>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            NightReset helps you organize racing thoughts and follow a short, calming exercise
            before sleep. It does not diagnose any condition, does not treat anxiety or insomnia,
            does not prescribe or advise on medication, and cannot replace a licensed doctor,
            therapist, or emergency service.
          </p>

          <Card className="border-white/10 bg-white/[0.02]">
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 font-medium text-foreground">
                <Phone className="h-4 w-4 text-accent" aria-hidden="true" />
                If you&apos;re in crisis right now
              </h2>
              <p className="mt-2">
                If you are thinking about harming yourself or someone else, or you are in immediate
                danger, please contact your local emergency number right away, or reach out to a
                crisis helpline in your country. You deserve real, immediate support — not an app.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.02]">
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 font-medium text-foreground">
                <Users className="h-4 w-4 text-accent" aria-hidden="true" />
                Reach out to someone you trust
              </h2>
              <p className="mt-2">
                A friend, family member, or anyone you trust can help more in a hard moment than any
                app. If you can, let someone know what you&apos;re going through tonight.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.02]">
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 font-medium text-foreground">
                <Stethoscope className="h-4 w-4 text-accent" aria-hidden="true" />
                When to see a professional
              </h2>
              <p className="mt-2">
                If sleep problems, racing thoughts, or worry are persistent, severe, or getting in
                the way of your daily life, please talk to a doctor or licensed mental health
                professional. NightReset can be a small nightly habit alongside professional care —
                it isn&apos;t a replacement for it.
              </p>
            </CardContent>
          </Card>

          <p>
            If, while writing your thoughts down, you mention immediate danger or intent to harm
            yourself or someone else, NightReset will not generate a normal reset — it will show you
            this guidance instead.
          </p>
        </div>
      </div>
    </section>
  );
}
