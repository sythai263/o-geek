'use strict';

export interface ISenteConfig {
    url: string;
    guaName: string;
    secretAccessKey: string;
    basicAuthPassword: string;
}

export interface IHexaConfig {
    url: string;
    basicAuthToken: string;
}
