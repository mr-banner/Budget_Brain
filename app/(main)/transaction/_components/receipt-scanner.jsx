"use client";
import { scanReceipt } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { Camera, Loader2 } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

const ReceiptScanner = ({ onScanComplete }) => {
  const fileRef = useRef();

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scanReceiptResult,
  } = useFetch(scanReceipt);

  const handleClientScriptScan = async (file) => {
    if(file.size > 5 * 1024 * 1024){
      toast.error("File size exceeds 5MB limit.");
      return;
    }
    await scanReceiptFn(file);
  };

  useEffect(()=>{
    if(scanReceiptResult && !scanReceiptLoading){
        onScanComplete(scanReceiptResult);
        toast.success("Receipt scanned successfully");
    }
  },[scanReceiptResult, scanReceiptLoading])

  return (
    <div>
      <input
        type="file"
        ref={fileRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleClientScriptScan(file);
        }}
      />
      <Button
        type="button"
        variant={"outline"}
        onClick={() => fileRef.current.click()}
        disabled={scanReceiptLoading}
        className={
          "w-full h-10 bg-gradient-to-r from-[#8E2DE2] via-[#cd5df0] to-[#4A00E0] animate-gradient text-white font-medium flex items-center justify-center hover:opacity-90"
        }
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt With AI</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ReceiptScanner;
