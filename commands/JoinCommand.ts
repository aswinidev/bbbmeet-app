import { IRead, IModify, IHttp, IPersistence, IModifyCreator, IMessageBuilder, IHttpRequest  } from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import {ISlashCommand, SlashCommandContext} from "@rocket.chat/apps-engine/definition/slashcommands";
import { BlockBuilder, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { sha1 } from "../SHA1/sha1";

export class JoinCommand implements ISlashCommand {
    public command = "joinmeet";
    public i18nDescription = "Lets you join weekly meetings";
    public providesPreview = false;
    public i18nParamsExample = "";
    private sharedSecret : string;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {

        // Collect all the required settings
        const set = read.getEnvironmentReader().getSettings()
        const bbbserver = await set.getValueById('BigBlueButton_Server_URL')
        this.sharedSecret = await set.getValueById('BigBlueButton_sharedSecret')
        const moderatorPW = await set.getValueById('BigBlueButton_moderatorPW')
        const attendeePW = await set.getValueById('BigBlueButton_attendeePW')
        const meetingId = await set.getValueById('BigBlueButton_Meeting_Id')
        const meetingName = await set.getValueById('BigBlueButton_Meeting_Name')

        // Create the query string
        const query = `name=${meetingName}&meetingID=${meetingId}&attendeePW=${attendeePW}&moderatorPW=${moderatorPW}&record=true`
        const sha1string = "create" + query + `${this.sharedSecret}`
        // Calculate sha1 value
        const sha = sha1(sha1string)
        //Generate the final url
        const url = bbbserver + "/bigbluebutton/api/create?" + query + `&checksum=${sha}`
        
        //make the create call
        const response = await http.get(url)

        const sender : IUser = (await read.getUserReader().getAppUser()) as IUser
        const room : IRoom = context.getRoom()
        const blockBuilder: BlockBuilder = modify.getCreator().getBlockBuilder()
        blockBuilder.addSectionBlock({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: `CreateResponse: ${response.statusCode}`
            }
        })

        blockBuilder.addSectionBlock({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: `${response.content}`
            }
        })

        await modify.getNotifier().notifyUser(context.getSender(), {
            sender,
            room,
            blocks: blockBuilder.getBlocks()
        })
        
        if(response.statusCode === 200){
            //Create the join query string
            const joinquery = `fullName=something&meetingID=${meetingId}&password=${moderatorPW}&redirect=true`
            const joinsha1string = "join" + joinquery + `${this.sharedSecret}`
            const joinsha1 = sha1(joinsha1string)
            const joinurl = bbbserver + "/bigbluebutton/api/join?" + joinquery + `&checksum=${joinsha1}`
            const joinresponse =  await http.get(joinurl)

            const sender : IUser = (await read.getUserReader().getAppUser()) as IUser
            const room : IRoom = context.getRoom()
            
            // A help command which will be completed at the end of the project
            const blockBuilder: BlockBuilder = modify.getCreator().getBlockBuilder()
            blockBuilder.addSectionBlock({
                text: {
                    type: TextObjectType.PLAINTEXT,
                    text: `JoinResponse: ${joinresponse.statusCode}`
                }
            })

            await modify.getNotifier().notifyUser(context.getSender(), {
                sender,
                room,
                blocks: blockBuilder.getBlocks()
            })
        }
    }
}

