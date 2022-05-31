import { MAX_VIEWCHART_LENGTH } from '../../../common/constants/chart';
import { ASSIGN_NUMBER } from '../../../common/constants/number';
import { CommittedWorkload } from '../domain/committedWorkload';
import { ExpertiseScope } from '../domain/expertiseScope';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { OverviewChartDataDto } from '../infra/dtos/overviewChart/overviewChartData.dto';
import { WorkloadOverviewDto } from '../infra/dtos/overviewChart/workloadOverview.dto';

export class OverViewChartMap {
    public static combineAllToDto(
        expertiseScopes: ExpertiseScope[],
        committedWorkloads: CommittedWorkload[],
        plannedWorkloads: PlannedWorkload[],
        weekChartArray: number[],
        worklogLength: number,
    ): OverviewChartDataDto[] {
        const overviewChartDataDtos = new Array<OverviewChartDataDto>();
        expertiseScopes.forEach((expertiseScope) => {
            const expertiseScopeId = expertiseScope.id.toValue();
            const myCommittedWorkload = committedWorkloads.find(
                (committedWorkload) =>
                    committedWorkload.belongToExpertiseScope(expertiseScopeId),
            );
            if (myCommittedWorkload) {
                const contributedValue = Array<WorkloadOverviewDto>();
                weekChartArray.forEach((weekItem) => {
                    const plannedBetWeenWeek = plannedWorkloads.find(
                        (plannedWl) =>
                            plannedWl.isBetweenWeek(weekItem) &&
                            plannedWl.isBelongToExpScope(expertiseScopeId),
                    );
                    if (plannedBetWeenWeek) {
                        contributedValue.push({
                            week: weekItem,
                            plannedWorkload: plannedBetWeenWeek.plannedWorkload,
                            actualWorkload: ASSIGN_NUMBER,
                        } as WorkloadOverviewDto);
                    } else {
                        contributedValue.push({
                            week: weekItem,
                            plannedWorkload:
                                myCommittedWorkload.committedWorkload,
                            actualWorkload: ASSIGN_NUMBER,
                        } as WorkloadOverviewDto);
                    }
                });
                overviewChartDataDtos.push({
                    expertiseScopeId,
                    worklogLength,
                    expertiseScopes: contributedValue,
                    expertiseScope: expertiseScope.name,
                    actualPlannedWorkloadLength:
                        MAX_VIEWCHART_LENGTH - worklogLength,
                } as OverviewChartDataDto);
            }
        });
        return overviewChartDataDtos;
    }
}
