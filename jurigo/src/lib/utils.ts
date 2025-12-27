import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export const LEGAL_STRUCTURES = {
  sas: {
    name: "SAS",
    fullName: "Société par Actions Simplifiée",
    description: "Idéal pour les associés multiples avec flexibilité statutaire",
    minCapital: 1,
    minAssociates: 2,
  },
  sasu: {
    name: "SASU",
    fullName: "Société par Actions Simplifiée Unipersonnelle",
    description: "Le choix le plus simple pour lancer son activité seul",
    minCapital: 1,
    minAssociates: 1,
  },
  sarl: {
    name: "SARL",
    fullName: "Société à Responsabilité Limitée",
    description: "Structure encadrée idéale pour les projets familiaux",
    minCapital: 1,
    minAssociates: 2,
  },
  eurl: {
    name: "EURL",
    fullName: "Entreprise Unipersonnelle à Responsabilité Limitée",
    description: "Moins de charges, idéal pour les artisans",
    minCapital: 1,
    minAssociates: 1,
  },
  auto_entrepreneur: {
    name: "Auto-entrepreneur",
    fullName: "Micro-entreprise",
    description: "Déclaration simplifiée et rapide pour démarrer",
    minCapital: 0,
    minAssociates: 1,
  },
} as const;

export const ACTIVITY_DOMAINS = {
  consulting_freelance: "Consultants et freelance",
  it_web: "Informatique & web",
  services_entreprises: "Services aux entreprises",
  construction_travaux: "Construction et travaux",
  automobile_transport: "Automobile et transport",
  vente_en_ligne: "Vente en ligne",
  commerce: "Commerce",
  achat_revente: "Achat revente",
  restauration: "Restauration",
  services_personne: "Services à la personne",
  other: "Autres",
} as const;

export const STATUS_LABELS = {
  draft: "Brouillon",
  pending_payment: "En attente de paiement",
  paid: "Payé",
  documents_pending: "Documents en attente",
  documents_uploaded: "Documents téléversés",
  under_review: "En cours de vérification",
  submitted_to_greffe: "Soumis au Greffe",
  completed: "Terminé",
  rejected: "Rejeté",
} as const;

export const PRICING = {
  sas: 19900,
  sasu: 14900,
  sarl: 19900,
  eurl: 14900,
  auto_entrepreneur: 0,
} as const;

export const REQUIRED_DOCUMENTS = {
  sas: [
    { type: "id_president", label: "Pièce d'identité du Président" },
    { type: "id_associates", label: "Pièces d'identité des associés" },
    { type: "proof_address_president", label: "Justificatif de domicile du Président" },
    { type: "proof_address_company", label: "Justificatif de domiciliation de la société" },
  ],
  sasu: [
    { type: "id_president", label: "Pièce d'identité du Président" },
    { type: "proof_address_president", label: "Justificatif de domicile du Président" },
    { type: "proof_address_company", label: "Justificatif de domiciliation de la société" },
  ],
  sarl: [
    { type: "id_gerant", label: "Pièce d'identité du Gérant" },
    { type: "id_associates", label: "Pièces d'identité des associés" },
    { type: "proof_address_gerant", label: "Justificatif de domicile du Gérant" },
    { type: "proof_address_company", label: "Justificatif de domiciliation de la société" },
  ],
  eurl: [
    { type: "id_gerant", label: "Pièce d'identité du Gérant" },
    { type: "proof_address_gerant", label: "Justificatif de domicile du Gérant" },
    { type: "proof_address_company", label: "Justificatif de domiciliation de la société" },
  ],
  auto_entrepreneur: [
    { type: "id", label: "Pièce d'identité" },
    { type: "proof_address", label: "Justificatif de domicile" },
  ],
} as const;
