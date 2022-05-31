import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { ContributedValue } from '../domain/contributedValue';
import { ExpertiseScope } from '../domain/expertiseScope';
import { ValueStream } from '../domain/valueStream';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { ContributedValueDto } from '../infra/dtos/contributedValue.dto';
import { ContributedValueShortDto } from '../infra/dtos/getContributedValue/contributedValueShort.dto';
import { ExpertiseScopeMap } from './expertiseScopeMap';
import { ValueStreamMap } from './valueStreamMap';

export class ContributedValueMap implements Mapper<ContributedValue> {
    public static fromDomain(
        contributedValue: ContributedValue,
    ): ContributedValueDto {
        if (!contributedValue) {
            return null;
        }
        const dto = new ContributedValueDto();
        dto.id = contributedValue.id;
        dto.valueStream = contributedValue.props.valueStream
            ? ValueStreamMap.fromDomain(contributedValue.props.valueStream)
            : null;
        dto.expertiseScope = contributedValue.props.expertiseScope
            ? ExpertiseScopeMap.fromDomain(
                  contributedValue.props.expertiseScope,
              )
            : null;
        return dto;
    }

    public static fromDomainShort(
        contributedValue: ContributedValue,
    ): ContributedValueShortDto {
        const contributedValueShortDto = new ContributedValueShortDto();
        if (contributedValue) {
            const valueStream = ValueStreamMap.fromDomainShort(
                contributedValue.valueStream,
            );
            const expertiseScope = ExpertiseScopeMap.fromDomainShort(
                contributedValue.expertiseScope,
            );
            contributedValueShortDto.id = Number(contributedValue.id.toValue());
            contributedValueShortDto.valueStream = valueStream;
            contributedValueShortDto.expertiseScope = expertiseScope;
        }
        return contributedValueShortDto;
    }
    public static fromDomainShortAll(
        raws: ContributedValue[],
    ): ContributedValueShortDto[] {
        const contributedValuesOrError = Array<ContributedValueShortDto>();
        if (raws) {
            raws.forEach(function get(item) {
                const contributed = ContributedValueMap.fromDomainShort(item);
                contributedValuesOrError.push(contributed);
            });
        }
        return contributedValuesOrError;
    }

    public static toDomainOverview(
        raw: ContributedValueEntity,
    ): ContributedValue {
        if (!raw) {
            return null;
        }
        const { id } = raw;
        const valueStreamId = raw.valueStream.id;
        const valueStream = ValueStream.create(
            {
                name: raw.valueStream.name,
                createdAt: raw.valueStream.createdAt,
                updatedAt: raw.valueStream.updatedAt,
            },
            new UniqueEntityID(valueStreamId),
        );
        const expertiseScopeId = raw.expertiseScope.id;
        const expertiseScope = ExpertiseScope.create(
            {
                name: raw.expertiseScope.name,
                createdAt: raw.expertiseScope.createdAt,
                updatedAt: raw.expertiseScope.updatedAt,
            },
            new UniqueEntityID(expertiseScopeId),
        );
        const contributedValueOrError = ContributedValue.create(
            {
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityID(id),
        );
        contributedValueOrError.getValue().valueStream = valueStream.getValue();
        contributedValueOrError.getValue().expertiseScope =
            expertiseScope.getValue();

        return contributedValueOrError.isSuccess
            ? contributedValueOrError.getValue()
            : null;
    }

    public static toEntity(
        contributedValue: ContributedValue,
    ): ContributedValueEntity {
        const contributedValueEntity = new ContributedValueEntity();
        if (contributedValue) {
            contributedValueEntity.id = Number(
                contributedValue.contributedValueId.id.toValue(),
            );
            contributedValueEntity.expertiseScope = ExpertiseScopeMap.toEntity(
                contributedValue.expertiseScope,
            );

            contributedValueEntity.valueStream = ValueStreamMap.toEntity(
                contributedValue.valueStream,
            );
        }
        return contributedValueEntity;
    }

    public static toDomain(
        contributedValueEntity: ContributedValueEntity,
    ): ContributedValue {
        if (!contributedValueEntity) {
            return null;
        }
        const { id } = contributedValueEntity;

        const contributedValueOrError = ContributedValue.create(
            {
                valueStream: contributedValueEntity.valueStream
                    ? ValueStreamMap.toDomain(
                          contributedValueEntity.valueStream,
                      )
                    : null,
                expertiseScope: contributedValueEntity.expertiseScope
                    ? ExpertiseScopeMap.toDomain(
                          contributedValueEntity.expertiseScope,
                      )
                    : null,
            },
            new UniqueEntityID(id),
        );

        return contributedValueOrError.isSuccess
            ? contributedValueOrError.getValue()
            : null;
    }

    public static toDomainAll(
        raws: ContributedValueEntity[],
    ): ContributedValue[] {
        const contributedValuesOrError = Array<ContributedValue>();
        if (raws) {
            raws.forEach(function get(item) {
                const contributed = ContributedValueMap.toDomain(item);
                contributedValuesOrError.push(contributed);
            });
        }
        return contributedValuesOrError;
    }
}
