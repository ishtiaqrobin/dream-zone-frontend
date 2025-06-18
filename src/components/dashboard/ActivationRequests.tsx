"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, apiRequest } from "@/config/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertCircle, Search } from "lucide-react";

interface ActivationRequest {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    number: string;
    role: string;
  };
  paymentMethod: string;
  transactionId: string;
  amount: number;
  paymentDate: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  verifiedBy?: {
    _id: string;
    name: string;
  };
  verifiedAt?: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ActivationRequests = () => {
  const [requests, setRequests] = useState<ActivationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<ActivationRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Pagination state
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Search and filter state
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("all");

  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("page", pagination.page.toString());
      queryParams.append("limit", pagination.limit.toString());
      if (search) queryParams.append("search", search);
      if (selectedStatus && selectedStatus !== "all")
        queryParams.append("status", selectedStatus);
      if (selectedPaymentMethod && selectedPaymentMethod !== "all")
        queryParams.append("paymentMethod", selectedPaymentMethod);

      const response = await apiRequest(
        `${
          API_ENDPOINTS.auth.users.getActivationRequests
        }?${queryParams.toString()}`
      );
      setRequests(response.requests);
      setPagination(
        response.pagination || {
          total: response.requests.length,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(response.requests.length / pagination.limit),
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch activation requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [
    pagination.page,
    pagination.limit,
    search,
    selectedStatus,
    selectedPaymentMethod,
  ]);

  const handleApprove = async (request: ActivationRequest) => {
    try {
      setLoading(true);
      await apiRequest(
        API_ENDPOINTS.auth.users.verifyPayment(request.userId._id),
        {
          method: "POST",
          body: JSON.stringify({
            ...request,
            status: "approved",
          }),
        }
      );

      await apiRequest(
        API_ENDPOINTS.auth.users.activateUser(request.userId._id),
        {
          method: "POST",
        }
      );

      toast({
        title: "Success",
        description: "User activated successfully",
      });

      fetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      setLoading(true);
      await apiRequest(
        API_ENDPOINTS.auth.users.verifyPayment(selectedRequest.userId._id),
        {
          method: "POST",
          body: JSON.stringify({
            ...selectedRequest,
            status: "rejected",
            notes: rejectReason,
          }),
        }
      );

      toast({
        title: "Success",
        description: "Request rejected successfully",
      });

      setShowRejectDialog(false);
      setRejectReason("");
      fetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openRejectDialog = (request: ActivationRequest) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <h1 className="text-2xl font-semibold mb-6">Activation Requests</h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by user name, email, or transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedPaymentMethod}
            onValueChange={setSelectedPaymentMethod}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment Methods</SelectItem>
              <SelectItem value="Bkash">Bkash</SelectItem>
              <SelectItem value="Nagad">Nagad</SelectItem>
              <SelectItem value="Rocket">Rocket</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={pagination.limit.toString()}
            onValueChange={(value) => handleLimitChange(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Payment Details</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No activation requests found
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.userId.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.userId.email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.userId.number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {request.paymentMethod}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {request.transactionId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{request.amount} BDT</TableCell>
                    <TableCell>
                      {new Date(request.paymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status === "approved" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : request.status === "rejected" ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(request)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRejectDialog(request)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>

              <div className="flex gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pagination.page === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Activation Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Rejection Reason
              </label>
              <Input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={!rejectReason || loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Rejecting..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivationRequests;
