"use client";

import React, { useState, useEffect } from "react";
import { API_ENDPOINTS, apiRequest } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, ArrowUpRight, ArrowDownLeft, History } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Balance {
  currentBalance: number;
  pendingWithdrawals: number;
  totalEarned: number;
}

interface WithdrawRequest {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  paymentMethod: string;
  accountDetails: string;
}

const MyBalance = () => {
  const { toast } = useToast();
  const [balance, setBalance] = useState<Balance>({
    currentBalance: 0,
    pendingWithdrawals: 0,
    totalEarned: 0,
  });
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(API_ENDPOINTS.auth.users.getBalance);
      setBalance(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch balance information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawHistory = async () => {
    try {
      const response = await apiRequest(
        API_ENDPOINTS.auth.users.getWithdrawHistory
      );
      setWithdrawHistory(response.withdrawals);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch withdrawal history",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchWithdrawHistory();
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawAmount || !paymentMethod || !accountDetails) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest(API_ENDPOINTS.auth.users.requestWithdraw, {
        method: "POST",
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          paymentMethod,
          accountDetails,
        }),
      });

      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully",
      });

      setIsWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setPaymentMethod("");
      setAccountDetails("");
      fetchBalance();
      fetchWithdrawHistory();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">My Balance</h1>

      {/* Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance.currentBalance}</div>
            <p className="text-xs text-muted-foreground">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Withdrawals
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${balance.pendingWithdrawals}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance.totalEarned}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Request Button */}
      <Dialog
        open={isWithdrawDialogOpen}
        onOpenChange={setIsWithdrawDialogOpen}
      >
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto">Request Withdrawal</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Withdrawal</DialogTitle>
            <DialogDescription>
              Enter the amount you want to withdraw and your payment details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="amount">Amount</label>
              <Input
                id="amount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="paymentMethod">Payment Method</label>
              <Select
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bkash">Bkash</SelectItem>
                  <SelectItem value="Nagad">Nagad</SelectItem>
                  <SelectItem value="Rocket">Rocket</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="accountDetails">Account Details</label>
              <Input
                id="accountDetails"
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                placeholder="Enter your account details"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsWithdrawDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleWithdraw}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>
            View your past withdrawal requests and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawHistory.map((withdrawal) => (
                <TableRow key={withdrawal._id}>
                  <TableCell>
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${withdrawal.amount}</TableCell>
                  <TableCell>{withdrawal.paymentMethod}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        withdrawal.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : withdrawal.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {withdrawal.status.charAt(0).toUpperCase() +
                        withdrawal.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBalance;
