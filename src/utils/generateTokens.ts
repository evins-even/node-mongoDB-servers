import jwt from 'jsonwebtoken';

interface TokenPayload {
    userName: string;
    uuid: string;
    type?: string;
}
// Token 生成函数
const generateTokens = (payload: TokenPayload) => {
    const jwtSecret = process.env.JWT_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
    }
    if (!refreshTokenSecret) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined');
    }

    const accessToken = jwt.sign(
        payload,
        jwtSecret,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        Object.assign({}, payload, { type: "refresh" }),
        refreshTokenSecret,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

// jwt 验证函数
// 验证 Access Token
export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }
        const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

        return decoded;
    } catch (error) {
        console.error('Access token verification failed:', error);
        return null;
    }
};
// 验证 Refresh Token
export const verifyRefreshToken = (token: string): TokenPayload | null => {
    try {
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!refreshTokenSecret) {
            throw new Error('REFRESH_TOKEN_SECRET is not defined');
        }

        const decoded = jwt.verify(token, refreshTokenSecret) as TokenPayload;

        // 检查 token 类型是否为 refresh
        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }

        return decoded;
    } catch (error) {
        console.error('Refresh token verification failed:', error);
        return null;
    }
};



export default generateTokens;