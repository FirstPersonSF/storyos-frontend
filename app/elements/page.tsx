import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"

export default function ElementsPage() {
  const elements = [
    {
      id: 1,
      type: "Problem",
      versions: [
        {
          version: "1.2",
          date: "10/21/2025",
          status: "approved",
          content:
            "Today's industries must balance growth with responsibility. They need to deliver higher efficiency, quality, and safety while reducing waste and carbon impact. Despite rapid advances in technology, many organisations still struggle to connect their data and use it to drive real-world outcomes. Data often sits in silos, and digital tools are underutilised. The result is a widening gap between what companies know and what they can act on—a gap that limits progress toward a more efficient and responsible future.",
        },
        {
          version: "1.1",
          date: "10/21/2025",
          status: "superseded",
          content:
            "Today's industries must balance growth with responsibility. They need to deliver higher efficiency, quality, and safety while reducing waste and carbon impact. Despite rapid advances in technology, many organisations still struggle to connect their data and use it to drive real-world outcomes. Data often sits in silos, and digital tools are underutilised. The result is a widening gap between what companies know and what they can act on—a gap that limits progress toward a more responsible future. [UPDATED: 2:29:05 PM]",
        },
      ],
    },
    {
      id: 2,
      type: "Key Messages",
      versions: [
        {
          version: "1.3",
          date: "10/21/2025",
          status: "approved",
          content:
            "Key Message 1 **Headline**: Transform data into real-world outcomes **Proof**: Our Reality Technology connects physical and digital realities to improve performance and sustainability. **Benefit**: Enables industries to act faster and more responsibly. Key Message 2 **Headline**: Capture, create, and shape reality **Proof**: We unify sensors, software, and AI to bridge the gap from data to action. **Benefit**: Turns data into decisions that improve efficiency and safety. Key Message 3 **Headline**: Empower...",
        },
        {
          version: "1.3",
          date: "10/21/2025",
          status: "superseded",
          content:
            "Key Message 1 **Headline**: Transform data into real-world outcomes **Proof**: Our Reality Technology connects physical and digital realities to improve performance and sustainability. **Benefit**: Enables industries to act faster and more responsibly. Key Message 2 **Headline**: Capture, create, and shape reality **Proof**: We unify sensors, software, and AI to bridge the gap from data to action. **Benefit**: Turns data into decisions that improve efficiency and safety. Key Message 3 **Headline**: Empower...",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold tracking-tight text-[#003A70]">StoryOS</h1>
            </div>
            <span className="text-sm text-muted-foreground">v1.0.0</span>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="border-b border-border bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">UNF Elements</h2>
              <p className="mt-2 text-lg text-muted-foreground">13 elements</p>
            </div>
            <Button className="bg-[#003A70] hover:bg-[#0052A3]">
              <Plus className="mr-2 h-4 w-4" />
              Create Element
            </Button>
          </div>
        </div>
      </section>

      {/* Elements List */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="space-y-8">
            {elements.map((element) => (
              <div key={element.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-foreground">{element.type}</h3>
                </div>

                {element.versions.map((version, versionIndex) => (
                  <Card
                    key={versionIndex}
                    className={`transition-all ${
                      version.status === "approved"
                        ? "border-[#003A70]/20 bg-white shadow-sm"
                        : "border-border bg-secondary/30"
                    }`}
                  >
                    <CardHeader className="border-b border-border pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-muted-foreground">Version {version.version}</span>
                          <Badge
                            variant={version.status === "approved" ? "default" : "secondary"}
                            className={
                              version.status === "approved"
                                ? "bg-[#003A70] hover:bg-[#0052A3]"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {version.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{version.date}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="mb-6 leading-relaxed text-foreground">{version.content}</p>
                      <Button
                        variant="outline"
                        className="w-full border-[#003A70]/20 hover:bg-[#003A70]/5 bg-transparent"
                      >
                        Edit (New Version)
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
