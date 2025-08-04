import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  // Handle the webhook
  if (eventType === 'user.created') {
    const { id: userId, email_addresses, username, first_name, last_name, image_url } = evt.data;
    
    try {
      // Create user in our database
      const user = await prisma.user.create({
        data: {
          id: userId,
          email: email_addresses[0]?.email_address || '',
          username: username || `user_${userId.slice(0, 8)}`,
          displayName: first_name && last_name ? `${first_name} ${last_name}` : first_name || username || `User ${userId.slice(0, 8)}`,
          avatarUrl: image_url,
          subscriptionTier: 'FREE',
        },
      });

      console.log('Created user:', user);
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id: userId, email_addresses, username, first_name, last_name, image_url } = evt.data;
    
    try {
      // Update user in our database
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          email: email_addresses[0]?.email_address || '',
          username: username || undefined,
          displayName: first_name && last_name ? `${first_name} ${last_name}` : first_name || username || undefined,
          avatarUrl: image_url,
        },
      });

      console.log('Updated user:', user);
    } catch (error) {
      console.error('Error updating user:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id: userId } = evt.data;
    
    try {
      // Delete user from our database (this will cascade to their projects)
      await prisma.user.delete({
        where: { id: userId },
      });

      console.log('Deleted user:', userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('', { status: 200 })
} 