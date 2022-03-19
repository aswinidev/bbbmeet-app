import { IRead, IModify, IHttp, IPersistence, IModifyCreator, IMessageBuilder  } from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import {ISlashCommand, SlashCommandContext} from "@rocket.chat/apps-engine/definition/slashcommands";
import { BlockBuilder, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit";
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
        const sender : IUser = (await read.getUserReader().getAppUser()) as IUser
        const room : IRoom = context.getRoom()
        
        // A blockbuilder to send a message to the user who implemented this command with a join button
        // which would let them to join the meeting
        const blockBuilder: BlockBuilder = modify.getCreator().getBlockBuilder()
        blockBuilder.addSectionBlock({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: 'Join the weekly meeting by clicking the "Join" button below'
            }
        })
        blockBuilder.addActionsBlock({
            elements: [
                blockBuilder.newButtonElement({
                    text: {
                        type: TextObjectType.PLAINTEXT,
                        text: 'Join'
                    },
                    url: 'google.com'
                })
            ]
        })

        await modify.getNotifier().notifyUser(context.getSender(), {
            sender,
            room,
            blocks: blockBuilder.getBlocks()
        })
    }
}