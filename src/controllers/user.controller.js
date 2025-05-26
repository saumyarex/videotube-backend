import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { fileUploadingToCloudinary } from "../utils/Cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get data from front-end
  //validation - not empty
  //user already exist - by checking username and email
  //check awatar given or not
  //upload to cloudinary
  //get cloudinary url
  //create user object and create entry in db
  //remove password and refresh token from response
  //check user creation
  //return res

  const { fullName, username, email, password } = req.body;
  //console.log(req.body);

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  const avatarLocalPath = req.files?.avatarImage?.[0]?.path;
  // console.log(req.files);
  // console.log(req.files.avatarImage);
  // console.log(avatarLocalPath);

  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Please upload avatar ");
  }

  const avatar = await fileUploadingToCloudinary(avatarLocalPath);
  //console.log(avatar);
  const coverImage = await fileUploadingToCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Please upload avatar ");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Internal Server Error");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get credential from frontend
  //validate the input fields
  //check user exists or not
  //if user exists genrate token
  //send cookies
  //send success response

  //console.log(req.body);
  const { email, username, password } = req.body;

  if (!email || !username) {
    throw new ApiError(400, "Username or Email required");
  }

  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  console.log(userExist._id);

  if (!userExist) {
    throw new ApiError(404, "User does not exist");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const isPasswordValid = await userExist.isPasswordCorrect(password);

  //console.log(isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userExist._id
  );

  const loggedInUser = await User.findById(userExist._id).select(
    "-password -refreshToken"
  );

  //console.log(loggedInUser);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //remove cookies

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToekn =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToekn) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToekn,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(incomingRefreshToekn?._id);

  if (!user) {
    if (!incomingRefreshToekn) {
      throw new ApiError(401, "Invalid refresh token");
    }
  }

  if (incomingRefreshToekn !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token expired or used");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToekn", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully"
      )
    );
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
