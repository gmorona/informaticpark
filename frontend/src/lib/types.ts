export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assetsCreated?: Asset[];
}

export interface Custodian {
  id: number;
  fullName: string;
  identifier: string;
  unit?: string | null;
  createdAt: string;
  updatedAt: string;
  assets?: Asset[];
}

export interface Asset {
  id: number;
  code?: string | null;
  previousCode?: string | null;
  assetName: string;
  brand?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  location?: string | null;
  physicalLocation?: string | null;
  entryDate?: string | null;
  activationDate?: string | null;
  accountCode?: string | null;
  initialValue?: number | null;
  currentValue?: number | null;
  note?: string | null;
  coordinates?: string | null;
  custodianId?: number | null;
  custodian?: Custodian | null;
  createdByUserId?: number | null;
  createdByUser?: User | null;
  createdAt: string;
  updatedAt: string;
}
