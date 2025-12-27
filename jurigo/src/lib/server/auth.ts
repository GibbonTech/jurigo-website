import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '~/lib/auth'
import { db, users } from '~/db'
import { eq } from 'drizzle-orm'

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request?.headers,
    })
    return session
  }
)

export const getUserRole = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request?.headers,
    })
    
    if (!session?.user?.id) {
      return null
    }

    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))

    return user?.role || 'client'
  }
)

export const isAdmin = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request?.headers,
    })
    
    if (!session?.user?.id) {
      return false
    }

    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))

    return user?.role === 'admin'
  }
)
