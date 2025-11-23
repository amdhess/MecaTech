export type Service = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    createdAt: string;
    updatedAt: string;
};

export type CreateServiceDTO = {
    name: string;
    description?: string;
    price: number;
};
