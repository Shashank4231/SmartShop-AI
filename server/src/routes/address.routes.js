import express from "express";

import {
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../controllers/address.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { addressValidator } from "../validators/address.validator.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", getAddresses);
router.post("/", addressValidator, validate, addAddress);
router.patch("/:addressId", addressValidator, validate, updateAddress);
router.delete("/:addressId", deleteAddress);
router.patch("/:addressId/default", setDefaultAddress);

export default router;