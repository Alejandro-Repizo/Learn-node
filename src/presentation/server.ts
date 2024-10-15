import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service"


const fileSystemLogRepostiry = new LogRepositoryImpl(new FileSystemDatasource)

export class Server {

    public static start() {
        console.log('Server started...')


        CronService.createJob('*/5 * * * * *', () => {
            const URL = 'http://localhost:3000/posts'

            new CheckService(
                fileSystemLogRepostiry,
                () => console.log(`${URL} - 🟢`),
                (error) => console.log(`${error} - 🟥`)
            ).execute(URL)
        });

    }

}