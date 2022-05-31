import { InternalServerErrorException } from '@nestjs/common';

import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { CommittedWorkload } from '../domain/committedWorkload';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { CommittedWorkloadDto } from '../infra/dtos/committedWorkload.dto';
import { CommittedWorkloadShortDto } from '../infra/dtos/getCommittedWorkload/getCommittedWorkloadShort.dto';
import { CommittingWorkloadDto } from '../infra/dtos/updateCommittingWorkload/updateCommittingWorkload.dto';
import { ContributedValueMap } from './contributedValueMap';
import { ExpertiseScopeMap } from './expertiseScopeMap';
import { UserMap } from './userMap';
import { ValueStreamMap } from './valueStreamMap';

export class CommittedWorkloadMap implements Mapper<CommittedWorkload> {
    public static fromDomain(
        committedWorkload: CommittedWorkload,
    ): CommittedWorkloadDto {
        const dto = new CommittedWorkloadDto();
        if (committedWorkload) {
            dto.id = committedWorkload.id;
            dto.user = UserMap.fromDomain(committedWorkload.props.user);
            dto.contributedValue = committedWorkload.props.contributedValue
                ? ContributedValueMap.fromDomain(
                      committedWorkload.props.contributedValue,
                  )
                : null;
            dto.committedWorkload = committedWorkload.props.committedWorkload;
            dto.startDate = committedWorkload.props.startDate;
            dto.expiredDate = committedWorkload.props.expiredDate;
            dto.createdBy = committedWorkload.props.createdBy;
            dto.createdAt = committedWorkload.props.createdAt;
            dto.updatedAt = committedWorkload.props.updatedAt;
        }
        return dto;
    }

    public static toDomainOverview(
        raw: CommittedWorkloadEntity,
    ): CommittedWorkload {
        const { id } = raw;
        const committedWorkloadOrError = CommittedWorkload.create(
            {
                contributedValue: ContributedValueMap.toDomain(
                    raw.contributedValue,
                ),
                committedWorkload: raw.committedWorkload,
                startDate: raw.startDate,
                expiredDate: raw.expiredDate,
                status: raw.status,
            },
            new UniqueEntityID(id),
        );
        return committedWorkloadOrError.isSuccess
            ? committedWorkloadOrError.getValue()
            : null;
    }

    public static toEntity(
        committedWorkload: CommittedWorkload,
    ): CommittedWorkloadEntity {
        if (committedWorkload) {
            const user = UserMap.toEntity(committedWorkload.user);

            const contributedValue = ContributedValueMap.toEntity(
                committedWorkload.contributedValue,
            );
            const id =
                Number(committedWorkload.committedWorkloadId?.id?.toValue()) ||
                null;
            const entity = new CommittedWorkloadEntity(
                id,
                user,
                contributedValue,
                committedWorkload.committedWorkload,
                committedWorkload.startDate,
                committedWorkload.expiredDate,
            );
            entity.contributedValue = ContributedValueMap.toEntity(
                committedWorkload.contributedValue,
            );
            entity.status = committedWorkload.status;

            entity.createdAt = committedWorkload.createdAt;
            entity.createdBy = committedWorkload.createdBy;
            entity.updatedAt = committedWorkload.updatedAt;
            entity.updatedBy = committedWorkload.updatedBy;
            entity.deletedAt = committedWorkload.deletedAt;
            entity.deletedBy = committedWorkload.deletedBy;

            return entity;
        }
    }

    public static toEntities(
        committedWorkloads: CommittedWorkload[],
    ): CommittedWorkloadEntity[] {
        return committedWorkloads.map((committedWorkload) =>
            this.toEntity(committedWorkload),
        );
    }

    public static fromDomainAll(
        committedWLs: CommittedWorkload[],
    ): CommittedWorkloadDto[] {
        const arrCommittedWLDto = new Array<CommittedWorkloadDto>();
        if (committedWLs) {
            committedWLs.forEach((committedWL) => {
                arrCommittedWLDto.push(this.fromDomain(committedWL));
            });
        }
        return arrCommittedWLDto;
    }

    public static toDomain(
        committedWorkloadEntity: CommittedWorkloadEntity,
    ): CommittedWorkload {
        try {
            if (!committedWorkloadEntity) {
                return null;
            }
            const { id } = committedWorkloadEntity;
            const committedWorkloadOrError = CommittedWorkload.create(
                {
                    committedWorkload:
                        committedWorkloadEntity.committedWorkload,
                    startDate: committedWorkloadEntity.startDate,
                    expiredDate: committedWorkloadEntity.expiredDate,
                    status: committedWorkloadEntity.status,
                    contributedValue: committedWorkloadEntity.contributedValue
                        ? ContributedValueMap.toDomain(
                              committedWorkloadEntity.contributedValue,
                          )
                        : null,
                    user: committedWorkloadEntity.user
                        ? UserMap.toDomain(committedWorkloadEntity.user)
                        : null,
                    createdBy: committedWorkloadEntity.createdBy,
                    updatedBy: committedWorkloadEntity.updatedBy,
                    createdAt: committedWorkloadEntity.createdAt,
                    updatedAt: committedWorkloadEntity.updatedAt,
                },
                new UniqueEntityID(id),
            );

            return committedWorkloadOrError.isSuccess
                ? committedWorkloadOrError.getValue()
                : null;
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    public static toDomainAll(
        committedWorkloadEntities: CommittedWorkloadEntity[],
    ): CommittedWorkload[] {
        const arrCommittedWorkload = new Array<CommittedWorkload>();
        if (committedWorkloadEntities) {
            committedWorkloadEntities.forEach((committedWorkloadEntity) => {
                const committedOrError = this.toDomain(committedWorkloadEntity);
                if (committedOrError) {
                    arrCommittedWorkload.push(committedOrError);
                }
            });
        }
        return arrCommittedWorkload;
    }

    public static toArrayDomain(
        raws: CommittedWorkloadEntity[],
    ): CommittedWorkload[] {
        const committedWorkloadsOrError = Array<CommittedWorkload>();
        if (raws) {
            raws.forEach(function get(item) {
                const committedWorkloadOrError =
                    CommittedWorkloadMap.toDomain(item);
                committedWorkloadsOrError.push(committedWorkloadOrError);
            });
        }
        return committedWorkloadsOrError ? committedWorkloadsOrError : null;
    }

    public static fromCommittedWorkloadShort(
        committedDomain: CommittedWorkload,
    ): CommittedWorkloadShortDto {
        try {
            const committed = new CommittedWorkloadShortDto();
            committed.id = Number(committedDomain.id.toString());
            committed.user = UserMap.fromUserShort(committedDomain.user);
            committed.expertiseScope = ExpertiseScopeMap.fromDomainShort(
                committedDomain.contributedValue.expertiseScope,
            );
            committed.valueStream = ValueStreamMap.fromDomainShort(
                committedDomain.contributedValue.valueStream,
            );
            committed.committedWorkload = committedDomain.committedWorkload;
            committed.startDate = committedDomain.startDate;
            committed.expiredDate = committedDomain.expiredDate;
            committed.status = committedDomain.status;
            committed.createdAt = committedDomain.createdAt;

            return committed;
        } catch (error) {
            return null;
        }
    }

    public static fromCommittedWorkloadShortArray(
        committees: CommittedWorkload[],
    ): CommittedWorkloadShortDto[] {
        const commits = Array<CommittedWorkloadShortDto>();
        if (committees) {
            committees.forEach((committee) => {
                commits.push(this.fromCommittedWorkloadShort(committee));
            });
        }
        return commits;
    }

    public static fromDomainCommittingWorkload(
        committingWorkload: CommittedWorkload,
    ): CommittingWorkloadDto {
        try {
            const committing = new CommittingWorkloadDto();
            committing.id = Number(committingWorkload.id.toString());
            committing.user = UserMap.fromUserShort(committingWorkload.user);
            committing.expertiseScope = ExpertiseScopeMap.fromDomainShort(
                committingWorkload.contributedValue.expertiseScope,
            );
            committing.valueStream = ValueStreamMap.fromDomainShort(
                committingWorkload.contributedValue.valueStream,
            );
            committing.committedWorkload = committingWorkload.committedWorkload;
            committing.startDate = committingWorkload.startDate;
            committing.expiredDate = committingWorkload.expiredDate;
            committing.status = committingWorkload.status;

            return committing;
        } catch (error) {
            return null;
        }
    }

    public static fromDomainCommittingWorkloadArray(
        committingWorkloads: CommittedWorkload[],
    ): CommittingWorkloadDto[] {
        return committingWorkloads.map((commit) =>
            this.fromDomainCommittingWorkload(commit),
        );
    }
}
