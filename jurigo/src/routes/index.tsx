import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { LEGAL_STRUCTURES, ACTIVITY_DOMAINS } from "~/lib/utils";
import { Building2, Rocket, Shield, Phone, CheckCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Jurigo</span>
            <span className="text-primary">.</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#creation" className="text-sm font-medium hover:text-primary">Création</a>
            <a href="#tarifs" className="text-sm font-medium hover:text-primary">Tarifs</a>
            <a href="#faq" className="text-sm font-medium hover:text-primary">FAQ</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/auth/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link to="/creer">
              <Button>Créer mon entreprise</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Entreprendre n'a jamais été aussi{" "}
                <span className="text-primary">simple.</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Créez votre société en ligne en 10 minutes. Dossier validé par des juristes, Kbis reçu en 48h. L'expertise d'un cabinet, la simplicité d'une app.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Formalités 100% dématérialisées</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Garantie anti-rejet du Greffe</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Assistance téléphonique illimitée</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/creer">
                  <Button size="lg" className="w-full sm:w-auto">
                    Créer mon entreprise
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#tarifs">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Voir les tarifs
                  </Button>
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <Card className="p-8 shadow-2xl">
                <CardHeader className="text-center pb-4">
                  <CardTitle>Démarrez votre projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Link to="/creer" className="block">
                    <Button className="w-full" size="lg">
                      Lancer les démarches
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-center text-sm text-muted-foreground">
                    🔒 Espace sécurisé & confidentiel
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Structures Section */}
      <section id="creation" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos solutions clés en main</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choisissez la forme juridique adaptée à votre situation. Nous nous occupons du reste.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(LEGAL_STRUCTURES).map(([key, structure]) => (
              <Card key={key} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{structure.name}</CardTitle>
                  <CardDescription>{structure.fullName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{structure.description}</p>
                  <Link to="/creer" search={{ structure: key }}>
                    <Button variant="outline" className="w-full">
                      Commencer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tarifs transparents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pas de frais cachés. Tout est inclus dans nos forfaits.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle>Auto-entrepreneur</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">0€</span>
                </div>
                <CardDescription>Gratuit, hors frais légaux</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Déclaration simplifiée
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Accompagnement personnalisé
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Suivi de dossier en ligne
                  </li>
                </ul>
                <Link to="/creer" search={{ structure: "auto_entrepreneur" }}>
                  <Button className="w-full">Commencer</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm">
                Populaire
              </div>
              <CardHeader className="text-center">
                <CardTitle>SASU / EURL</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">149€</span>
                  <span className="text-muted-foreground"> HT</span>
                </div>
                <CardDescription>+ frais légaux obligatoires</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Rédaction des statuts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Publication annonce légale
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Immatriculation au Greffe
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Garantie anti-rejet
                  </li>
                </ul>
                <Link to="/creer" search={{ structure: "sasu" }}>
                  <Button className="w-full">Commencer</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle>SAS / SARL</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">199€</span>
                  <span className="text-muted-foreground"> HT</span>
                </div>
                <CardDescription>+ frais légaux obligatoires</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Tout SASU/EURL inclus
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Gestion multi-associés
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Pacte d'associés optionnel
                  </li>
                </ul>
                <Link to="/creer" search={{ structure: "sas" }}>
                  <Button className="w-full">Commencer</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi nous faire confiance ?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple et rapide</h3>
              <p className="text-muted-foreground">
                Votre démarche réalisée en moins de 10 minutes. Kbis reçu en 48h.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sécurisé</h3>
              <p className="text-muted-foreground">
                Vos données sont protégées. Dossier vérifié par des juristes.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accompagnement</h3>
              <p className="text-muted-foreground">
                Une équipe disponible pour répondre à toutes vos questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">Jurigo<span className="text-primary">.</span></div>
              <p className="text-gray-400 text-sm">
                Simplifiez votre vie d'entrepreneur. Une plateforme unique pour créer votre entreprise.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Création</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">SASU</a></li>
                <li><a href="#" className="hover:text-white">SAS</a></li>
                <li><a href="#" className="hover:text-white">EURL</a></li>
                <li><a href="#" className="hover:text-white">SARL</a></li>
                <li><a href="#" className="hover:text-white">Auto-entrepreneur</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Jurigo</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Qui sommes-nous ?</a></li>
                <li><a href="#tarifs" className="hover:text-white">Nos tarifs</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white">CGU</a></li>
                <li><a href="#" className="hover:text-white">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Jurigo SAS. Tous droits réservés.</p>
            <p className="mt-2">
              Jurigo n'est pas un cabinet d'avocats. Nous fournissons des informations juridiques et un logiciel de génération de documents.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
