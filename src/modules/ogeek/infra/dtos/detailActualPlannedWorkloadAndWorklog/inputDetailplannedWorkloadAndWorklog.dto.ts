import { ApiProperty } from '@nestjs/swagger';
export class InputDetailPlannedWorkloadAndWorklogDto {
    @ApiProperty()
    userId?: number;

    @ApiProperty()
    week?: number;

    @ApiProperty()
    expertiseScopes?: string[];
}
