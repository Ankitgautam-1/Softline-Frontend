export interface Root {
  ok: boolean;
  contracts: Contract[];
}

export interface Contract {
  id: string;
  contractName: string;
  firstAssignmentGroup: string;
  company: string;
  servicePackage: string;
  firstAssigmentAgent: string;
  serviceItem: string[];
  projectManager: string;
  netSuiteProjectID: string;
  startDate: string;
  endDate: string;
  contractHours: number;
  contractOwner: string;
  contractOwnerName: string;
  typeOfHours: string;
  sla: string;
  country: string;
  assets: string[];
  supportTime: string;
  customerUser: string;
  remarks: string;
  createdDate: Date;
  files: boolean;
  __v: number;
  _id: string;
}

export interface NewContract {
  id: string;
  contractName: string;
  firstAssignmentGroup: string;
  company: string;
  servicePackage: string;
  netSuiteProjectID: string;
  firstAssigmentAgent: string;
  serviceItem: string[];
  projectManager: string;

  startDate: string;
  endDate: string;
  contractHours: number;
  contractOwner: string;
  contractOwnerName: string;
  typeOfHours: string;
  sla: string;
  country: string;
  assets: string[];
  supportTime: string;
  customerUser: string;
  remarks: string;
  createdDate: Date;
  files: boolean;
}
