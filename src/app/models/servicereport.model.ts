import { Client } from "./client.model";
import { Service } from "./service.model";
import { Staff } from "./staff.model";

export class ServiceReport {
    constructor(
        public serviceReportId: number,
        public clientBean: Client,
        public serviceBean: Service,
        public staffBean: Staff,
        public serviceDiscount: string,
        public serviceReportDate: Date
    ){
    }
}