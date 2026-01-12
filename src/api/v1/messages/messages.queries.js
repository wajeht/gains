import db from '../../../db/db.js';

export async function getConversations(userId) {
  // Get distinct conversations with latest message
  const conversations = await db.raw(
    `
    SELECT
      CASE
        WHEN sender_id = ? THEN recipient_id
        ELSE sender_id
      END as other_user_id,
      MAX(created_at) as last_message_at
    FROM messages
    WHERE sender_id = ? OR recipient_id = ?
    GROUP BY other_user_id
    ORDER BY last_message_at DESC
  `,
    [userId, userId, userId],
  );

  // Get user details and last message for each conversation
  const results = [];
  for (const conv of conversations) {
    const [user] = await db('users')
      .join('user_details', 'users.id', '=', 'user_details.user_id')
      .select(
        'users.id',
        'users.username',
        'user_details.first_name',
        'user_details.last_name',
        'user_details.profile_picture_url',
      )
      .where('users.id', conv.other_user_id);

    const [lastMessage] = await db('messages')
      .where(function () {
        this.where({ sender_id: userId, recipient_id: conv.other_user_id }).orWhere({
          sender_id: conv.other_user_id,
          recipient_id: userId,
        });
      })
      .orderBy('created_at', 'desc')
      .limit(1);

    const unreadCount = await db('messages')
      .where({ sender_id: conv.other_user_id, recipient_id: userId })
      .whereNull('read_at')
      .count('id as count')
      .first();

    results.push({
      user,
      lastMessage,
      unreadCount: unreadCount?.count || 0,
    });
  }

  return results;
}

export async function getMessagesBetweenUsers(userId, otherUserId, pagination) {
  return db('messages')
    .where(function () {
      this.where({ sender_id: userId, recipient_id: otherUserId }).orWhere({
        sender_id: otherUserId,
        recipient_id: userId,
      });
    })
    .orderBy('created_at', 'asc')
    .paginate(pagination);
}

export async function createMessage(senderId, recipientId, content) {
  return db('messages')
    .insert({ sender_id: senderId, recipient_id: recipientId, content })
    .returning('*');
}

export async function markAsRead(messageId, recipientId) {
  return db('messages')
    .where({ id: messageId, recipient_id: recipientId })
    .update({ read_at: db.fn.now() })
    .returning('*');
}

export async function markConversationAsRead(userId, otherUserId) {
  return db('messages')
    .where({ sender_id: otherUserId, recipient_id: userId })
    .whereNull('read_at')
    .update({ read_at: db.fn.now() });
}

export async function getMessageById(id) {
  return db('messages').where({ id }).first();
}
