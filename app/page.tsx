/**
 * Root Page
 * Redirects to dashboard (authenticated users) or login
 */

import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/dashboard')
}
