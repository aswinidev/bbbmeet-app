import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export enum AppSetting {
    MeetingDay = 'meeting-day',
    MeetingTime = 'meeting-time',
}


export const settings: Array<ISetting> = [
    {
        id: AppSetting.MeetingDay,
        type: SettingType.STRING,
        packageValue: '',
        required: true,
        public: true,
        i18nLabel: 'Meeting Day',
        i18nDescription: 'The Day when the weekly meetings are supposed to be conducted.',
    },
    {
        id: AppSetting.MeetingTime,
        type: SettingType.NUMBER,
        packageValue: '',
        required: true,
        public: true,
        i18nLabel: 'Meeting Time',
        i18nDescription: 'The Time when the weekly meetings are supposed to be conducted.',
    },
];