import React, { useState, useEffect } from "react";
import { DollarSign, Plus, Minus, History, Check, X } from "lucide-react";
import { API_ENDPOINTS, apiRequest } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
}

interface WithdrawRequest {
  _id: string;
  userId: string;
  userName: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  paymentMethod: string;
  accountDetails: string;
  transactionId?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

interface Transaction {
  _id: string;
  userId: string;
  userName: string;
  type: "Add" | "Deduct";
  amount: number;
  date: string;
  description: string;
  status: "completed" | "pending" | "failed";
}

const tableCellClass =
  "border dark:border-gray-700 px-4 py-2 text-black dark:text-white";
const tableHeaderClass = "bg-gray-100 dark:bg-gray-800 " + tableCellClass;

const BalanceManagement: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>(
    []
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState<"Add" | "Deduct">(
    "Add"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<WithdrawRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, requestsRes, transactionsRes] = await Promise.all([
        apiRequest(API_ENDPOINTS.auth.users.getAll({})),
        apiRequest(API_ENDPOINTS.auth.users.getWithdrawRequests),
        apiRequest(API_ENDPOINTS.auth.users.getTransactions),
      ]);

      setUsers(usersRes.users);
      setWithdrawRequests(requestsRes.requests);
      setTransactions(transactionsRes.transactions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setAmount("");
    setDescription("");
    setTransactionType("Add");
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setAmount("");
    setDescription("");
    setError("");
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      await apiRequest(
        API_ENDPOINTS.auth.users.updateBalance(selectedUser._id),
        {
          method: "POST",
          body: JSON.stringify({
            amount: amt,
            type: transactionType,
            description: description || `${transactionType} balance`,
          }),
        }
      );

      toast({
        title: "Success",
        description: `Balance ${
          transactionType === "Add" ? "added" : "deducted"
        } successfully`,
      });

      handleCloseModal();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process transaction",
        variant: "destructive",
      });
    }
  };

  const handleApproveRequest = async (request: WithdrawRequest) => {
    try {
      await apiRequest(API_ENDPOINTS.auth.users.approveWithdraw(request._id), {
        method: "POST",
      });

      toast({
        title: "Success",
        description: "Withdrawal request approved successfully",
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve withdrawal request",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;

    try {
      await apiRequest(
        API_ENDPOINTS.auth.users.rejectWithdraw(selectedRequest._id),
        {
          method: "POST",
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );

      toast({
        title: "Success",
        description: "Withdrawal request rejected successfully",
      });

      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectionReason("");
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject withdrawal request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full p-8 bg-card rounded-lg shadow-sm border border-border text-foreground dark:bg-gray-900 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Balance Management
        </h2>
      </div>

      <Tabs defaultValue="withdrawals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
          <TabsTrigger value="users">User Balances</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Withdrawal Requests</CardTitle>
              <CardDescription>
                Review and process user withdrawal requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Account Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{request.userName}</TableCell>
                      <TableCell>৳ {request.amount}</TableCell>
                      <TableCell>{request.paymentMethod}</TableCell>
                      <TableCell>{request.accountDetails}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : request.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleApproveRequest(request)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowRejectModal(true);
                              }}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Balances</CardTitle>
              <CardDescription>
                Manage user balances and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>৳ {user.balance}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleOpenModal(user)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Manage Balance
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all balance transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.userName}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 ${
                            transaction.type === "Add"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "Add" ? (
                            <Plus className="w-4 h-4" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell>৳ {transaction.amount}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Balance for {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Add or deduct balance for this user
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTransaction} className="space-y-4">
            <div className="grid gap-2">
              <label>Transaction Type</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={transactionType}
                onChange={(e) =>
                  setTransactionType(e.target.value as "Add" | "Deduct")
                }
              >
                <option value="Add">Add Balance</option>
                <option value="Deduct">Deduct Balance</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label>Amount</label>
              <Input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="grid gap-2">
              <label>Description</label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button type="submit">
                {transactionType === "Add" ? "Add Balance" : "Deduct Balance"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this withdrawal request
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Rejection Reason</label>
              <Input
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setSelectedRequest(null);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectRequest}
              disabled={!rejectionReason}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BalanceManagement;
