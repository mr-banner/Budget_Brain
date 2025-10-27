"use client";
import { updateDefaultAccount } from "@/actions/account";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import { ArrowDownRight, ArrowUpRight, IndianRupee } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "sonner";

const AccountCard = ({ account }) => {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: isLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleToggleDefault = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isDefault) {
      toast.warning("You need atleat one default account");
      return;
    }
    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success && !isLoading) {
      toast.success("Default account updated successfully");
    }
    if (error) {
      toast.error(error?.message || "Something went wrong");
    }
  }, [updatedAccount, isLoading, error]);

  return (
    <Card className="cursor-pointer 
             relative group 
             sm:pb-3 pb-2.5 
             transition-all duration-500
             hover:bg-[#efecff]/100
             hover:shadow-2xl
             shadow-2xl shadow-slate-300
             hover:backdrop-blur-md
             hover:border hover:border-white/10">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleToggleDefault}
            disabled={isLoading}
            className="cursor-pointer"
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <div>
              <IndianRupee className="inline font-bold mb-1 mr-1 h-5 w-5" />
              {Number(balance).toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;
