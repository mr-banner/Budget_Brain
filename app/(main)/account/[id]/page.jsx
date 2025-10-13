import { getAccountWithTransactions } from "@/actions/account";
import NotFound from "@/app/not-found";
import { IndianRupee } from "lucide-react";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";
import TransactionTable from "../_components/transaction-table";
import AccountChart from "../_components/account-chart";

const AccountPage = async ({ params }) => {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    return <NotFound />;
  }

  const { transactions, ...account } = accountData;
  return (
    <div className=" space-y-8 relative">
        <div className="flex justify-between sm:items-center items-baseline gap-4">
      <div>
        <h1 className="gradiant-title text-3xl sm:text-6xl font-bold">{account.name}</h1>
        <p className="text-muted-foreground sm:text-sm text-xs ml-1 sm:ml-0">
          {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
        </p>
      </div>
      <div className="text-right max-sm:absolute max-sm:right-0 max-sm:top-1.5">
        <div className="font-bold sm:text-2xl text-md">
          <IndianRupee className="inline font-bold mb-1 mr-1 sm:h-5 sm:w-5 h-[18px] w-[18px] mt-1 sm:mt-0" />
          {Number(account.balance).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
        </div>
        <p className="text-muted-foreground sm:text-sm text-xs">{account._count.transactions} Transactions</p>
      </div>
    </div>

      {/* chart section */}
      <Suspense fallback = {<BarLoader className="h-4 w-[100%]"/>}>
          <AccountChart transactions={transactions}/>
      </Suspense>

      {/* Table */}
      <Suspense fallback = {<BarLoader className="h-4 w-[100%]"/>}>
          <TransactionTable transactions={transactions}/>
      </Suspense>
    </div>
  );
};

export default AccountPage;
