/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SSO_REDIRECT_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
