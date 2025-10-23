import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clipboard, Play, Code2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function StoryOSDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-[#003A70]">StoryOS</h1>
            <span className="text-sm text-muted-foreground">v1.0.0</span>
          </div>
        </div>
      </header>

      {/* Hero Section - Try the Demo Workflow */}
      <section className="bg-gradient-to-b from-white to-secondary/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-[#003A70]">
              <Play className="h-4 w-4" />
              Interactive Demo
            </div>
            <h2 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
              Welcome to StoryOS
            </h2>
            <p className="mb-8 text-pretty text-lg text-muted-foreground lg:text-xl">
              Content management system for enterprise storytelling
            </p>
            <Link href="/demo">
              <Button size="lg" className="h-12 bg-[#003A70] px-8 text-base font-semibold hover:bg-[#0052A3]">
                Start Demo Workflow
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Demo Workflow Steps */}
          <div className="mt-16">
            <Card className="border-2 border-[#003A70]/10 bg-white shadow-lg">
              <CardContent className="p-8 lg:p-12">
                <h3 className="mb-8 text-center text-2xl font-bold text-foreground lg:text-3xl">
                  Try the Demo Workflow
                </h3>
                <div className="grid gap-6 lg:grid-cols-5">
                  {[
                    {
                      step: 1,
                      text: "Go to UNF Elements and create a new element (or edit an existing one)",
                      color: "#E92076",
                    },
                    { step: 2, text: "Approve the element if it's a draft", color: "#EF5898" },
                    {
                      step: 3,
                      text: "Go to Deliverables and create a deliverable using your elements",
                      color: "#4098D7",
                    },
                    {
                      step: 4,
                      text: "Go back to UNF Elements and edit one of the elements you used",
                      color: "#2069A3",
                    },
                    {
                      step: 5,
                      text: 'Return to Deliverables and click "Check for Updates" to see the impact alert!',
                      color: "#003A70",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex flex-col">
                      <div
                        className="mb-3 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.step}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">Platform Features</h3>
            <p className="text-lg text-muted-foreground">Explore the core capabilities of StoryOS</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: FileText,
                title: "UNF Elements",
                description: "Reusable content blocks",
                detail: "Build a library of approved content blocks organized by UNF layers.",
                href: "/elements",
              },
              {
                icon: Clipboard,
                title: "Deliverables",
                description: "Final outputs with alerts",
                detail: "Combine elements with templates and brand voices to create content.",
                href: "/deliverables",
              },
              {
                icon: Play,
                title: "Interactive Demo",
                description: "Try it live",
                detail: "Experience the full workflow in action with our interactive demo.",
                href: "/demo",
              },
              {
                icon: Code2,
                title: "API Documentation",
                description: "REST API docs",
                detail: "Integrate StoryOS into your existing tools and workflows.",
                href: "https://web-production-9c58.up.railway.app/docs",
                external: true,
              },
            ].map((feature, index) => {
              const CardWrapper = feature.href ? (feature.external ? "a" : Link) : "div"
              const cardProps = feature.href
                ? feature.external
                  ? { href: feature.href, target: "_blank", rel: "noopener noreferrer" }
                  : { href: feature.href }
                : {}

              return (
                <CardWrapper key={index} {...cardProps}>
                  <Card className="group transition-all hover:border-[#003A70]/30 hover:shadow-md hover:cursor-pointer">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#003A70]/10 text-[#003A70] transition-colors group-hover:bg-[#003A70] group-hover:text-white">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <h4 className="mb-2 text-xl font-bold text-foreground">{feature.title}</h4>
                      <p className="mb-3 text-sm font-medium text-[#003A70]">{feature.description}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{feature.detail}</p>
                    </CardContent>
                  </Card>
                </CardWrapper>
              )
            })}
          </div>
        </div>
      </section>

      {/* How StoryOS Works */}
      <section className="bg-secondary/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">How StoryOS Works</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: 1,
                title: "Create Reusable Elements",
                description: "Build a library of approved content blocks organized by UNF layers.",
              },
              {
                number: 2,
                title: "Assemble Deliverables",
                description: "Combine elements with templates and brand voices to create content.",
              },
              {
                number: 3,
                title: "Track Version Changes",
                description: "Get alerts when elements update showing old → new version changes.",
              },
              {
                number: 4,
                title: "Voice Transformations",
                description: "Apply brand voices to transform content automatically.",
              },
            ].map((step) => (
              <Card key={step.number} className="bg-white">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-8 items-center justify-center rounded bg-[#003A70] px-3 text-sm font-bold text-white">
                    Step {step.number}
                  </div>
                  <h4 className="mb-3 text-xl font-bold text-foreground">{step.title}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 StoryOS. Content management for enterprise storytelling.
          </p>
        </div>
      </footer>
    </div>
  )
}
