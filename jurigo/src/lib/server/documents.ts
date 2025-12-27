import { createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'
import { auth } from '~/lib/auth'
import { db, documents, companies, users } from '~/db'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getUploadUrl, getDownloadUrl, deleteFile, generateFileKey } from '~/lib/r2'

const getUploadUrlSchema = z.object({
  companyId: z.string().uuid(),
  documentType: z.string(),
  fileName: z.string(),
  contentType: z.string(),
})

export const getDocumentUploadUrl = createServerFn({ method: 'POST' })
  .inputValidator(getUploadUrlSchema)
  .handler(async ({ data }) => {
    const request = getWebRequest()
    const session = await auth.api.getSession({ headers: request?.headers })
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    // Verify user owns this company or is admin
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, data.companyId))

    if (!company) {
      throw new Error('Company not found')
    }

    const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, session.user.id))
    
    if (company.userId !== session.user.id && user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const key = generateFileKey(data.companyId, data.documentType, data.fileName)
    const uploadUrl = await getUploadUrl(key, data.contentType)

    return { uploadUrl, key }
  })

const saveDocumentSchema = z.object({
  companyId: z.string().uuid(),
  type: z.string(),
  name: z.string(),
  key: z.string(),
  url: z.string(),
  size: z.number().optional(),
  mimeType: z.string().optional(),
})

export const saveDocument = createServerFn({ method: 'POST' })
  .inputValidator(saveDocumentSchema)
  .handler(async ({ data }) => {
    const request = getWebRequest()
    const session = await auth.api.getSession({ headers: request?.headers })
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const [document] = await db
      .insert(documents)
      .values({
        companyId: data.companyId,
        type: data.type,
        name: data.name,
        key: data.key,
        url: data.url,
        size: data.size,
        mimeType: data.mimeType,
        status: 'pending',
      })
      .returning()

    return document
  })

const getDocumentsSchema = z.object({
  companyId: z.string().uuid(),
})

export const getCompanyDocuments = createServerFn({ method: 'GET' })
  .inputValidator(getDocumentsSchema)
  .handler(async ({ data }) => {
    const request = getWebRequest()
    const session = await auth.api.getSession({ headers: request?.headers })
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const result = await db
      .select()
      .from(documents)
      .where(eq(documents.companyId, data.companyId))

    return result
  })

const getDocumentDownloadUrlSchema = z.object({
  documentId: z.string().uuid(),
})

export const getDocumentDownloadUrl = createServerFn({ method: 'GET' })
  .inputValidator(getDocumentDownloadUrlSchema)
  .handler(async ({ data }) => {
    const request = getWebRequest()
    const session = await auth.api.getSession({ headers: request?.headers })
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, data.documentId))

    if (!document) {
      throw new Error('Document not found')
    }

    const downloadUrl = await getDownloadUrl(document.key)
    return { downloadUrl }
  })

const deleteDocumentSchema = z.object({
  documentId: z.string().uuid(),
})

export const deleteDocument = createServerFn({ method: 'POST' })
  .inputValidator(deleteDocumentSchema)
  .handler(async ({ data }) => {
    const request = getWebRequest()
    const session = await auth.api.getSession({ headers: request?.headers })
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, data.documentId))

    if (!document) {
      throw new Error('Document not found')
    }

    // Delete from R2
    await deleteFile(document.key)

    // Delete from database
    await db.delete(documents).where(eq(documents.id, data.documentId))

    return { success: true }
  })

const verifyDocumentSchema = z.object({
  documentId: z.string().uuid(),
  status: z.enum(['approved', 'rejected']),
  notes: z.string().optional(),
})

export const verifyDocument = createServerFn({ method: 'POST' })
  .inputValidator(verifyDocumentSchema)
  .handler(async ({ data }) => {
    const request = getWebRequest()
    const session = await auth.api.getSession({ headers: request?.headers })
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin
    const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, session.user.id))
    if (user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const [document] = await db
      .update(documents)
      .set({
        status: data.status,
        notes: data.notes,
        verifiedAt: new Date(),
        verifiedBy: session.user.id,
      })
      .where(eq(documents.id, data.documentId))
      .returning()

    return document
  })
