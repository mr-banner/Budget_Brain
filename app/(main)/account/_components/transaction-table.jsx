"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/Category";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  IndianRupee,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Trash,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { bulkDeleteTransactions } from "@/actions/account";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

const recurringIntervals = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const ITEMS_PER_PAGE = 10;

const TransactionTable = ({ transactions }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [localTransactions, setLocalTransactions] = useState(transactions);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const router = useRouter();

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    console.log("delete started");
    if (
      !window.confirm(
        `Are you sure want to delete ${selectedIds.length} transactions?`
      )
    ) {
      return;
    }
    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted successfully");
      setLocalTransactions((prev) =>
        prev.filter((t) => !selectedIds.includes(t.id))
      );
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const filerdAndSortedTransactions = useMemo(() => {
    let res = [...transactions];
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      res = res.filter((transaction) =>
        transaction.description?.toLowerCase()?.includes(searchLower)
      );
    }

    if (typeFilter) {
      res = res.filter((transaction) => transaction.type === typeFilter);
    }

    if (recurringFilter) {
      res = res.filter((transaction) => {
        if (recurringFilter === "recurring") {
          return transaction.isRecurring;
        }
        return !transaction.isRecurring;
      });
    }

    res.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;

        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return res;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);
  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field: field,
      direction: (prev.field =
        field && prev.direction === "asc" ? "desc" : "asc"),
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item != id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === paginatedTransaction.length
        ? []
        : paginatedTransaction.map((t) => t.id)
    );
  };

  const handleFilterClick = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setPage(1);
    setSelectedIds([]);
  };

  const totalPage = Math.ceil(filerdAndSortedTransactions.length / ITEMS_PER_PAGE)
  const paginatedTransaction = useMemo(()=>{
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filerdAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    )
  },[page, filerdAndSortedTransactions])

  const handlePage = (newPage)=>{
    setPage(newPage);
    setSelectedIds([]);
  }

  return (
    <div className="space-y-4">
      {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#7f5efd" />
      )}
      <div className="flex sm:flex-row flex-col gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            className={"pl-8"}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Transaction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring only</SelectItem>
              <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
            </SelectContent>
          </Select>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size={"sm"}
                onClick={handleBulkDelete}
              >
                <Trash className="h-4 w-4" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}
          {(searchTerm || typeFilter || recurringFilter) && (
            <Button size={"icon"} onClick={handleFilterClick}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <Table>
        <TableCaption>A list of your past 90 days transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                onCheckedChange={handleSelectAll}
                checked={
                  selectedIds.length === paginatedTransaction.length &&
                  paginatedTransaction.length > 0
                }
                className="cursor-pointer border-black"
              />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">
                Date{" "}
                {sortConfig.field === "date" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  ))}
              </div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("category")}
            >
              <div className="flex items-center">
                category{" "}
                {sortConfig.field === "category" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  ))}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("amount")}
            >
              <div className="flex items-center justify-end">
                Amount{" "}
                {sortConfig.field === "amount" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  ))}
              </div>
            </TableHead>
            <TableHead>Recurring</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTransaction.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center mt-1">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            paginatedTransaction.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Checkbox
                    onCheckedChange={() => handleSelect(transaction.id)}
                    checked={selectedIds.includes(transaction.id)}
                    className="cursor-pointer border-black"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.date), "PP")}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="capitalize">
                  <span
                    style={{
                      background: categoryColors[transaction.category],
                    }}
                    className="text-white px-2 py-1 rounded text-sm"
                  >
                    {transaction.category}
                  </span>
                </TableCell>
                <TableCell
                  className="text-right font-medium flex items-center justify-end"
                  style={{
                    color: transaction.type === "EXPENSE" ? "red" : "green",
                  }}
                >
                  {transaction.type === "EXPENSE" ? "-" : "+"}
                  <IndianRupee className="h-3 w-3 mt-0.5" />
                  {transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  {!transaction.isRecurring ? (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3 " />
                      One-time
                    </Badge>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          className="gap-1 bg-[#efecff]/100 text-primary hover:text-white hover:bg-[#7f5efd] cursor-pointer"
                          variant={"outline"}
                        >
                          <RefreshCcw className="h-3 w-3" />
                          {recurringIntervals[transaction.recurringInterval]}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div>Next Date:</div>
                        <div>
                          {format(
                            new Date(transaction.nextRecurringDate),
                            "PP"
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"} className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/transaction/create?edit=${transaction.id}`
                          )
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className={"text-destructive"}
                        onClick={() => deleteFn([transaction.id])}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {
        totalPage > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
            size={"icon"}
            variant={"outline"}
            onClick = {()=> handlePage(page - 1)}
            disabled = {page == 1}
            >
              <ChevronLeft className="h-4 w-4"/>
            </Button>
            <span>{page} of {totalPage}</span>
            <Button
            size={"icon"}
            variant={"outline"}
            onClick = {()=> handlePage(page + 1)}
            disabled = {page == totalPage}
            >
              <ChevronRight className="h-4 w-4"/>
            </Button>
          </div>
        )
      }
    </div>
  );
};

export default TransactionTable;
