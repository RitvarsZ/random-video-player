export declare global {
     interface ProcessedFile {
        id: string, 
        file: File,
        meta: { 
            thumbnail: string,
            duration: number
        }
    }
}

