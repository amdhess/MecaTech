"use client";

import {
    DialogRoot,
    DialogContent,
    DialogCloseTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
} from "@/components/ui/dialog";
import {Field} from "@/components/ui/field";
import {Button, Input, Stack} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {api} from "@/lib/api";
import {Client} from "@/types/client";
import toast from "react-hot-toast";

type FormData = {
    name: string;
    email: string;
    phone: string;
};

interface AddClientDialogProps {
    open: boolean;
    onClose: () => void;
    onClientCreated: (newClient: Client) => void;
}

export function AddClientDialog({
    open,
    onClose,
    onClientCreated,
}: AddClientDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            const response = await api.post("/client", data);
            onClientCreated(response.data);
            toast.success("Client created successfully!");
            reset();
            onClose();
        } catch (error) {
            console.error("Failed to create client:", error);
            toast.error("Failed to create client.");
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleOpenChange = (details: {open: boolean}) => {
        if (!details.open) {
            handleClose();
        }
    };

    return (
        <DialogRoot open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <form id="new-client-form" onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader display="flex" flexDirection="column" gap={2}>
                        <DialogTitle>Add New Client</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a new client.
                        </DialogDescription>
                        <DialogCloseTrigger />
                    </DialogHeader>

                    <DialogBody>
                        <Stack gap={4}>
                            <Field
                                label="Name"
                                invalid={!!errors.name}
                                errorText={errors.name?.message}
                            >
                                <Input
                                    {...register("name", {
                                        required: "Name is required",
                                    })}
                                />
                            </Field>

                            <Field
                                label="Email"
                                invalid={!!errors.email}
                                errorText={errors.email?.message}
                            >
                                <Input
                                    type="email"
                                    {...register("email", {
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                />
                            </Field>

                            <Field label="Phone">
                                <Input {...register("phone")} />
                            </Field>
                        </Stack>
                    </DialogBody>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            type="submit"
                            form="new-client-form"
                            loading={isSubmitting}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </DialogRoot>
    );
}
