import { PartialType } from "@nestjs/swagger";
import { CreateMaintenance } from "./create-maintenance.dto";

export class UpdateMaintenance extends PartialType(CreateMaintenance) {}