import { useState } from "react";
import Topbar from "../components/topbar";
import { UseSaleContext } from "../context/salesContext";
import { UseExpensesContext } from "../context/expensesContext";
import { UseRepairSaleContext } from "../context/repair_sale_context";

export const Reports = () => {
  const [reporttype, setReportType] = useState("sales");
  const [reportPeriod, setRepordPeriord] = useState("all");
  const { calculateOverall  } = UseSaleContext()
  const { calculateOverallExpenses } = UseExpensesContext();
  const { calculateOverallRepairs } = UseRepairSaleContext();



  return (
    <div className="w-full">
      <Topbar title={"Reports"} />
    </div>
  );
};
