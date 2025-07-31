import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: 'Missing svix headers' },
        { status: 400 }
      )
    }

    // Get the body
    const payload = await request.text()
    const body = JSON.parse(payload)

    // Create a new Svix instance with your secret.
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')

    let evt: any // eslint-disable-line @typescript-eslint/no-explicit-any

    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      })
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return NextResponse.json(
        { error: 'Error verifying webhook' },
        { status: 400 }
      )
    }

    // Handle the webhook
    const eventType = evt.type

    if (eventType === 'user.created') {
      const { id, email_addresses, username, first_name, last_name, image_url } = evt.data

      // Generate a unique username if not provided
      let uniqueUsername = username
      if (!uniqueUsername) {
        const email = email_addresses?.[0]?.email_address || ''
        const baseUsername = email.split('@')[0]
        uniqueUsername = baseUsername
        
        // Check if username exists and append number if needed
        let counter = 1
        while (await prisma.user.findUnique({ where: { username: uniqueUsername } })) {
          uniqueUsername = `${baseUsername}${counter}`
          counter++
        }
      }

      // Create user in our database
      const user = await prisma.user.create({
        data: {
          id: id,
          email: email_addresses?.[0]?.email_address || '',
          username: uniqueUsername,
          displayName: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || uniqueUsername,
          avatarUrl: image_url,
        },
      })

      console.log('Created user:', user)
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, username, first_name, last_name, image_url } = evt.data

      // Update user in our database
      const user = await prisma.user.update({
        where: { id },
        data: {
          email: email_addresses?.[0]?.email_address || '',
          username: username,
          displayName: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || username,
          avatarUrl: image_url,
        },
      })

      console.log('Updated user:', user)
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data

      // Delete user from our database
      await prisma.user.delete({
        where: { id },
      })

      console.log('Deleted user:', id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error handling webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 