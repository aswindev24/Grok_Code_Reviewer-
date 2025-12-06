const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

exports.googleCallback = (req, res) => {
    try {
        const token = generateToken(req.user);
        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
    } catch (error) {
        console.error(error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
};

exports.getMe = (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
};

exports.logout = (req, res) => {
    // For JWT, we just send success. Client handles token removal.
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
