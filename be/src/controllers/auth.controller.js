const { login } = require("../services/auth.service");
const { HTTP_STATUS, AUTH_ERRORS } = require("../constants");
const jwt = require('./../utils/jwt');
const cookies = require("cookie-parser");

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await login(email, password);
        //set cookie
        const accessToken = jwt.generateAccessToken({ userid: user.userid, role: user.role }, process.env.JWT_EXPIRES_IN);
        const refreshToken = jwt.generateRefreshToken({ userid: user.userid, role: user.role }, process.env.JWT_REFRESH_EXPIRES_IN);
     
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });

        //Trả về data và token
        res.status(HTTP_STATUS.OK).json({ 
            success: true,
            data: {
                id: user.userid,
                email: user.email,
                fullname: user.fullname,
                role: user.role,
                phone: user.phone,
                address: user.address,
                dob: user.dob,
                gender: user.gender,
                isactive: user.isactive
            },
            token: {
                accessToken: accessToken,
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        });
            }
     catch (error) {
        next(error);
    }
};

module.exports = { loginController };