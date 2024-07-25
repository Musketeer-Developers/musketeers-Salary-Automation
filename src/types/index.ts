export type Account = {
  id: number;
  createdAt: string;
  updatedAt: string;
  Name: string;
  email: string;
  empNo: string;
  Designation: string;
  employementStatus: "intern" | "probation" | "permanent";
  grossSalary: number;
  hubstaffEnabled: boolean;
  joinDate: string;
  lastWorkingDay: string;
  leavesRemaining: number;
  permanentDate: string;
  phoneNo: string;
  salarySlipRequired: boolean;
  imageUrl: string;
  bankDetails: {
    accountTitle: string;
    accountIBAN: string;
    bankName: string;
  };
};

export type MonthSalaries = {
  month: string;
  year: string;
  workingDays: number;
  monthlyRate: number;
  TotalHoursMonth: number;
  grossSalaryEarned: number;
  hoursLogged: number;
};

