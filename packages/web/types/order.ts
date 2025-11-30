import {Vehicle} from "./vehicle";
import {Service} from "./service";
import {Part} from "./part";

export enum OrderStatus {
    PENDING = "PENDING",
    WAITING = "WAITING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CLOSED = "CLOSED",
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "Aguardando Orçamento",
    [OrderStatus.WAITING]: "Aguardando Aprovação",
    [OrderStatus.APPROVED]: "Aprovado",
    [OrderStatus.REJECTED]: "Recusado",
    [OrderStatus.IN_PROGRESS]: "Em Execução",
    [OrderStatus.COMPLETED]: "Concluído",
    [OrderStatus.CLOSED]: "Fechado",
};

export const OrderStatusColor: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "orange",
    [OrderStatus.WAITING]: "yellow",
    [OrderStatus.APPROVED]: "blue",
    [OrderStatus.REJECTED]: "red",
    [OrderStatus.IN_PROGRESS]: "purple",
    [OrderStatus.COMPLETED]: "green",
    [OrderStatus.CLOSED]: "gray",
};

export type OrderPartItem = {
    partId: string;
    serviceOrderId: string;
    quantity: number;
    part: Part;
};

export type ServiceOrder = {
    id: string;
    status: OrderStatus;
    totalPrice: number;
    totalPartsPrice?: number;
    totalServicesPrice?: number;
    createdAt: string;
    updatedAt: string;

    vehicle: Vehicle;
    services: Service[];
    parts: OrderPartItem[];
};

export type CreateOrderDTO = {
    vehicleId: string;
    serviceIds: string[];
    parts: {
        partId: string;
        quantity: number;
    }[];
};

export type UpdateOrderStatusDTO = {
    status: OrderStatus;
};
