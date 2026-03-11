import Sdk from 'casdoor-js-sdk';

export const casdoorServerUrl = "http://localhost:8000";

const sdkConfig = {
    serverUrl: casdoorServerUrl,
    clientId: "17fb952458204610de47",
    appName: "vm_manager",
    organizationName: "vm_group",
    redirectPath: "/callback",
    signinPath: "/api/signin",
};

export const CasdoorSDK = new Sdk(sdkConfig);