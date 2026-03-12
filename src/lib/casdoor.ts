import Sdk from 'casdoor-js-sdk';
export const casdoorServerUrl = "http://123.207.197.234:8000";

const sdkConfig = {
    serverUrl: casdoorServerUrl,
    clientId: "813246115a8218f642ec",
    appName: "vm_manager",
    organizationName: "vm_group",
    redirectPath: "/callback",
    signinPath: "/api/signin",
};

export const CasdoorSDK = new Sdk(sdkConfig);
