
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

export function checkAdmin(handler: NextApiHandler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        // Assuming you have a way to verify the user, e.g., JWT token
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            // Verify token and extract user info (for simplicity, using a mock function here)
            const user = verifyToken(token);

            if (!user || !user.isAdmin) {
                return res.status(403).json({ message: 'Forbidden: Admins only' });
            }

            // If the user is an admin, proceed with the handler
            return handler(req, res);
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    };
}

// Mock function to demonstrate token verification
function verifyToken(token: string) {
    // This function should verify the token and return the user information
    // For example, you might decode a JWT and check the user's roles
    return { isAdmin: true }; // Mock response, replace with actual verification logic
}
