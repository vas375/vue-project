declare namespace I18nType {
  type LangType = "zh-cn" | "en" | "ko";

  interface Schema {
    lang: {
      zh:string;
      en:string;
      ko:string
    },
    tabbar: {
      home: string;
      tools: string;
      about: string;
    };
  }

  type GetI18nKey<
    T extends Record<string, unknown>,
    K extends keyof T = keyof T
  > = K extends string
    ? T[K] extends Record<string, unknown>
      ? `${K}.${GetI18nKey<T[K]>}`
      : K
    : never;

  type I18nKey = GetI18nKey<Schema>;
}