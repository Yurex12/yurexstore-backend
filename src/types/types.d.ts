type User = {
  userId: string;
  role: 'USER' | 'ADMIN';
};

declare namespace Express {
  export interface Request {
    user: User;
    file: any;
  }
}

type RequestParams = {
  id: string;
};

type ProductRequestBody = {
  name: string;
  color: string;
  description: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
};
