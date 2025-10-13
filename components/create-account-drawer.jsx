"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { useForm } from "react-hook-form";
import { accountSchema } from "@/app/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { createAccount } from "@/actions/dashboard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {data: newAccount, error, fn:createAccountFn, loading:isLoading} = useFetch(createAccount);

  useEffect(()=>{
    if(newAccount && !isLoading){
      console.log(newAccount);
      toast.success("Account created successfully");
      setOpen(false);
      reset();
    }
  },[newAccount,isLoading])

  useEffect(()=>{
    if(error){
      toast.error(error.message || "Failed to create account");
    }
  },[error])

  const handleFormSubmit = async (data) =>{
    await createAccountFn(data);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g, Main checking"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger id="type" className="w-full ring-offset-0">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="balance" className="text-sm font-medium">
                Initial Balance
              </label>
              <Input
                id="balance"
                placeholder="0.0"
                type="number"
                step="0.01"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label
                  htmlFor="isDefault"
                  className="text-sm font-medium cursor-pointer"
                >
                  Set as Default
                </label>
                <p className="text-sm text-muted-foreground">This account will be selected by default for transactions</p>
              </div>
              <Switch
              id="isDefault"
              onCheckedChange = {(checked)=> setValue("isDefault", checked)}
              checked = {watch("isDefault")}
              className={"cursor-pointer"}
              />
            </div>
            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
                <Button type="button" variant={"outline"} className="flex-1 btn-outline hover:bg-white hover:shadow-[#d5caff]/80 hover:border-[#7f5efd] hover:shadow-md hover:text-[#7f5efd]">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type = "submit" 
              className="flex-1 btn hover:shadow-xl hover:shadow-[#d5caff]/80 hover:bg-[#7f5efd]"
              disabled = {isLoading}
              >
                {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin mr-2"/> Creating...</>) : ("Create Account")}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
