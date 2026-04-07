import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Fingerprint, Globe2, Layers, MessageSquareWarning, Sparkles } from "lucide-react";

const Safety = () => {
  return (
    <div className="min-h-screen bg-background hero-mesh">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-20 max-w-3xl space-y-8">
        <Button variant="ghost" size="sm" className="-ml-2 rounded-xl gap-1 text-muted-foreground" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Safety &amp; trust</h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Gems is designed as a premium, well-moderated creator marketplace. These are the product rules we ship in the
            UI; wire your own KYC, classifiers, and legal review before production.
          </p>
        </div>

        <Card className="rounded-2xl border-destructive/25 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-base text-foreground">What Gems does not support</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              No adult or erotic streaming, no escort or sexual-services marketplace, and no facilitation of off-platform
              meetings for that purpose. Creators offer digital experiences, streams, and NFT perks only within community
              guidelines.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-primary" />
                Identity &amp; payments
              </CardTitle>
              <CardDescription className="text-xs">
                Strong account security, optional creator verification for payouts, and audit trails for on-chain actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Hook your preferred KYC / age provider for fiat ramps; wallet signatures alone are not proof of age for
              regulated flows.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI-assisted moderation
              </CardTitle>
              <CardDescription className="text-xs">
                Chat and metadata pass through classifiers; high-risk content is flagged for human review.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Tune models for your jurisdiction; retain logs per your privacy policy.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquareWarning className="w-4 h-4 text-primary" />
                Reporting
              </CardTitle>
              <CardDescription className="text-xs">
                One-tap reports from every stream and profile. Escalation queues for trust &amp; safety.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Category filters
              </CardTitle>
              <CardDescription className="text-xs">
                Discover creators by vertical (gaming, music, education…). All listed categories are non-adult.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-primary" />
                Geo &amp; compliance
              </CardTitle>
              <CardDescription className="text-xs">
                Region-aware availability, sanctions screening for wallets, and configurable blocklists.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Consult counsel for token sales, securities, and streaming regulations in each market you launch.
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Safety;
