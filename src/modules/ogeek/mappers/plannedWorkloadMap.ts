import { v4 as uuidv4 } from 'uuid';

import { RADIX } from '../../../common/constants/number';
import { PlannedWorkloadStatus } from '../../../common/constants/plannedStatus';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { PlannedWorkload } from '../domain/plannedWorkload';
import { User } from '../domain/user';
import { PlannedWorkloadEntity } from '../infra/database/entities/plannedWorkload.entity';
import { CreatePlannedWorkloadsListDto } from '../infra/dtos/createPlannedWorkload/createPlannedWorkloadsList.dto';
import { PlannedWorkloadDto } from '../infra/dtos/plannedWorkload.dto';
import { ICommittedWorkloadRepo } from '../repos/committedWorkloadRepo';
import { IContributedValueRepo } from '../repos/contributedValueRepo';
import { CommittedWorkloadMap } from './committedWorkloadMap';
import { ContributedValueMap } from './contributedValueMap';
import { UserMap } from './userMap';

export class PlannedWorkloadMap implements Mapper<PlannedWorkload> {
    public static fromDomain(
        plannedWorkload: PlannedWorkload,
    ): PlannedWorkloadDto {
        const plannedWorkladDto = new PlannedWorkloadDto();
        if (plannedWorkload) {
            plannedWorkladDto.id = new UniqueEntityID(
                plannedWorkload.id.toValue(),
            );
            plannedWorkladDto.user = UserMap.fromDomain(
                plannedWorkload.props.user,
            );
            plannedWorkladDto.contributedValue = ContributedValueMap.fromDomain(
                plannedWorkload.props.contributedValue,
            );
            plannedWorkladDto.committedWorkload =
                CommittedWorkloadMap.fromDomain(
                    plannedWorkload.props.committedWorkload,
                );
            plannedWorkladDto.plannedWorkload =
                plannedWorkload.props.plannedWorkload;
            plannedWorkladDto.startDate = plannedWorkload.props.startDate;
            plannedWorkladDto.status = plannedWorkload.props.status;
        }
        return plannedWorkladDto;
    }

    public static fromDomainList(
        plannedWorkloadList: PlannedWorkload[],
    ): PlannedWorkloadDto[] {
        let plannedWorkloadDto = new Array<PlannedWorkloadDto>();
        if (plannedWorkloadList) {
            plannedWorkloadDto = plannedWorkloadList.map((plannedWL) =>
                this.fromDomain(plannedWL),
            );
        }
        return plannedWorkloadDto;
    }

    public static fromDomainAll(
        plannedWLs: PlannedWorkload[],
    ): PlannedWorkloadDto[] {
        const arrPlannedWLDto = new Array<PlannedWorkloadDto>();
        if (plannedWLs) {
            plannedWLs.forEach((plannedWL) => {
                arrPlannedWLDto.push(PlannedWorkloadMap.fromDomain(plannedWL));
            });
        }
        return arrPlannedWLDto;
    }

    public static toDomain(raw: PlannedWorkloadEntity): PlannedWorkload {
        if (!raw) {
            return null;
        }
        const { id } = raw;
        const plannedWorkloadOrError = PlannedWorkload.create(
            {
                user: UserMap.toDomain(raw.user),
                plannedWorkload: raw.plannedWorkload,
                startDate: raw.startDate,
                status: raw.status,
                reason: raw.reason,
                contributedValue: ContributedValueMap.toDomain(
                    raw.contributedValue,
                ),
                committedWorkload: CommittedWorkloadMap.toDomain(
                    raw.committedWorkload,
                ),
                createdBy: raw.createdBy,
                updatedBy: raw.updatedBy,
                deletedBy: raw.deletedBy,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
                deletedAt: raw.deletedAt,
            },
            id ? new UniqueEntityID(id) : new UniqueEntityID(),
        );
        return plannedWorkloadOrError.isSuccess
            ? plannedWorkloadOrError.getValue()
            : null;
    }

    public static toEntity(
        plannedWorkload: PlannedWorkload,
    ): PlannedWorkloadEntity {
        const id =
            Number(plannedWorkload.plannedWorkloadId?.id?.toValue()) || null;
        const entity = new PlannedWorkloadEntity(id);
        entity.status = plannedWorkload.status;
        entity.user = UserMap.toEntity(plannedWorkload.user);
        entity.reason = plannedWorkload.reason;
        entity.startDate = plannedWorkload.startDate;
        entity.plannedWorkload = plannedWorkload.plannedWorkload;
        entity.contributedValue = ContributedValueMap.toEntity(
            plannedWorkload.contributedValue,
        );
        entity.committedWorkload = CommittedWorkloadMap.toEntity(
            plannedWorkload.committedWorkload,
        );

        entity.createdAt = plannedWorkload.createdAt;
        entity.createdBy = plannedWorkload.createdBy;
        entity.updatedAt = plannedWorkload.updatedAt;
        entity.updatedBy = plannedWorkload.updatedBy;
        entity.deletedAt = plannedWorkload.deletedAt;
        entity.deletedBy = plannedWorkload.deletedBy;

        return entity;
    }
    public static toEntities(
        plannedWorkload: PlannedWorkload[],
    ): PlannedWorkloadEntity[] {
        const entities = new Array<PlannedWorkloadEntity>();
        for (const commit of plannedWorkload) {
            entities.push(this.toEntity(commit));
        }
        return entities;
    }

    public static toArrayDomain(
        raws: PlannedWorkloadEntity[],
    ): PlannedWorkload[] {
        const plannedWorkloadsOrError = Array<PlannedWorkload>();
        if (raws) {
            raws.forEach(function get(raw) {
                const { id } = raw;
                const plannedWorkloadOrError = PlannedWorkload.create(
                    {
                        committedWorkload: CommittedWorkloadMap.toDomain(
                            raw.committedWorkload,
                        ),
                        plannedWorkload: raw.plannedWorkload,
                    },
                    new UniqueEntityID(id),
                );
                plannedWorkloadsOrError.push(plannedWorkloadOrError.getValue());
            });
        }
        return plannedWorkloadsOrError;
    }

    public static toDomainAll(
        plannedWLs: PlannedWorkloadEntity[],
    ): PlannedWorkload[] {
        const arrPlannedWL = new Array<PlannedWorkload>();
        if (plannedWLs) {
            plannedWLs.forEach((plannedWL) => {
                const plannedWLOrError = PlannedWorkloadMap.toDomain(plannedWL);
                if (plannedWLOrError) {
                    arrPlannedWL.push(plannedWLOrError);
                } else {
                    return null;
                }
            });
        }
        return arrPlannedWL;
    }

    public static async fromDtosToEntitiesList(
        createPlannedWorkloadsListDto: CreatePlannedWorkloadsListDto,
        user: User,
        newPlannedWorkloadStatus: PlannedWorkloadStatus,
        formattedStartDate: Date,
        committedWorkloadRepo: ICommittedWorkloadRepo,
        contributedValueloadRepo: IContributedValueRepo,
    ) {
        const { reason, plannedWorkloads } = createPlannedWorkloadsListDto;
        const plannedWorkloadEntitiesList = [] as PlannedWorkloadEntity[];
        for (const plannedWorkloadDto of plannedWorkloads) {
            const { committedWorkloadId, workload } = plannedWorkloadDto;

            const committedWorkload =
                await committedWorkloadRepo.findCommittedWorkloadOfUser(
                    committedWorkloadId,
                    Number(user.id.toValue()),
                );
            const contributedValue = await contributedValueloadRepo.findById(
                parseInt(
                    committedWorkload.contributedValue.id.toString(),
                    RADIX,
                ),
            );

            const plannedWorkload = PlannedWorkload.create(
                {
                    reason,
                    user,
                    contributedValue,
                    committedWorkload,
                    startDate: new Date(formattedStartDate.toISOString()),
                    plannedWorkload: workload,
                    status: newPlannedWorkloadStatus,
                    createdBy: Number(user.id.toValue()),
                },
                new UniqueEntityID(uuidv4()),
            );

            const plannedWorkloadEntity = PlannedWorkloadMap.toEntity(
                plannedWorkload.getValue(),
            );
            plannedWorkloadEntitiesList.push(plannedWorkloadEntity);
        }
        return plannedWorkloadEntitiesList;
    }
}
