import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Webhook } from 'svix'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const headerPayload = await headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
    }

    const payload = await request.json()
    const body = JSON.stringify(payload)

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')
                    let evt: {
                  type: string
                  data: {
                    id: string
                    email_addresses?: Array<{ email_address: string }>
                    username?: string
                    first_name?: string
                    last_name?: string
                  }
                }

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      })
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const { id, email_addresses, username, first_name, last_name } = evt.data

    // Handle user.created event
    if (evt.type === 'user.created') {
      const email = email_addresses?.[0]?.email_address
      const displayName = first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name

      if (!email) {
        return NextResponse.json({ error: 'No email provided' }, { status: 400 })
      }

      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email }
        })

        if (existingUser) {
          return NextResponse.json({ message: 'User already exists' })
        }

        // Create new user profile
        const user = await prisma.user.create({
          data: {
            id,
            email,
            username: username || email.split('@')[0], // Use email prefix as fallback username
            displayName,
            subscriptionTier: 'FREE'
          }
        })

        console.log('Created user profile:', user)
        return NextResponse.json({ message: 'User profile created', user })
      } catch (error) {
        console.error('Error creating user profile:', error)
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
      }
    }

    // Handle user.updated event
    if (evt.type === 'user.updated') {
      const email = email_addresses?.[0]?.email_address
      const displayName = first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name

      if (!email) {
        return NextResponse.json({ error: 'No email provided' }, { status: 400 })
      }

      try {
        const user = await prisma.user.update({
          where: { id },
          data: {
            email,
            username: username || email.split('@')[0],
            displayName
          }
        })

        console.log('Updated user profile:', user)
        return NextResponse.json({ message: 'User profile updated', user })
      } catch (error) {
        console.error('Error updating user profile:', error)
        return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 })
      }
    }

    return NextResponse.json({ message: 'Webhook processed' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 