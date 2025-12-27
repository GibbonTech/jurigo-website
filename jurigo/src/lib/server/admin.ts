import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '~/lib/auth'
import { db, companies, users } from '~/db'
import { eq, desc, count } from 'drizzle-orm'
import { z } from 'zod'

export const getAdminStats = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const request = getRequest()
    const session = await auth.api.getSession({ headers: request?.headers })
    
    if (!session?.user?.id) {
      return null
    }

    // Check if user is admin
    const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, session.user.id))
    if (user?.role !== 'admin') {
      return null
    }

    // Get stats
    const [totalCompanies] = await db.select({ count: count() }).from(companies)
    const [totalUsers] = await db.select({ count: count() }).from(users)
    
    const statusCounts = await db
      .select({
        status: companies.status,
        count: count(),
      })
      .from(companies)
      .groupBy(companies.status)

    const stats = {
      totalCompanies: totalCompanies?.count || 0,
      totalUsers: totalUsers?.count || 0,
      pendingPayment: 0,
      pendingDocuments: 0,
      underReview: 0,
      completed: 0,
    }

    statusCounts.forEach((row: { status: string; count: number }) => {
      if (row.status === 'pending_payment') stats.pendingPayment = row.count
      if (row.status === 'documents_pending') stats.pendingDocuments = row.count
      if (row.status === 'under_review') stats.underReview = row.count
      if (row.status === 'completed') stats.completed = row.count
    })

    return stats
  } catch {
    return null
  }
})

export const getAllCompanies = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const request = getRequest()
    const session = await auth.api.getSession({ headers: request?.headers })
    
    if (!session?.user?.id) {
      return []
    }

    // Check if user is admin
    const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, session.user.id))
    if (user?.role !== 'admin') {
      return []
    }

    const result = await db
      .select()
      .from(companies)
      .orderBy(desc(companies.createdAt))

    return result
  } catch {
    return []
  }
})

const updateCompanyStatusSchema = z.object({
  companyId: z.string().uuid(),
  status: z.enum(['draft', 'pending_payment', 'paid', 'documents_pending', 'documents_uploaded', 'under_review', 'submitted_to_greffe', 'completed', 'rejected']),
})

export const updateCompanyStatus = createServerFn({ method: 'POST' })
  .inputValidator(updateCompanyStatusSchema)
  .handler(async ({ data }) => {
    const request = getRequest()
    const session = await auth.api.getSession({ headers: request?.headers })
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin
    const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, session.user.id))
    if (user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const updateData: Record<string, unknown> = {
      status: data.status,
      updatedAt: new Date(),
    }

    if (data.status === 'completed') {
      updateData.completedAt = new Date()
    }

    const [company] = await db
      .update(companies)
      .set(updateData)
      .where(eq(companies.id, data.companyId))
      .returning()

    return company
  })
