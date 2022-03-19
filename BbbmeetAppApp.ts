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
import { HelpCommand } from './Commands/HelpCommand';
import { JoinCommand } from './Commands/JoinCommand';
import { ListRecordings } from './Commands/ListRecordings';
import { JoinEndpoint } from './endpoints/JoinEndpoint';
import { settings } from './settings';

export class BbbmeetAppApp extends App {
    private readonly appLogger: ILogger
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
        this.appLogger = this.getLogger()
        this.appLogger.debug('Big Blue button is active!')
    }

    public async extendConfiguration(configuration: IConfigurationExtend) : Promise<void> {
        // Registering slash commands
        await configuration.slashCommands.provideSlashCommand(new JoinCommand())
        await configuration.slashCommands.provideSlashCommand(new ListRecordings())
        await configuration.slashCommands.provideSlashCommand(new HelpCommand())

        // Registering API endpoints 
        configuration.api.provideApi({
            visibility: ApiVisibility.PUBLIC,
            security: ApiSecurity.UNSECURE,
            endpoints: [new JoinEndpoint (this)],
        })

        // Adding app settings
        await Promise.all(settings.map((setting) => configuration.settings.provideSetting(setting)));
    }

    // To Do: Add a reminder
    // public async onEnable(environment: IEnvironmentRead, configurationModify: IConfigurationModify): Promise<boolean> {
    // }

    // Reminder: to check the save change disability in the app settings and make a PR
}
