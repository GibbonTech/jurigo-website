import { createServerFn } from '@tanstack/react-start'
import { db, companies } from '~/db'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const createCompanySchema = z.object({
  name: z.string().min(1),
  legalStructure: z.enum(['sas', 'sasu', 'sarl', 'eurl', 'auto_entrepreneur']),
  activityDomain: z.enum([
    'consulting_freelance',
    'it_web',
    'services_entreprises',
    'construction_travaux',
    'automobile_transport',
    'vente_en_ligne',
    'commerce',
    'achat_revente',
    'restauration',
    'services_personne',
    'other',
  ]),
  activityDescription: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  capitalAmount: z.number().min(1).optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  presidentFirstName: z.string().optional(),
  presidentLastName: z.string().optional(),
  presidentBirthDate: z.string().optional(),
  presidentBirthPlace: z.string().optional(),
  presidentNationality: z.string().optional(),
  presidentAddress: z.string().optional(),
})

export const createCompany = createServerFn({ method: 'POST' })
  .inputValidator(createCompanySchema)
  .handler(async ({ data }) => {
    const [company] = await db
      .insert(companies)
      .values({
        name: data.name,
        legalStructure: data.legalStructure,
        activityDomain: data.activityDomain,
        activityDescription: data.activityDescription,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        capitalAmount: data.capitalAmount,
        address: data.address,
        postalCode: data.postalCode,
        city: data.city,
        presidentFirstName: data.presidentFirstName,
        presidentLastName: data.presidentLastName,
        presidentBirthDate: data.presidentBirthDate,
        presidentBirthPlace: data.presidentBirthPlace,
        presidentNationality: data.presidentNationality,
        presidentAddress: data.presidentAddress,
        status: 'draft',
        currentStep: 1,
      })
      .returning()

    return company
  })

const updateCompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  legalStructure: z.enum(['sas', 'sasu', 'sarl', 'eurl', 'auto_entrepreneur']).optional(),
  activityDomain: z.enum([
    'consulting_freelance', 'it_web', 'services_entreprises', 'construction_travaux',
    'automobile_transport', 'vente_en_ligne', 'commerce', 'achat_revente',
    'restauration', 'services_personne', 'other',
  ]).optional(),
  activityDescription: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  capitalAmount: z.number().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  presidentFirstName: z.string().optional(),
  presidentLastName: z.string().optional(),
  presidentBirthDate: z.string().optional(),
  presidentBirthPlace: z.string().optional(),
  presidentNationality: z.string().optional(),
  presidentAddress: z.string().optional(),
  currentStep: z.number().optional(),
  status: z.enum(['draft', 'pending_payment', 'paid', 'documents_pending', 'documents_uploaded', 'under_review', 'submitted_to_greffe', 'completed', 'rejected']).optional(),
})

export const updateCompany = createServerFn({ method: 'POST' })
  .inputValidator(updateCompanySchema)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data
    
    const [company] = await db
      .update(companies)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, id))
      .returning()

    return company
  })

const getCompanySchema = z.object({ id: z.string().uuid() })

export const getCompany = createServerFn({ method: 'GET' })
  .inputValidator(getCompanySchema)
  .handler(async ({ data }) => {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, data.id))

    return company
  })

const getCompaniesByEmailSchema = z.object({ email: z.string().email() })

export const getCompaniesByEmail = createServerFn({ method: 'GET' })
  .inputValidator(getCompaniesByEmailSchema)
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.contactEmail, data.email))

    return result
  })

const submitCompanySchema = z.object({ id: z.string().uuid() })

export const submitCompany = createServerFn({ method: 'POST' })
  .inputValidator(submitCompanySchema)
  .handler(async ({ data }) => {
    const [company] = await db
      .update(companies)
      .set({
        status: 'pending_payment',
        currentStep: 5,
        submittedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(companies.id, data.id))
      .returning()

    return company
  })

const linkCompanyToUserSchema = z.object({
  companyId: z.string().uuid(),
  userId: z.string(),
})

export const linkCompanyToUser = createServerFn({ method: 'POST' })
  .inputValidator(linkCompanyToUserSchema)
  .handler(async ({ data }) => {
    const [company] = await db
      .update(companies)
      .set({
        userId: data.userId,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, data.companyId))
      .returning()

    return company
  })

export const getCompaniesByUser = createServerFn({ method: 'GET' })
  .handler(async () => {
    // This will be called from a loader, so we need to get the session
    // For now, return empty array - will be populated when auth is properly integrated
    // In production, this would use getRequest() to get the session and filter by userId
    try {
      const result = await db
        .select()
        .from(companies)
        .orderBy(companies.createdAt)
      return result
    } catch {
      return []
    }
  })
