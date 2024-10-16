import { EnumDataType } from '@/enum';

export function maskhash(hash: String) {
    if(hash) return hash.slice(0,10) + '******' + hash.slice(hash.length-8,hash.length)
    return ''
}