interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN: string;
  readonly VITE_GITHUB_ORGANIZATION_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
