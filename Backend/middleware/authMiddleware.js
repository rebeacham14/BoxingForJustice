const { verifyToken, createClerkClient } = require('@clerk/backend');

// Verifies a Clerk session token sent as `Authorization: Bearer <token>`.
// Sets req.auth = { userId } (Clerk's convention), replacing the old
// custom-JWT req.user. Clerk is now the sole identity system for
// /mma-events - there is no more local User model or role field.
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    req.auth = { userId: payload.sub };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Gates the site-editor write routes. Must run after authMiddleware (needs
// req.auth.userId already set). Checked via a live Clerk lookup rather than
// a custom JWT claim so there's no Clerk Dashboard JWT template to
// misconfigure - the owner flag lives in one place, Clerk's dashboard.
async function requireOwner(req, res, next) {
  try {
    const user = await clerkClient.users.getUser(req.auth.userId);

    if (user.publicMetadata?.role !== 'owner') {
      return res.status(403).json({ message: 'Owner access required' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Owner access required' });
  }
}

module.exports = { authMiddleware, requireOwner };
