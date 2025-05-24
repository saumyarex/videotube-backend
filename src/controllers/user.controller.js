import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { fileUploadingToCloudinary } from "../utils/Cloudinary.js";

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
  console.log("Full Name : ", fullName, "Username : ", username);

  if (
    [fullName, username, email, password].some((field) => field?.trime() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  const avatarLocalPath = req.files?.avatarImage[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Please upload avatar ");
  }

  const avatar = await fileUploadingToCloudinary(avatarLocalPath);
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

  const createdUser = User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Internal Server Error");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
