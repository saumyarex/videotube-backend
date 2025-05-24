import { asyncHandler } from "../utils/asyncHandler.js";

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
});

export { registerUser };
