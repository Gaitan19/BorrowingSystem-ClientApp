"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { IRequest, IItem, IUser } from "../../../interfaces";
import {
  getRequests,
  deleteRequest,
  createRequest,
  updateRequest,
  approveRejectRequest,
  returnRequest,
} from "../../../services/requests.service";
import AuthGuard from "../../../components/AuthGuard";
import Modal from "../../../components/ui/Modal";
import RequestForm from "../../../components/Requests/Form";
import { toast } from "react-hot-toast";
import Table from "@/components/ui/Table";
import { getItems } from "@/services/items.service";
import { Button } from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import RequestDetails from "@/components/Requests/Details";
import { getUsers } from "@/services/users.service";
import Loading from "@/components/ui/Loading";
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const REQUEST_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
} as const;

const RETURN_STATUS = {
  0: "Pending",
  1: "Returned",
} as const;

type RequestStatus = keyof typeof REQUEST_STATUS;
type ReturnStatus = keyof typeof RETURN_STATUS;

const RequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [items, setItems] = useState<IItem[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<IRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [requestsData, itemsData, usersData] = await Promise.all([
          getRequests(),
          getItems(),
          getUsers(),
        ]);

        setItems(itemsData);
        setUsers(usersData);
        const filteredRequests =
          user?.role === "admin"
            ? requestsData
            : requestsData.filter((r) => r.requestedByUserId === user?.id);

        console.log("Requests Data", filteredRequests);
        setRequests(filteredRequests);
      } catch (error) {
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  const getRequesterName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const numericStatus = parseInt(newStatus) as RequestStatus;
      const isApproved = numericStatus === 1;

      await approveRejectRequest(requestId, isApproved);

      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? {
                ...request,
                requestStatus: numericStatus,
              }
            : request
        )
      );

      toast.success(`Request ${REQUEST_STATUS[numericStatus]} successfully`);
    } catch (error) {
      toast.error("Error updating request status");
    }
  };

  const handleReturn = async (requestId: string) => {
    try {
      await returnRequest(requestId);
      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? {
                ...request,
                returnStatus: 1,
              }
            : request
        )
      );
      toast.success("Items returned successfully");
    } catch (error) {
      toast.error("Error returning items");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      try {
        await deleteRequest(id);
        setRequests((prev) => prev.filter((r) => r.id !== id));
        toast.success("Request deleted successfully");
      } catch (error) {
        toast.error("Error deleting request");
      }
    }
  };

  const handleSubmit = async (data: Omit<IRequest, "id">) => {
    try {
      if (selectedRequest) {
        const updatedRequest = await updateRequest(selectedRequest.id, data);
        setRequests((prev) =>
          prev.map((r) => (r.id === selectedRequest.id ? updatedRequest : r))
        );
        toast.success("Request updated successfully");
      } else {
        const newRequest = await createRequest({
          ...data,
          requestedByUserId: user?.id || "",
        });
        setRequests((prev) => [...prev, newRequest]);
        toast.success("Request created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error saving request");
    }
  };

  return (
    <AuthGuard allowedRoles={["admin", "user"]}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center md:text-left">
            Request Management
          </h1>
          <button
            onClick={() => {
              setSelectedRequest(null);
              setIsModalOpen(true);
            }}
            className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 md:px-6 md:py-3 rounded-lg 
      shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 
      font-medium text-xs md:text-sm"
          >
            <PlusIcon className="h-5 w-5 stroke-2" />
            New Request
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-600 font-medium text-lg">
              No requests found
            </p>
          </div>
        ) : (
          <Table<IRequest>
            columns={[
              {
                header: "Requester",
                accessor: (item: IRequest) =>
                  getRequesterName(item.requestedByUserId),
              },
              {
                header: "Date",
                accessor: (item: IRequest) =>
                  new Date(item.requestDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }),
              },
              {
                header: "Actions",
                accessor: (item: IRequest) => (
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        setSelectedRequest(item);
                        setIsDetailsOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 px-2.5 py-1.5 rounded-md 
                        transition-colors flex items-center gap-1.5 border border-blue-200
                        bg-blue-50 hover:bg-blue-100 text-sm font-medium"
                    >
                      <EyeIcon className="h-4 w-4 stroke-2" />
                      View
                    </button>
                    {user?.role === "admin" && (
                      <>
                        <Select
                          value={item.requestStatus.toString()}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value)
                          }
                          options={[
                            { value: "0", label: "Pending" },
                            { value: "1", label: "Approve" },
                            { value: "2", label: "Reject" },
                          ]}
                          disabled={item.requestStatus !== 0}
                          className={`w-40 px-2.5 py-1.5 rounded-md border text-sm
                            ${
                              item.requestStatus === 1
                                ? "border-green-200 bg-green-50 text-green-700"
                                : item.requestStatus === 2
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-gray-200 bg-gray-50 text-gray-700"
                            }`}
                        />
                        <button
                          onClick={() => {
                            setSelectedRequest(item);
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
                      </>
                    )}
                    {user?.role === "user" && item.returnStatus === 0 && (
                      <button
                        onClick={() => handleReturn(item.id)}
                        className="text-green-600 hover:text-green-700 px-2.5 py-1.5 rounded-md 
                          transition-colors flex items-center gap-1.5 border border-green-200
                          bg-green-50 hover:bg-green-100 text-sm font-medium"
                      >
                        <ArrowPathIcon className="h-4 w-4 stroke-2" />
                        Return
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            data={requests}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${selectedRequest ? "Edit" : "Create"} Request`}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PlusIcon className="h-6 w-6 text-blue-600 stroke-2" />
            </div>
            <h3 className="text-xl font-semibold">
              {selectedRequest ? "Edit Request" : "New Request"}
            </h3>
          </div>
          <RequestForm
            initialData={selectedRequest}
            items={items}
            onSubmit={handleSubmit}
          />
        </Modal>

        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title="Request Details"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-indigo-600 stroke-2" />
            </div>
            <h3 className="text-xl font-semibold">Request Details</h3>
          </div>
          {selectedRequest && (
            <RequestDetails
              request={selectedRequest}
              items={items}
              requesterName={getRequesterName(
                selectedRequest.requestedByUserId
              )}
            />
          )}
        </Modal>
      </div>
    </AuthGuard>
  );
};

export default RequestsPage;
