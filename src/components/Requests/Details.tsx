// src/components/Requests/Details.tsx
'use client';

import { IItem, IRequest } from "@/interfaces";

const REQUEST_STATUS_MAP = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected'
} as const;

const RETURN_STATUS_MAP = {
  0: 'Pending',
  1: 'Returned'
} as const;

interface RequestDetailsProps {
  request: IRequest;
  items: IItem[];
  requesterName: string;
}

const RequestDetails = ({ request, items, requesterName }: RequestDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Requester</label>
          <p className="mt-1">{requesterName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Request Date</label>
          <p className="mt-1">{new Date(request.requestDate).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <p className="mt-1 capitalize">
            {REQUEST_STATUS_MAP[request.requestStatus as keyof typeof REQUEST_STATUS_MAP]}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Return Status</label>
          <p className="mt-1 capitalize">
            {RETURN_STATUS_MAP[request.returnStatus as keyof typeof RETURN_STATUS_MAP]}
          </p>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <p className="mt-1 whitespace-pre-line">{request.description}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
        <div className="space-y-2">
          {request.requestItems.map((item, index) => {
            const itemDetail = items.find(i => i.id === item.itemId);
            return (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{itemDetail?.name || 'Unknown Item'}</p>
                  <p className="text-sm text-gray-500">{itemDetail?.description}</p>
                </div>
                <span className="font-mono">x{item.quantity}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;