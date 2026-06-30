import jwt from "jsonwebtoken";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  registerUserService,
} from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const registerUser = asyncHandler(async (req, res) => {
  const createdUser = await registerUserService(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginUserService(req.body);

  res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user,
          accessToken,
        },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await logoutUserService(req.cookies.refreshToken);

  res
    .status(200)
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await refreshAccessTokenService(
    req.cookies.refreshToken,
    jwt
  );

  res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
        },
        "Access token refreshed successfully"
      )
    );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});