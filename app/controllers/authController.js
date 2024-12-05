const jwt = require('jsonwebtoken');
const prisma = require('../../prisma/prismaClient');

const SECRET_KEY = 'your-secret-key'; // 실제로는 환경 변수로 관리하세요.
const REFRESH_SECRET_KEY = 'your-refresh-secret-key';

// POST /auth/login
exports.login = async (req, res) => {
    const {userId, password} = req.body;

    console.log(userId, password)

    if (!userId || !password) {
        return res.status(401).json({error: 'Email and password are required'});
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                AND: [
                    {user_id: userId},
                    {password: password},
                ],
            },
        });

        console.log(user)

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        if (user.password !== password) {
            return res.status(401).json({error: 'Password is incorrect'});
        }

        if (!user) {
            return res.status(404).json({error: 'Invalid credentials'});
        }

        // JWT 생성
        const accessToken = jwt.sign(
            {userId: user.user_id}, // Payload
            SECRET_KEY, // 비밀키
            {expiresIn: '1h'} // 만료 시간
        );

        const refreshToken = jwt.sign(
            {userId: user.user_id},
            REFRESH_SECRET_KEY,
            {expiresIn: '7d'}
        );

        console.log(accessToken, refreshToken)

        // Refresh Token을 DB에 저장 (선택적)
        await prisma.user.update({
            where: {user_id: user.user_id},
            data: {access_token: accessToken, refresh_token: refreshToken},
        });

        // 클라이언트에 토큰 반환
        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to login'});
    }
}

// POST /auth/refresh
exports.refresh = async (req, res) => {
    const {refresh_token} = req.body;

    if (!refresh_token) {
        return res.status(400).json({error: 'Refresh token is required'});
    }

    try {
        const user = await prisma.user.findFirst({
            where: {refresh_token},
        });

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to refresh token'});
    }
}

// POST /auth/logout
exports.logout = async (req, res) => {
    const {user_id} = req.body;

    if (!user_id) {
        return res.status(400).json({error: 'User ID is required'});
    }

    try {
        await prisma.user.update({
            where: {user_id},
            data: {access_token: null, refresh_token: null},
        });

        res.status(200).json({message: 'Logout successful'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to logout'});
    }
}

// POST /auth/cookieSample
exports.cookieSample = (req, res) => {
    console.log(req)
    res.cookie("authToken", "abc123", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.status(200).json({message: 'Cookie set'});
}

// POST /auth/sessionSample
exports.sessionSample = (req, res) => {
    req.session.sessionName = 'session sample success';
    res.status(200).json(req.session.sessionName);
}

// POST /auth/jwtSample
exports.jwtSample = (req, res) => {
    const token = jwt.sign
    ({
            userId: 'jwtValue',
        },
        SECRET_KEY,
        {expiresIn: '1h'}
    );

    res.status(200).json({message: 'JWT set', token});
}