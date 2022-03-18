import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { JoinCommand } from './Commands/JoinCommand';
import { ListRecordings } from './Commands/ListRecordings';

export class BbbmeetAppApp extends App {
    private readonly appLogger: ILogger
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
        this.appLogger = this.getLogger()
        this.appLogger.debug('Big Blue button is active!')
    }
    public async extendConfiguration(configuration: IConfigurationExtend) : Promise<void> {
        const joinCommand : JoinCommand = new JoinCommand()
        await configuration.slashCommands.provideSlashCommand(joinCommand)
        const listRecordings : ListRecordings = new ListRecordings()
        await configuration.slashCommands.provideSlashCommand(listRecordings)
    }
}
