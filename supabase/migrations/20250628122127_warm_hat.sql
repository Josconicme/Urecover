/*
  # Add database trigger for chat notifications

  1. New Functions
    - `notify_counsellor_new_message()` - Trigger function to create notifications when messages are sent to counsellors

  2. New Triggers
    - `trigger_notify_counsellor_new_message` - Fires when a new message is inserted

  3. Changes
    - Automatically creates notifications for counsellors when they receive new messages
    - Only creates notifications for non-system messages
    - Prevents duplicate notifications for the same conversation
*/

-- Function to notify counsellors of new messages
CREATE OR REPLACE FUNCTION notify_counsellor_new_message()
RETURNS TRIGGER AS $$
DECLARE
  receiver_profile RECORD;
  sender_profile RECORD;
  is_counsellor BOOLEAN;
BEGIN
  -- Only process non-system messages
  IF NEW.message_type = 'system' THEN
    RETURN NEW;
  END IF;

  -- Get receiver profile to check if they are a counsellor
  SELECT * INTO receiver_profile 
  FROM profiles 
  WHERE id = NEW.receiver_id;

  -- Check if receiver is a counsellor
  SELECT EXISTS(
    SELECT 1 FROM counsellors 
    WHERE user_id = NEW.receiver_id
  ) INTO is_counsellor;

  -- Only create notification if receiver is a counsellor
  IF is_counsellor THEN
    -- Get sender profile for notification content
    SELECT * INTO sender_profile 
    FROM profiles 
    WHERE id = NEW.sender_id;

    -- Create notification for the counsellor
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      action_url,
      is_read
    ) VALUES (
      NEW.receiver_id,
      'New Message',
      COALESCE(sender_profile.full_name, 'A client') || ' sent you a message',
      'message',
      '/messages?conversation=' || NEW.conversation_id,
      false
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new messages
DROP TRIGGER IF EXISTS trigger_notify_counsellor_new_message ON messages;
CREATE TRIGGER trigger_notify_counsellor_new_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_counsellor_new_message();