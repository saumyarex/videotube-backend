import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserInfo,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verfyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatarImage",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verfyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/reset-password").post(verfyJWT, changeCurrentPassword);
router.route("/current-user").get(verfyJWT, getCurrentUser);
router.route("/update-account").patch(verfyJWT, updateUserInfo);
router.route("/avatar").patch(verfyJWT, upload.single("avatar"), updateAvatar);
router
  .route("/cover-image")
  .patch(verfyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/channel/:username").get(verfyJWT, getUserChannelProfile);
router.route("/watch-history").get(verfyJWT, getWatchHistory);

export default router;
