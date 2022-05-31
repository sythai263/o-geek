import { ApiProperty } from '@nestjs/swagger';
export class ExpertiseScopeDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Delivery' })
    name: string;

    @ApiProperty({ example: '1000' })
    committedWorkload: number;

    @ApiProperty({ example: '1000' })
    plannedWorkload: number;

    @ApiProperty({ example: '92' })
    actualPlan: number;

    @ApiProperty({ example: '92' })
    workLog: number;

    constructor(
        id?: number,
        name?: string,
        committedWorkload?: number,
        plannedWorkload?: number,
        actualPlan?: number,
        workLog?: number,
    ) {
        this.id = id;
        this.name = name;
        this.committedWorkload = committedWorkload;
        this.plannedWorkload = plannedWorkload;
        this.actualPlan = actualPlan;
        this.workLog = workLog;
    }
}
