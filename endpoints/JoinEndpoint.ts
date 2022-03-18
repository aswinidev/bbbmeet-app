import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from "@rocket.chat/apps-engine/definition/api";
import { BbbmeetAppApp } from "../BbbmeetAppApp";

export class JoinEndpoint extends ApiEndpoint {
    public path: string = 'join-meet';
    constructor(public app: BbbmeetAppApp) {
        super(app);
    }
    
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persistence: IPersistence): Promise<IApiResponse> {
        this.app.getLogger().log(request);
        return this.success();
    }
}