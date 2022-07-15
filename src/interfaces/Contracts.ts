export interface Root {
  ok: boolean;
  contracts: Contract[];
}

export interface Contract {
  _id: string;
  id: string;
  contractName: string;
  company: string;
  servicePackage: string;
  serviceItem: string[];
  assets: string[];
  startDate: string;
  endDate: string;
  typeOfHours: string;
  totalEntitlement: number;
  projectManager: string;
  remarks: string;
  ownerId: string;
  __v: number;
}

export interface NewContract {
  id: string;
  contractName: string;
  company: string;
  servicePackage: string;
  serviceItem: Array<String>;
  assets: Array<String>;
  startDate: string;
  endDate: string;
  typeOfHours: string;
  totalEntitlement: string;
  projectManager: string;
  remarks: string;
  ownerId: string;
  state: string;
}
