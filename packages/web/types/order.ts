import {Client} from "./client";

export type ServiceOrder = {
    id: string;
    status:
        | "PENDING"
        | "WAITING"
        | "APPROVED"
        | "REJECTED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CLOSED";
    vehicle: {
        model: string;
        plate: string;
        client: Client;
    };
    totalPrice: number;
    createdAt: string;
};

export type CreateOrderDTO = {
    vehicleId: string;
    serviceIds: string[];
    parts: {
        partId: string;
        quantity: number;
    }[];
};
