import {Client} from "./client";

export type Vehicle = {
    id: string;
    plate: string;
    model: string;
    brand: string;
    year: number;
    color: string | null;
    client: Client;
};

export type CreateVehicleDTO = {
    plate: string;
    model: string;
    brand: string;
    year: number;
    color?: string;
    clientId: string;
};
