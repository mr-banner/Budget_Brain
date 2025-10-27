import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/Category";
import React from "react";
import AddTransactionForm from "../_components/add-transactions-form";
import { getTransaction } from "@/actions/transaction";

const AddTranscationPage = async ({searchParams}) => {
  const accounts = await getUserAccounts();
  const responseParams = await searchParams
  const editId = responseParams?.edit; 

  let initialData = null;
  if(editId){
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="gradiant-title sm:text-5xl text-3xl mb-5">{editId ? "Edit" : "Add"} Transaction</h1>

      <AddTransactionForm accounts={accounts} categories = {defaultCategories} 
      editMode={!!editId}
      initialData={initialData}
      />
    </div>
  );
};

export default AddTranscationPage;
