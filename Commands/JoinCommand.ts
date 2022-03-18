import { IRead, IModify, IHttp, IPersistence, IModifyCreator, IMessageBuilder  } from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import {ISlashCommand, SlashCommandContext} from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export class JoinCommand implements ISlashCommand {
    public command = "joinmeet";
    public i18nDescription = "Lets you join weekly meetings";
    public providesPreview = false;
    public i18nParamsExample = "";

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        const creator : IModifyCreator = modify.getCreator()
        const sender : IUser = (await read.getUserReader().getAppUser()) as IUser
        const room : IRoom = context.getRoom()
        const messageTemplate : IMessage = {
            text: 'Join command has been used',
            room,
            sender
        }
        const messageBuilder : IMessageBuilder = creator.startMessage(messageTemplate)
        await creator.finish(messageBuilder)
    }
}