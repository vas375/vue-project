import { langUtils } from '../../language/langUtils';

/**
 * 获取assets静态资源
 * @param url assets/之后完整路径+名称
 * @returns
 */
export function getAssetsFile(url: string) {
  return new URL(`../../assets/${url}`, import.meta.url).href;
}

/**
 * 获取assets icon静态资源
 * @param url assets/icon中 icon名称
 * @returns
 */
export function getAssetsIconFile(name: string) {
  return new URL(`../../assets/icon/${name}.png`, import.meta.url).href;
}

/**
 * 获取assets icon静态资源
 * @param url assets/cusTomer中 CusTomerFile名称
 * @returns
 */
 export function getAssetsCusTomerFile(name: string) {
  return new URL(`../../assets/image/customer/${name}.png`, import.meta.url).href;
}

/**
 * 获取i18n assets静态资源
 * @param name 图片名称
 * @returns assets
 */
export function getI18nAssetsFile(name: string) {
  const curlang = langUtils.getCurLang();
  return new URL(`../../assets/i18n/${curlang}/${name}.png`, import.meta.url).href;
}
