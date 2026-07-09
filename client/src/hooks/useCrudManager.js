import { useState } from "react";

function useCrudManager() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const openCreate = () => {
    setEditingItem(null);
    setOpenDrawer(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setOpenDrawer(true);
  };

  const closeDrawer = () => {
    setEditingItem(null);
    setOpenDrawer(false);
  };

  return {
    openDrawer,
    editingItem,
    itemToDelete,

    setItemToDelete,

    openCreate,
    openEdit,
    closeDrawer,
  };
}

export default useCrudManager;