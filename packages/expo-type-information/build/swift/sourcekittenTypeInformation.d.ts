import { FileTypeInformation } from '../typeInformation';
export type SwiftFileTypeInformationOptions = {
    typeInference: boolean;
};
export declare function getSwiftFileTypeInformation(filePath: string, options: SwiftFileTypeInformationOptions): Promise<FileTypeInformation | null>;
type SourceKittenPreprocessingOptions = {
    preprocessReturns?: boolean;
    mapUnicodeCharacters?: boolean;
    runOnQueue: boolean;
};
export declare function preprocessSwiftFile(originalFileContent: string, { preprocessReturns, runOnQueue, mapUnicodeCharacters }: SourceKittenPreprocessingOptions): string;
export {};
