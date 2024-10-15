import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface CheckServicesUseCase {
    execute(url: string): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

export class CheckService implements CheckServicesUseCase {
    constructor(
        private readonly LogRepository: LogRepository,
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback
    ) { }

    async execute(url: string): Promise<boolean> {
        try {
            const req = await fetch(url)
            if (!req.ok) {
                throw new Error(`Error on check service ${url} 🔧`)
            }

            const log = new LogEntity(`Service ${url} working 🎃`, LogSeverityLevel.low)

            this.LogRepository.saveLog(log)
            this.successCallback && this.successCallback();

            return true;
        } catch (error) {
            const errorMessage = `Service ${url} failed 🔥 - ${error}`
            const log = new LogEntity(errorMessage, LogSeverityLevel.high)

            this.LogRepository.saveLog(log)
            this.errorCallback && this.errorCallback(errorMessage)
            return false;
        }
    }
} 