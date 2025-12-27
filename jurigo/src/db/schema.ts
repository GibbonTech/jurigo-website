import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

// Enums
export const legalStructureEnum = pgEnum("legal_structure", [
  "sas",
  "sasu",
  "sarl",
  "eurl",
  "auto_entrepreneur",
]);

export const companyStatusEnum = pgEnum("company_status", [
  "draft",
  "pending_payment",
  "paid",
  "documents_pending",
  "documents_uploaded",
  "under_review",
  "submitted_to_greffe",
  "completed",
  "rejected",
]);

export const activityDomainEnum = pgEnum("activity_domain", [
  "consulting_freelance",
  "it_web",
  "services_entreprises",
  "construction_travaux",
  "automobile_transport",
  "vente_en_ligne",
  "commerce",
  "achat_revente",
  "restauration",
  "services_personne",
  "other",
]);

// Better Auth tables
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("client"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Company creation tables
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  
  // Basic info
  name: text("name").notNull(),
  legalStructure: legalStructureEnum("legal_structure").notNull(),
  activityDomain: activityDomainEnum("activity_domain").notNull(),
  activityDescription: text("activity_description"),
  
  // Status
  status: companyStatusEnum("status").notNull().default("draft"),
  currentStep: integer("current_step").notNull().default(1),
  
  // Contact info (collected before account creation)
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  
  // Company details
  address: text("address"),
  postalCode: text("postal_code"),
  city: text("city"),
  capitalAmount: integer("capital_amount"),
  
  // President/Gérant info
  presidentFirstName: text("president_first_name"),
  presidentLastName: text("president_last_name"),
  presidentBirthDate: text("president_birth_date"),
  presidentBirthPlace: text("president_birth_place"),
  presidentNationality: text("president_nationality"),
  presidentAddress: text("president_address"),
  
  // Associates (for SAS, SARL)
  associates: jsonb("associates").$type<Associate[]>(),
  
  // Payment
  paymentIntentId: text("payment_intent_id"),
  paidAt: timestamp("paid_at"),
  amount: integer("amount"),
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  submittedAt: timestamp("submitted_at"),
  completedAt: timestamp("completed_at"),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  
  type: text("type").notNull(),
  name: text("name").notNull(),
  key: text("key").notNull(),
  url: text("url").notNull(),
  size: integer("size"),
  mimeType: text("mime_type"),
  
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: text("verified_by").references(() => users.id),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
});

export const adminNotes = pgTable("admin_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  adminId: text("admin_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Types
export type Associate = {
  firstName: string;
  lastName: string;
  email: string;
  sharePercentage: number;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  address?: string;
};

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
