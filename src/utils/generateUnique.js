import { customAlphabet, nanoid} from "nanoid"


export const uniqueCode = customAlphabet('123456789',6)
export const uniqueFolderId = nanoid(4)