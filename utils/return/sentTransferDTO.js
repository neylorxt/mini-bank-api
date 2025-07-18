import { getUserById } from "../../Controllers/UserAuth.js";
import {getDate} from "../utils.js";

export async function sentTransferDTO( {transfer} ) {

    const receiver = await getUserById(transfer?.receiverId);

    const date = getDate(transfer.createdAt);

    return {
        id: transfer.id,
        amount: transfer.amount,
        message: transfer.message,
        createdAt: date,
        senderId: transfer.senderId,
        receiver
    }
}

export async function receiveTransferDTO( {receive} ) {

    const sender = await getUserById(receive.senderId);

    const date = getDate(receive.createdAt);

    return {
        id: receive.id,
        amount: receive.amount,
        message: receive.message,
        createdAt: date,
        senderId: receive.senderId,
        sender
    }
}