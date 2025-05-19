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

// Mapeo de estados numéricos
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
          user?.role === "admin" ? getUsers() : Promise.resolve([]),
        ]);

        setItems(itemsData);
        setUsers(usersData);
        const filteredRequests =
          user?.role === "admin"
            ? requestsData
            : requestsData.filter((r) => r.requestedByUserId === user?.id);

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
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Requests</h1>
          {user?.role === "admin" || user?.role === 'user' && (
            <Button
              onClick={() => {
                setSelectedRequest(null);
                setIsModalOpen(true);
              }}
              variant="primary"
            >
              + New Request
            </Button>
          )}
        </div>

        {loading ? (
            <Loading className="min-h-[200px]" />
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No requests found
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
                  new Date(item.requestDate).toLocaleDateString(),
              },
              {
                header: "Actions",
                accessor: (item: IRequest) => (
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(item);
                        setIsDetailsOpen(true);
                      }}
                    >
                      Show
                    </Button>
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
                          className="w-40"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(item);
                            setIsModalOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </>
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
