export type Account = {
    id: number;
    createdAt: string;
    updatedAt: string;
    Name: string;
    email: string;
    empNo: string;
    Designation: string;
    employementStatus: "Intern" | "Probation" | "Permanent";
    grossSalary: number;
    hubstaffEnabled: boolean;
    joinDate: string;
    lastWorkingDay: string;
    leavesRemaining: number;
    permanentDate: string;
    phoneNo: string;
    salarySlipRequired: boolean;
    imageUrl: string;
    bankDetailsID: number;
    imageID:number;
    publishedAt: string;
    bankDetails: {
      accountTitle: string;
      accountIBAN: string;
      bankName: string;
    }
};

export type lastMonth = {
  monthName: string;
  requiredHours : number;
  workedHours : number;
  absences : number;
  paidLeaves : number;
  lateCount : number;
  monthlyEarnedAmount : number;
  monthID : number;
};

export type DailyLog = {
  TotalHoursMonth: number;
  WTH: number;
  basicSalary: number;
  createdAt: Date;
  grossSalaryEarned: number;
  hoursLogged: number;
  hubstaffHours: number;
  isHoliday: boolean;
  isLate: boolean;
  isLeave: boolean;
  loanDeduction: number;
  manualHours: number;
  medicalAllowance: number;
  miscAdjustments: number;
  monthlyRate: number;
  paidSalary: number;
  publishedAt: Date;
  salarySlipSent: boolean;
  transferStatus: boolean;
  updatedAt: Date;
  workDate: Date;
  totalHours: number;
  earnedAmount: number;
};


export type EmployeeAttributes = {
  // Define the properties of the EmployeeAttributes type here
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
  accountTitle: string;
  accountIBAN: string;
  bankName: string;
};