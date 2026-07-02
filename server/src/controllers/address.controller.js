import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  addAddressService,
  deleteAddressService,
  getAddressesService,
  setDefaultAddressService,
  updateAddressService,
} from "../services/address.service.js";

export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await getAddressesService(req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, addresses, "Addresses fetched successfully"));
});

export const addAddress = asyncHandler(async (req, res) => {
  const addresses = await addAddressService(req.user._id, req.body);

  res
    .status(201)
    .json(new ApiResponse(201, addresses, "Address added successfully"));
});

export const updateAddress = asyncHandler(async (req, res) => {
  const addresses = await updateAddressService(
    req.user._id,
    req.params.addressId,
    req.body
  );

  res
    .status(200)
    .json(new ApiResponse(200, addresses, "Address updated successfully"));
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const addresses = await deleteAddressService(req.user._id, req.params.addressId);

  res
    .status(200)
    .json(new ApiResponse(200, addresses, "Address deleted successfully"));
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const addresses = await setDefaultAddressService(
    req.user._id,
    req.params.addressId
  );

  res
    .status(200)
    .json(new ApiResponse(200, addresses, "Default address updated"));
});