import {Injectable} from '@nestjs/common';
import {CreateNotificationDto} from './dto/create-notification.dto';
import {UpdateNotificationDto} from './dto/update-notification.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import usePusherServices from '../services/pusher'
import {Notification} from "./schemas/notification.schema";
import {useOneSignalService} from "../services/onesignal";

@Injectable()
export class NotificationsService {
    constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {
    }

    async create(createNotificationDto: CreateNotificationDto): Promise<boolean> {
        const notification = await this.notificationModel.create(createNotificationDto)
        if (createNotificationDto.priority) {
            await usePusherServices.dispatchEvent(`private-channel-user-${createNotificationDto.user_id}`, 'new-notification', {notification})
            useOneSignalService().sendPushNotification(createNotificationDto.user_id, createNotificationDto.title, createNotificationDto.description, createNotificationDto.payload)
        }
        return true;
    }

    findAll() {
        return `This action returns all notifications`;
    }

    findOne(id: number) {
        return `This action returns a #${id} notification`;
    }

    update(id: number, updateNotificationDto: UpdateNotificationDto) {
        return `This action updates a #${id} notification`;
    }

    remove(id: number) {
        return `This action removes a #${id} notification`;
    }
}
