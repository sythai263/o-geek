import { ApiProperty } from '@nestjs/swagger';

export class ExpertiseScopeDto {
    @ApiProperty()
    expertiseScope?: string;

    @ApiProperty()
    worklog?: number;

    @ApiProperty()
    actualPlanned?: number;
}
