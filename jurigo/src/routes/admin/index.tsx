import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useSession, signOut } from "~/lib/auth-client";
import {
  Building2,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  BarChart3,
  Settings,
} from "lucide-react";
import { getAdminStats, getAllCompanies } from "~/lib/server/admin";
import { LEGAL_STRUCTURES } from "~/lib/utils";
import type { Company } from "~/db/schema";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  loader: async () => {
    const [stats, companies] = await Promise.all([
      getAdminStats(),
      getAllCompanies(),
    ]);
    return { stats, companies };
  },
});

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'text-gray-600 bg-gray-100' },
  pending_payment: { label: 'En attente de paiement', color: 'text-orange-600 bg-orange-100' },
  paid: { label: 'Payé', color: 'text-blue-600 bg-blue-100' },
  documents_pending: { label: 'Documents en attente', color: 'text-orange-600 bg-orange-100' },
  documents_uploaded: { label: 'Documents téléversés', color: 'text-blue-600 bg-blue-100' },
  under_review: { label: 'En cours de vérification', color: 'text-purple-600 bg-purple-100' },
  submitted_to_greffe: { label: 'Soumis au Greffe', color: 'text-indigo-600 bg-indigo-100' },
  completed: { label: 'Terminé', color: 'text-green-600 bg-green-100' },
  rejected: { label: 'Rejeté', color: 'text-red-600 bg-red-100' },
};

function AdminDashboard() {
  const { stats, companies } = Route.useLoaderData();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Accès restreint</CardTitle>
            <CardDescription>
              Vous n'avez pas les droits d'accès à cette page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">Retour à l'accueil</Button>
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

  // Use stats from loader, with fallback defaults
  const adminStats = stats || {
    totalCompanies: 0,
    pendingPayment: 0,
    pendingDocuments: 0,
    underReview: 0,
    completed: 0,
    totalUsers: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-primary">
                Jurigo<span className="text-primary">.</span>
              </Link>
              <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                Admin
              </span>
            </div>
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-65px)] p-4">
          <nav className="space-y-2">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
            >
              <BarChart3 className="h-5 w-5" />
              Tableau de bord
            </Link>
            <a
              href="/admin/companies"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-gray-100"
            >
              <Building2 className="h-5 w-5" />
              Entreprises
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-gray-100"
            >
              <Users className="h-5 w-5" />
              Utilisateurs
            </a>
            <a
              href="/admin/documents"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-gray-100"
            >
              <FileText className="h-5 w-5" />
              Documents
            </a>
            <a
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
              Paramètres
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground mt-2">
              Vue d'ensemble de l'activité Jurigo
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total entreprises</p>
                    <p className="text-3xl font-bold">{adminStats.totalCompanies}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">En attente paiement</p>
                    <p className="text-3xl font-bold">{adminStats.pendingPayment}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Documents en attente</p>
                    <p className="text-3xl font-bold">{adminStats.pendingDocuments}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Terminées</p>
                    <p className="text-3xl font-bold">{adminStats.completed}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dernières créations</CardTitle>
                <CardDescription>
                  Les entreprises récemment créées
                </CardDescription>
              </CardHeader>
              <CardContent>
                {companies.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune entreprise pour le moment
                  </div>
                ) : (
                  <div className="space-y-3">
                    {companies.slice(0, 5).map((company: Company) => {
                      const status = STATUS_LABELS[company.status] || STATUS_LABELS.draft;
                      const structure = LEGAL_STRUCTURES[company.legalStructure as keyof typeof LEGAL_STRUCTURES];
                      return (
                        <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {structure?.name || company.legalStructure} • {new Date(company.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions requises</CardTitle>
                <CardDescription>
                  Dossiers nécessitant votre attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {companies.filter((c: Company) => ['documents_pending', 'under_review'].includes(c.status)).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune action requise
                  </div>
                ) : (
                  <div className="space-y-3">
                    {companies
                      .filter((c: Company) => ['documents_pending', 'under_review'].includes(c.status))
                      .slice(0, 5)
                      .map((company: Company) => {
                        const status = STATUS_LABELS[company.status] || STATUS_LABELS.draft;
                        return (
                          <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{company.name}</p>
                              <p className="text-sm text-muted-foreground">{company.contactEmail}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
