import { GetQueryInterface } from 'interfaces';

export interface LocationInterface {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  budget_friendly?: boolean;
  created_at?: any;
  updated_at?: any;

  _count?: {};
}

export interface LocationGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
}
