import { eq, sql } from 'drizzle-orm';
import { db } from './index.ts';
import { studentProfiles, users } from './schema.ts';

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || 'rakshanreddykanneti@gmail.com')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName = 'Class 10 Student',
  photoUrl: string | null = null
) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existing.length > 0) {
      const current = existing[0];
      const shouldPromote =
        ADMIN_EMAILS.has(email.toLowerCase()) && current.role !== 'admin';
      if (shouldPromote || current.displayName !== displayName || current.photoUrl !== photoUrl) {
        const updated = await db
          .update(users)
          .set({
            email,
            displayName,
            photoUrl,
            role: shouldPromote ? 'admin' : current.role,
            updatedAt: new Date(),
          })
          .where(eq(users.id, current.id))
          .returning();
        return updated[0];
      }
      return current;
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users);

    const initialRole =
      ADMIN_EMAILS.has(email.toLowerCase()) || count === 0 ? 'admin' : 'student';

    const inserted = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName,
        photoUrl,
        role: initialRole,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName,
          photoUrl,
          updatedAt: new Date(),
        },
      })
      .returning();

    const user = inserted[0];
    const today = new Date().toISOString().slice(0, 10);

    await db
      .insert(studentProfiles)
      .values({
        userId: user.id,
        lastActiveDate: today,
      })
      .onConflictDoNothing({ target: studentProfiles.userId });

    return user;
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Failed to synchronize user account.', { cause: error });
  }
}
