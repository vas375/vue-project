interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly VITE_BASE_API: string // 环境变量
  // 这里定义其它用到的环境变量
}