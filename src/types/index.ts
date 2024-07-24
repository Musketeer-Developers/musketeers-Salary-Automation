
export type Account = {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    email: string;
    empNo: string;
    Designation: string;
    employementStatus: "intern" | "probation" | "permanent";
    grossSalary: number;
    hubstaffEnabled: boolean;
    image?: image;
    joinDate: string;
    lastWorkingDay: string;
    leavesRemaining: number;
    permanentDate: string;
    phoneNo: string;
    salarySlipRequired: boolean;
    imageUrl: string;
  };
