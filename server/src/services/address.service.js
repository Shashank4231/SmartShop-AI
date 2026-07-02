import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const getAddressesService = async (userId) => {
  const user = await User.findById(userId).select("addresses");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user.addresses;
};

export const addAddressService = async (userId, addressData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (addressData.isDefault) {
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });
  }

  if (user.addresses.length === 0) {
    addressData.isDefault = true;
  }

  user.addresses.push(addressData);
  await user.save();

  return user.addresses;
};

export const updateAddressService = async (userId, addressId, addressData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  if (addressData.isDefault) {
    user.addresses.forEach((item) => {
      item.isDefault = false;
    });
  }

  Object.assign(address, addressData);

  await user.save();

  return user.addresses;
};

export const deleteAddressService = async (userId, addressId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  const wasDefault = address.isDefault;

  user.addresses.pull(addressId);

  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  return user.addresses;
};

export const setDefaultAddressService = async (userId, addressId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  user.addresses.forEach((item) => {
    item.isDefault = false;
  });

  address.isDefault = true;

  await user.save();

  return user.addresses;
};