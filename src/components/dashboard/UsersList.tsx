import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, apiRequest } from "@/config/api";
import { CheckCircle2, XCircle } from "lucide-react";

interface UserData {
  _id: string;
  name: string;
  email: string;
  number: string;
  role: string;
  referralId?: string;
  category?: string;
  isActive: boolean;
  workerId?: string;
  createdAt: string;
  status?: "pending" | "approved" | "rejected";
  activationStatus?: "active" | "pending" | "rejected";
}

interface ActivationData {
  referralId?: string;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  paymentDate: string;
  notes?: string;
  status?: "pending" | "approved";
}

interface UsersListProps {
  users: UserData[];
  onUsersUpdate: () => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, onUsersUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [activationData, setActivationData] = useState<ActivationData>({
    referralId: "",
    paymentMethod: "",
    transactionId: "",
    amount: 0,
    paymentDate: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [userRole, setUserRole] = useState<string>("");

  const { toast } = useToast();

  useEffect(() => {
    // Fetch user role on component mount
    const fetchUserRole = async () => {
      try {
        const response = await apiRequest(API_ENDPOINTS.auth.profile.get);
        setUserRole(response.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };
    fetchUserRole();
  }, []);

  const getMaxAmount = () => {
    switch (userRole) {
      case "Admin":
        return Infinity; // Admin can add any amount
      case "Trainer":
      case "Team Leader":
        return 200; // Trainer and Team Leader limited to 200 BDT
      default:
        return 200;
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const maxAmount = getMaxAmount();

    if (value > maxAmount) {
      toast({
        title: "Amount Limit Exceeded",
        description: `Maximum amount allowed is ${maxAmount} BDT`,
        variant: "destructive",
      });
      return;
    }

    setActivationData((prev) => ({
      ...prev,
      amount: value,
    }));
  };

  const handleActivateUser = async (user: UserData) => {
    try {
      setLoading(true);

      // First verify payment
      const verificationData = {
        ...activationData,
        status: userRole === "Admin" ? "approved" : "pending",
      };

      await apiRequest(API_ENDPOINTS.auth.users.verifyPayment(user._id), {
        method: "POST",
        body: JSON.stringify(verificationData),
      });

      // Then activate user if admin
      if (userRole === "Admin") {
        const activationData = {
          referralId: verificationData.referralId,
        };

        await apiRequest(API_ENDPOINTS.auth.users.activateUser(user._id), {
          method: "POST",
          body: JSON.stringify(activationData),
        });
      }

      toast({
        title: "Success!",
        description:
          userRole === "Admin"
            ? "User activated successfully" +
              (verificationData.referralId ? " and referral ID assigned." : ".")
            : "Activation request submitted. Waiting for admin approval.",
      });

      // Reset activation data
      setActivationData({
        referralId: "",
        paymentMethod: "",
        transactionId: "",
        amount: 0,
        paymentDate: new Date().toISOString().split("T")[0],
        notes: "",
      });

      onUsersUpdate();
      setShowActivationDialog(false);
    } catch (error) {
      console.error("Activation error:", error);
      toast({
        title: "Error!",
        description: error.message || "Failed to process request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // console.log(activationData, "activationData");

  const handleDeactivateUser = async (user: UserData) => {
    try {
      setLoading(true);
      await apiRequest(API_ENDPOINTS.auth.users.deactivateUser(user._id), {
        method: "POST",
      });

      toast({
        title: "Success!",
        description: "User deactivated successfully.",
      });

      onUsersUpdate();
    } catch (error) {
      console.error("Deactivation error:", error);
      toast({
        title: "Error!",
        description: "Failed to deactivate user.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openActivationDialog = (user: UserData) => {
    setSelectedUser(user);
    setShowActivationDialog(true);
  };

  return (
    <>
      {/* Users List */}
      <div className="w-full bg-card rounded-lg shadow-sm border border-border text-foreground p-8 dark:bg-gray-900 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
          Users List
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Worker ID</TableHead>
                <TableHead>Referral ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  {/* 
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        user.activationStatus === "active"
                          ? "bg-green-100 text-green-800"
                          : user.activationStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.activationStatus === "active" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : user.activationStatus === "pending" ? (
                        <span>⏳</span>
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {user.activationStatus === "active"
                        ? "Active"
                        : user.activationStatus === "pending"
                        ? "Activation Requested"
                        : "Inactive"}
                    </span>
                  </TableCell> */}

                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        user.activationStatus === "active"
                          ? "bg-green-100 text-green-800"
                          : user.activationStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : user.activationStatus === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {user.activationStatus === "active" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : user.activationStatus === "pending" ? (
                        <span>⏳</span>
                      ) : user.activationStatus === "rejected" ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {user.activationStatus === "active"
                        ? "Active"
                        : user.activationStatus === "pending"
                        ? "Activation Requested"
                        : user.activationStatus === "rejected"
                        ? "Rejected"
                        : "Inactive"}
                    </span>
                  </TableCell>

                  <TableCell>{user.workerId || "N/A"}</TableCell>
                  <TableCell>{user.referralId || "N/A"}</TableCell>
                  <TableCell>
                    {!user.isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openActivationDialog(user)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Activate
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivateUser(user)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Deactivate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Activation Confirmation Dialog */}
      <Dialog
        open={showActivationDialog}
        onOpenChange={setShowActivationDialog}
      >
        <DialogContent className="max-w-2xl w-[95vw] sm:w-full p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Activate User</DialogTitle>
            <DialogDescription>
              Please provide payment verification details and select a referral
              ID.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="font-medium">User Details:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>Name: {selectedUser.name}</div>
                  <div>Email: {selectedUser.email}</div>
                  <div>Role: {selectedUser.role}</div>
                  <div>Number: {selectedUser.number}</div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="font-medium">Payment Verification:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label>Referral ID (Optional)</label>
                    <Input
                      value={activationData.referralId}
                      onChange={(e) =>
                        setActivationData((prev) => ({
                          ...prev,
                          referralId: e.target.value,
                        }))
                      }
                      placeholder="Enter referral ID for commission"
                    />
                  </div>

                  <div className="space-y-2">
                    <label>Payment Method</label>
                    <Select
                      value={activationData.paymentMethod}
                      onValueChange={(value) =>
                        setActivationData((prev) => ({
                          ...prev,
                          paymentMethod: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bkash">Bkash</SelectItem>
                        <SelectItem value="Nagad">Nagad</SelectItem>
                        <SelectItem value="Rocket">Rocket</SelectItem>
                        <SelectItem value="Bank Transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label>Transaction ID</label>
                    <Input
                      value={activationData.transactionId}
                      onChange={(e) =>
                        setActivationData((prev) => ({
                          ...prev,
                          transactionId: e.target.value,
                        }))
                      }
                      placeholder="Enter transaction ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <label>Amount (BDT)</label>
                    <Input
                      type="number"
                      value={activationData.amount}
                      onChange={handleAmountChange}
                      placeholder={`Enter amount (max ${getMaxAmount()} BDT)`}
                      max={getMaxAmount()}
                    />
                  </div>

                  <div className="space-y-2">
                    <label>Payment Date</label>
                    <Input
                      type="date"
                      value={activationData.paymentDate}
                      onChange={(e) =>
                        setActivationData((prev) => ({
                          ...prev,
                          paymentDate: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label>Notes</label>
                    <Input
                      value={activationData.notes}
                      onChange={(e) =>
                        setActivationData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Any additional notes"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowActivationDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedUser && handleActivateUser(selectedUser)}
              disabled={loading || !activationData.transactionId}
              className="w-full sm:w-auto"
            >
              {loading ? "Activating..." : "Activate User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersList;
