import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { LEGAL_STRUCTURES, ACTIVITY_DOMAINS, PRICING, formatPrice } from "~/lib/utils";
import { ArrowLeft, ArrowRight, Building2, User, MapPin, CreditCard, Loader2 } from "lucide-react";
import { createCompany } from "~/lib/server/companies";

type LegalStructure = keyof typeof LEGAL_STRUCTURES;
type ActivityDomain = keyof typeof ACTIVITY_DOMAINS;

interface FormData {
  legalStructure: LegalStructure | "";
  activityDomain: ActivityDomain | "";
  companyName: string;
  activityDescription: string;
  contactEmail: string;
  contactPhone: string;
  presidentFirstName: string;
  presidentLastName: string;
  presidentBirthDate: string;
  presidentNationality: string;
  address: string;
  postalCode: string;
  city: string;
  capitalAmount: string;
}

export const Route = createFileRoute("/creer/")({
  component: CreerPage,
  validateSearch: (search: Record<string, unknown>) => ({
    structure: (search.structure as string) || "",
  }),
});

const TOTAL_STEPS = 5;

function CreerPage() {
  const { structure } = Route.useSearch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    legalStructure: (structure as LegalStructure) || "",
    activityDomain: "",
    companyName: "",
    activityDescription: "",
    contactEmail: "",
    contactPhone: "",
    presidentFirstName: "",
    presidentLastName: "",
    presidentBirthDate: "",
    presidentNationality: "Française",
    address: "",
    postalCode: "",
    city: "",
    capitalAmount: "1000",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Choix de la forme juridique";
      case 2:
        return "Informations sur votre activité";
      case 3:
        return "Informations du dirigeant";
      case 4:
        return "Siège social";
      case 5:
        return "Récapitulatif et paiement";
      default:
        return "";
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.legalStructure !== "";
      case 2:
        return formData.activityDomain !== "" && formData.companyName.trim() !== "" && formData.contactEmail.trim() !== "";
      case 3:
        return formData.presidentFirstName.trim() !== "" && formData.presidentLastName.trim() !== "";
      case 4:
        return formData.address.trim() !== "" && formData.postalCode.trim() !== "" && formData.city.trim() !== "";
      case 5:
        return true;
      default:
        return false;
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formData.legalStructure || !formData.activityDomain) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const company = await createCompany({
        data: {
          name: formData.companyName,
          legalStructure: formData.legalStructure,
          activityDomain: formData.activityDomain,
          activityDescription: formData.activityDescription || undefined,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone || undefined,
          capitalAmount: parseInt(formData.capitalAmount) || 1000,
          address: formData.address || undefined,
          postalCode: formData.postalCode || undefined,
          city: formData.city || undefined,
          presidentFirstName: formData.presidentFirstName || undefined,
          presidentLastName: formData.presidentLastName || undefined,
          presidentBirthDate: formData.presidentBirthDate || undefined,
          presidentNationality: formData.presidentNationality || undefined,
        }
      });
      
      // Redirect to payment page with company ID
      navigate({ to: '/auth/register', search: { companyId: company.id, redirect: '/dashboard' } });
    } catch (err) {
      console.error('Error creating company:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-primary">
              Jurigo<span className="text-primary">.</span>
            </a>
            <div className="text-sm text-muted-foreground">
              Besoin d'aide ? <a href="tel:0186269970" className="text-primary font-medium">01 86 26 99 70</a>
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Étape {currentStep} sur {TOTAL_STEPS}</span>
            <span className="text-sm text-muted-foreground">{getStepTitle()}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Legal Structure */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Choisissez votre forme juridique
                </CardTitle>
                <CardDescription>
                  Sélectionnez la structure qui correspond le mieux à votre projet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.legalStructure}
                  onValueChange={(value) => updateFormData("legalStructure", value)}
                  className="space-y-4"
                >
                  {Object.entries(LEGAL_STRUCTURES).map(([key, structure]) => (
                    <div key={key} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value={key} id={key} className="mt-1" />
                      <Label htmlFor={key} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{structure.name}</div>
                            <div className="text-sm text-muted-foreground">{structure.fullName}</div>
                            <div className="text-sm mt-1">{structure.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">
                              {formatPrice(PRICING[key as keyof typeof PRICING])}
                            </div>
                            <div className="text-xs text-muted-foreground">HT</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Activity Info */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informations sur votre activité
                </CardTitle>
                <CardDescription>
                  Décrivez votre future entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de la société *</Label>
                  <Input
                    id="companyName"
                    placeholder="Ex: Ma Super Entreprise"
                    value={formData.companyName}
                    onChange={(e) => updateFormData("companyName", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Vous pourrez modifier ce nom plus tard</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityDomain">Domaine d'activité *</Label>
                  <Select
                    value={formData.activityDomain}
                    onValueChange={(value) => updateFormData("activityDomain", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre domaine" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ACTIVITY_DOMAINS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityDescription">Description de l'activité</Label>
                  <Input
                    id="activityDescription"
                    placeholder="Décrivez brièvement votre activité"
                    value={formData.activityDescription}
                    onChange={(e) => updateFormData("activityDescription", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capitalAmount">Capital social (€)</Label>
                  <Input
                    id="capitalAmount"
                    type="number"
                    min="1"
                    placeholder="1000"
                    value={formData.capitalAmount}
                    onChange={(e) => updateFormData("capitalAmount", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Minimum 1€ pour les SAS/SASU/SARL/EURL</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Vos coordonnées
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.contactEmail}
                        onChange={(e) => updateFormData("contactEmail", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Téléphone</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="06 12 34 56 78"
                        value={formData.contactPhone}
                        onChange={(e) => updateFormData("contactPhone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: President Info */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations du dirigeant
                </CardTitle>
                <CardDescription>
                  {formData.legalStructure === "sarl" || formData.legalStructure === "eurl"
                    ? "Informations sur le Gérant"
                    : "Informations sur le Président"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="presidentFirstName">Prénom *</Label>
                    <Input
                      id="presidentFirstName"
                      placeholder="Jean"
                      value={formData.presidentFirstName}
                      onChange={(e) => updateFormData("presidentFirstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="presidentLastName">Nom *</Label>
                    <Input
                      id="presidentLastName"
                      placeholder="Dupont"
                      value={formData.presidentLastName}
                      onChange={(e) => updateFormData("presidentLastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="presidentBirthDate">Date de naissance</Label>
                    <Input
                      id="presidentBirthDate"
                      type="date"
                      value={formData.presidentBirthDate}
                      onChange={(e) => updateFormData("presidentBirthDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="presidentNationality">Nationalité</Label>
                    <Input
                      id="presidentNationality"
                      placeholder="Française"
                      value={formData.presidentNationality}
                      onChange={(e) => updateFormData("presidentNationality", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Address */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Siège social
                </CardTitle>
                <CardDescription>
                  Adresse du siège social de votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    placeholder="123 rue de la République"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal *</Label>
                    <Input
                      id="postalCode"
                      placeholder="75001"
                      value={formData.postalCode}
                      onChange={(e) => updateFormData("postalCode", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      placeholder="Paris"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Summary & Payment */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Récapitulatif
                </CardTitle>
                <CardDescription>
                  Vérifiez vos informations avant de procéder au paiement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Forme juridique</span>
                    <span className="font-medium">
                      {formData.legalStructure && LEGAL_STRUCTURES[formData.legalStructure]?.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Nom de la société</span>
                    <span className="font-medium">{formData.companyName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Domaine d'activité</span>
                    <span className="font-medium">
                      {formData.activityDomain && ACTIVITY_DOMAINS[formData.activityDomain]}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Dirigeant</span>
                    <span className="font-medium">
                      {formData.presidentFirstName} {formData.presidentLastName}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Siège social</span>
                    <span className="font-medium text-right">
                      {formData.address}<br />
                      {formData.postalCode} {formData.city}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Capital social</span>
                    <span className="font-medium">{formData.capitalAmount} €</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total à payer</span>
                    <span className="text-2xl font-bold text-primary">
                      {formData.legalStructure && formatPrice(PRICING[formData.legalStructure])}
                      <span className="text-sm font-normal text-muted-foreground ml-1">HT</span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    + frais légaux obligatoires (annonce légale, greffe)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button onClick={nextStep} disabled={!canProceed()}>
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    Procéder au paiement
                    <CreditCard className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
