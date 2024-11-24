import { InternalServerException, NotFoundException } from '@app/shared/error-handling/src';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileService {
    /**
     * Reads a file and parses it as JSON.
     * @param filePath The relative path to the file.
     * @returns The parsed JSON content.
     */
    async readFile<T>(filePath: string): Promise<T> {
        try {
            const fullPath = path.resolve(filePath);
            const data = await fs.readFile(fullPath, 'utf8');
            return JSON.parse(data) as T;
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new NotFoundException(`File not found at ${filePath}`);
            }
            throw new InternalServerException(`Error reading file at ${filePath}`);
        }
    }

    /**
     * Writes data to a file as JSON.
     * @param filePath The relative path to the file.
     * @param data The data to write.
     */
    async writeFile<T>(filePath: string, data: T): Promise<void> {
        try {
            const fullPath = path.resolve(filePath);
            const jsonData = JSON.stringify(data, null, 2);
            await fs.writeFile(fullPath, jsonData, 'utf8');
        } catch (error) {
            throw new InternalServerException(`Failed to write to file at ${filePath}: ${error.message}`);
        }
    }

    /**
     * Checks if a file exists.
     * @param filePath The relative path to the file.
     * @returns A boolean indicating whether the file exists.
     */
    async fileExists(filePath: string): Promise<boolean> {
        try {
            const fullPath = path.resolve(filePath);
            await fs.access(fullPath);
            return true;
        } catch (error) {
            if (error.code === 'ENOENT') {
                return false;
            }
            throw new InternalServerException(`Error checking if file exists at ${filePath}`);
        }
    }
}
