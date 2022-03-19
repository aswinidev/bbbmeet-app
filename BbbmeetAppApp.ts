import {
    IAppAccessors,
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';
import { JoinCommand } from './Commands/JoinCommand';
import { ListRecordings } from './Commands/ListRecordings';
import { JoinEndpoint } from './endpoints/JoinEndpoint';

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

        // Registering API endpoints 
        configuration.api.provideApi({
            visibility: ApiVisibility.PUBLIC,
            security: ApiSecurity.UNSECURE,
            endpoints: [new JoinEndpoint (this)],
        })

        // Adding app settings
        configuration.settings.provideSetting({
            id: 'meeting-day',
            public: true,
            type: SettingType.STRING,
            required: true,
            packageValue: 'Monday',
            i18nLabel: 'Meeting Day',
        }) 
        configuration.settings.provideSetting({
            id: 'meeting-time',
            public: true,
            type: SettingType.NUMBER,
            required: true,
            packageValue: '0000',
            i18nLabel: 'Meeting Time',
        }) 
    }

    // To Do: Add a reminder
    // public async onEnable(environment: IEnvironmentRead, configurationModify: IConfigurationModify): Promise<boolean> {
    // }

    // To Do: The settings aren't updating so i think i have to add a onSettingUpdate function
    // To Do: Try to put all the app settings in a single settings.ts file to maintain the clarity of code
}
