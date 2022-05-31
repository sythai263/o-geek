import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { Issue } from '../domain/issue';
import { IssueEntity } from '../infra/database/entities/issue.entity';
import { PotentialIssueResponseDto } from '../infra/dtos/createPotentialIssue/potentialIssueResponse.dto';
import { PotentialIssueDto } from '../infra/dtos/getPotentialIssue/getPotentialIssue.dto';
import { PotentialIssuesDto } from '../infra/dtos/getPotentialIssues/getPotentialIssue.dto';
import { IssueDto } from '../infra/dtos/issue.dto';
import { UpdatePotentialIssueDto } from '../infra/dtos/updatePotentialIssue/updatePotentialIssue.dto';
import { UserMap } from './userMap';

export class IssueMap implements Mapper<Issue> {
    public static fromDomain(issue: Issue): IssueDto {
        return {
            id: issue.id,
            status: issue.status,
            firstDateOfWeek: issue.firstDateOfWeek,
            note: issue.note,
            user: issue.user,
        };
    }
    public static fromDomainCreateIssue(
        potentialIssue: Issue,
    ): PotentialIssueResponseDto {
        return {
            id: Number(potentialIssue.id),
            status: potentialIssue.status,
            firstDateOfWeek: potentialIssue.firstDateOfWeek,
            note: potentialIssue.note,
        };
    }
    public static fromDomainUpdateIssue(
        potentialIssue: Issue,
    ): UpdatePotentialIssueDto {
        return {
            id: Number(potentialIssue.id),
            status: potentialIssue.status,
            note: potentialIssue.note,
        };
    }
    public static fromDomainOne(issue: Issue): PotentialIssueDto {
        return {
            id: Number(issue.id),
            userId: Number(issue.user.id),
            status: issue.status,
            note: issue.note,
            firstDateOfWeek: issue.firstDateOfWeek,
            createdAt: issue.createdAt,
        };
    }

    public static fromDomainHistoryIssue(issue: Issue): PotentialIssuesDto {
        return {
            status: issue.status,
            note: issue.note,
        };
    }

    public static fromDomainAllHistoryIssue(
        issues: Issue[],
    ): PotentialIssuesDto[] {
        const issueArrayDto = new Array<PotentialIssuesDto>();
        if (issues) {
            issues.forEach((issue) => {
                issueArrayDto.push(IssueMap.fromDomainHistoryIssue(issue));
            });
        }
        return issueArrayDto;
    }

    public static fromDomainAll(issues: Issue[]): IssueDto[] {
        const issueArrayDto = new Array<IssueDto>();
        if (issues) {
            issues.forEach((issue) => {
                issueArrayDto.push(IssueMap.fromDomain(issue));
            });
        }
        return issueArrayDto;
    }

    public static toDomain(raw: IssueEntity): Issue {
        if (!raw) {
            return null;
        }
        const { id } = raw;
        const issueOrError = Issue.create(
            {
                status: raw.status,
                note: raw.note,
                firstDateOfWeek: raw.firstDateOfWeek,
                user: UserMap.toDomain(raw.user),
                updatedBy: raw.updatedBy,
                createdBy: raw.createdBy,
            },
            new UniqueEntityID(id),
        );

        return issueOrError.isSuccess ? issueOrError.getValue() : null;
    }

    public static toDomainOne(raw: IssueEntity): Issue {
        const { id } = raw;
        const potentialIssueOrError = Issue.create(
            {
                user: UserMap.toDomain(raw.user),
                status: raw.status,
                note: raw.note,
                firstDateOfWeek: raw.firstDateOfWeek,
                createdAt: raw.createdAt,
            },
            new UniqueEntityID(id),
        );
        return potentialIssueOrError.isSuccess
            ? potentialIssueOrError.getValue()
            : null;
    }

    public static toDomainAll(issues: IssueEntity[]): Issue[] {
        const issueArray = new Array<Issue>();
        if (issues) {
            issues.forEach((issue) => {
                const issueOrError = IssueMap.toDomain(issue);
                if (issueOrError) {
                    issueArray.push(issueOrError);
                } else {
                    return null;
                }
            });
        }
        return issueArray;
    }

    public static toEntity(potentialIssue: Issue): IssueEntity {
        if (!potentialIssue) {
            return null;
        }
        const id = Number(potentialIssue.id?.toValue()) || null;
        const issueEntity = new IssueEntity(id);
        issueEntity.note = potentialIssue.note;
        issueEntity.status = potentialIssue.status;
        issueEntity.user = UserMap.toEntity(potentialIssue.user);
        return issueEntity;
    }
}
