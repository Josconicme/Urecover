import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { senderId, receiverId, senderName, receiverName, conversationId } = await req.json()

    console.log('Processing chat notification:', { senderId, receiverId, senderName, conversationId })

    // Create notification in database
    const { error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: receiverId,
        title: 'New Chat Request',
        message: `${senderName} wants to start a conversation with you`,
        type: 'message',
        action_url: `/messages`,
        is_read: false
      })

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      throw new Error(`Failed to create notification: ${notificationError.message}`)
    }

    // Get receiver email for notification
    const { data: receiverProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email, full_name')
      .eq('id', receiverId)
      .single()

    if (profileError) {
      console.error('Error fetching receiver profile:', profileError)
    } else if (receiverProfile?.email) {
      // Log email notification (ready for email service integration)
      console.log('Email notification prepared for:', receiverProfile.email)
      console.log('Subject: New Chat Request from', senderName)
      console.log('Body: You have a new chat request from', senderName, 'on U-Recover platform.')
      
      // TODO: Integrate with email service (SendGrid, Resend, etc.)
      // Example for SendGrid:
      // await sendEmail({
      //   to: receiverProfile.email,
      //   subject: `New Chat Request from ${senderName}`,
      //   html: `<p>You have a new chat request from ${senderName} on U-Recover platform.</p>`
      // })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully',
        notificationCreated: !notificationError,
        emailPrepared: !!receiverProfile?.email
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in send-chat-notification function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})