/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

export interface ServerLogger {
    moduleName: string
    route: string
    log: (type: string, message: string) => void
}

export function createLogger(moduleName: string, route: string): ServerLogger {
    return {
        moduleName,
        route,
        log(type: string, message: string) {
            const time = new Date().toISOString().split("T")[1].split(".")[0];
            console.log(
                `[${time}] [${type}] ${this.moduleName}.${this.route} | ${message}`
            );
        }
    }
}

export enum LogLevel {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
    DEBUG = "DEBUG"
}