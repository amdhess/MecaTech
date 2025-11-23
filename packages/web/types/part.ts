export type Part = {
    id: string;
    name: string;
    sku: string;
    stock: number;
    price: number;
    createdAt: string;
    updatedAt: string;
};

export type CreatePartDTO = {
    name: string;
    sku: string;
    stock: number;
    price: number;
};
