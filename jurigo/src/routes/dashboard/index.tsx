import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useSession, signOut } from "~/lib/auth-client";
import { Building2, FileText, Upload, Clock, LogOut, Plus, CheckCircle } from "lucide-react";
import { getCompaniesByUser } from "~/lib/server/companies";
import { LEGAL_STRUCTURES } from "~/lib/utils";
import type { Company } from "~/db/schema";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
  loader: async () => {
    try {
      const companies = await getCompaniesByUser();
      return { companies: companies || [] };
    } catch {
      return { companies: [] };
    }
  },
});

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'text-gray-600' },
  pending_payment: { label: 'En attente de paiement', color: 'text-orange-600' },
  paid: { label: 'Payé', color: 'text-blue-600' },
  documents_pending: { label: 'Documents en attente', color: 'text-orange-600' },
  documents_uploaded: { label: 'Documents téléversés', color: 'text-blue-600' },
  under_review: { label: 'En cours de vérification', color: 'text-purple-600' },
  submitted_to_greffe: { label: 'Soumis au Greffe', color: 'text-indigo-600' },
  completed: { label: 'Terminé', color: 'text-green-600' },
  rejected: { label: 'Rejeté', color: 'text-red-600' },
};

function DashboardPage() {
  const { companies } = Route.useLoaderData();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Accès restreint</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à cette page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/auth/login">
              <Button className="w-full">Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              Jurigo<span className="text-primary">.</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {session.user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Bonjour, {session.user.name || "Utilisateur"} 👋</h1>
          <p className="text-muted-foreground mt-2">
            Bienvenue dans votre espace client Jurigo
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/creer" search={{ structure: '' }}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Nouvelle création</h3>
                    <p className="text-sm text-muted-foreground">Créer une entreprise</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Téléverser documents</h3>
                  <p className="text-sm text-muted-foreground">Ajouter des pièces</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Mes documents</h3>
                  <p className="text-sm text-muted-foreground">Voir tous les documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Mes entreprises
            </CardTitle>
            <CardDescription>
              Suivez l'avancement de vos créations d'entreprise
            </CardDescription>
          </CardHeader>
          <CardContent>
            {companies.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Aucune entreprise</h3>
                <p className="text-muted-foreground mb-6">
                  Vous n'avez pas encore créé d'entreprise avec Jurigo
                </p>
                <Link to="/creer" search={{ structure: '' }}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer mon entreprise
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {companies.map((company: Company) => {
                  const status = STATUS_LABELS[company.status] || STATUS_LABELS.draft;
                  const structure = LEGAL_STRUCTURES[company.legalStructure as keyof typeof LEGAL_STRUCTURES];
                  return (
                    <div key={company.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{company.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {structure?.name || company.legalStructure} • Créée le {new Date(company.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {company.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-orange-500" />
                          )}
                          <span className={status.color}>{status.label}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Téléverser
                        </Button>
                        <Button size="sm" variant="ghost">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
