
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
    bankDetails: {
      accountTitle: string;
      accountIBAN: string;
      bankName: string;
    }
  };

