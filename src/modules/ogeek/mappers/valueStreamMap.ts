import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { ValueStream } from '../domain/valueStream';
import { ValueStreamEntity } from '../infra/database/entities/valueStream.entity';
import { ValueStreamShortInsertDto } from '../infra/dtos/getContributedValue/valueStreamShort.dto';
import { ValueStreamShortDto } from '../infra/dtos/overviewSummaryYear/valueStreamShort.dto';
import { ValueStreamDto } from '../infra/dtos/valueStream.dto';

export class ValueStreamMap implements Mapper<ValueStream> {
    public static fromDomain(valueStream: ValueStream): ValueStreamDto {
        const dto = new ValueStreamDto();
        if (valueStream) {
            dto.id = valueStream.valueStreamId.id;
            dto.name = valueStream.name;
        }
        return dto;
    }

    public static fromDomainShort(
        valueStream: ValueStream,
    ): ValueStreamShortDto {
        const dto = new ValueStreamShortDto();
        if (valueStream) {
            dto.id = Number(valueStream.valueStreamId.id.toValue());
            dto.name = valueStream.name;
        }
        return dto;
    }
    public static fromDomainShortInsert(
        valueStream: ValueStream,
    ): ValueStreamShortInsertDto {
        const dto = new ValueStreamShortInsertDto();
        if (valueStream) {
            dto.id = Number(valueStream.valueStreamId.id.toValue());
            dto.name = valueStream.name;
        }

        return dto;
    }
    public static fromDomainShortAll(
        raws: ValueStream[],
    ): ValueStreamShortInsertDto[] {
        const contributedValuesOrError = Array<ValueStreamShortInsertDto>();
        if (raws) {
            raws.forEach(function get(item) {
                const valueStream = ValueStreamMap.fromDomainShort(item);
                contributedValuesOrError.push(valueStream);
            });
        }
        return contributedValuesOrError;
    }

    public static fromArrayDomain(
        valueStreams: ValueStream[],
    ): ValueStreamShortDto[] {
        const valueStreamArrayDTO = Array<ValueStreamShortDto>();
        if (valueStreams) {
            valueStreams.forEach(function get(item) {
                const valueStreamShort = ValueStreamMap.fromDomainShort(item);
                valueStreamArrayDTO.push(valueStreamShort);
            });
        }
        return valueStreamArrayDTO;
    }

    public static fromDomainAll(valueStreams: ValueStream[]): ValueStreamDto[] {
        const valueStreamArrayDto = new Array<ValueStreamDto>();
        if (valueStreams) {
            valueStreams.forEach((valueStream) => {
                valueStreamArrayDto.push(
                    ValueStreamMap.fromDomain(valueStream),
                );
            });
        }
        return valueStreamArrayDto;
    }

    // public static fromDomainOverview(valueStream: )

    public static toDomain(raw: ValueStreamEntity): ValueStream {
        if (!raw) {
            return null;
        }
        const { id } = raw;

        const valueStreamOrError = ValueStream.create(
            {
                name: raw.name,
            },
            new UniqueEntityID(id),
        );

        return valueStreamOrError.isSuccess
            ? valueStreamOrError.getValue()
            : null;
    }
    public static toDomainAll(raws: ValueStreamEntity[]): ValueStream[] {
        const contributedValuesOrError = Array<ValueStream>();
        if (raws) {
            raws.forEach(function get(item) {
                const valueStream = ValueStreamMap.toDomain(item);
                contributedValuesOrError.push(valueStream);
            });
        }
        return contributedValuesOrError;
    }

    public static toEntity(valueStream: ValueStream): ValueStreamEntity {
        const valueStreamEntity = new ValueStreamEntity();
        if (valueStream) {
            valueStreamEntity.id = Number(valueStream.id.toValue());
            valueStreamEntity.name = valueStream.name;
        }
        return valueStreamEntity;
    }

    public static toArrayDomain(raws: ValueStreamEntity[]): ValueStream[] {
        const valueStreamsOrError = Array<ValueStream>();
        if (raws) {
            raws.forEach(function get(item) {
                const valueStream = ValueStreamMap.toDomain(item);
                valueStreamsOrError.push(valueStream);
            });
        }
        return valueStreamsOrError;
    }
}
