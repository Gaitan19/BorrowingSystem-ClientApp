"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import AuthGuard from "../../../components/AuthGuard";
import Table from "../../../components/ui/Table";
import Modal from "../../../components/ui/Modal";
import ItemForm from "../../../components/Items/Form";
import { toast } from "react-hot-toast";
import { IItem } from "../../../interfaces";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../../../services/items.service";
import Loading from "@/components/ui/Loading";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const ItemsPage = () => {
  const [items, setItems] = useState<IItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      toast.error("Error loading items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (data: Omit<IItem, "id">) => {
    try {
      if (selectedItem) {
        const updatedItem = await updateItem(selectedItem.id, data);
        setItems((prev) =>
          prev.map((item) => (item.id === selectedItem.id ? updatedItem : item))
        );
        toast.success("Item updated successfully");
      } else {
        const newItem = await createItem(data);
        setItems((prev) => [...prev, newItem]);
        toast.success("Item created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error saving item");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Item deleted successfully");
      } catch (error) {
        toast.error("Error deleting item");
      }
    }
  };

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center md:text-left">
            Inventory Management
          </h1>
          <button
            onClick={() => {
              setSelectedItem(null);
              setIsModalOpen(true);
            }}
            className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 md:px-6 md:py-3 rounded-lg 
      shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 
      font-medium text-xs md:text-sm"
          >
            <PlusIcon className="h-5 w-5 stroke-2" />
            New Item
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-600 font-medium text-lg">No items found</p>
          </div>
        ) : (
          <Table<IItem>
            columns={[
              {
                header: "Name",
                accessor: "name",
              },
              {
                header: "Description",
                accessor: "description",
              },
              {
                header: "Quantity",
                accessor: (item) => (
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded-md">
                    {item.quantity}
                  </span>
                ),
              },
              {
                header: "Actions",
                accessor: (item) => (
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-700 px-2.5 py-1.5 rounded-md 
                        transition-colors flex items-center gap-1.5 border border-indigo-200
                        bg-indigo-50 hover:bg-indigo-100 text-sm font-medium"
                    >
                      <PencilIcon className="h-4 w-4 stroke-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-md 
                        transition-colors flex items-center gap-1.5 border border-red-200
                        bg-red-50 hover:bg-red-100 text-sm font-medium"
                    >
                      <TrashIcon className="h-4 w-4 stroke-2" />
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
            data={items}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedItem ? "Edit Item" : "Create New Item"}
        >
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <PlusIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">
              {selectedItem ? "Edit Item" : "New Item"}
            </h3>
          </div>
          <ItemForm initialData={selectedItem} onSubmit={handleSubmit} />
        </Modal>
      </div>
    </AuthGuard>
  );
};

export default ItemsPage;
