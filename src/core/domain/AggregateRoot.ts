/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable no-restricted-syntax */
import { Entity } from './Entity';
import { DomainEvents } from './events/DomainEvents';
import { IDomainEvent } from './events/IDomainEvent';
import { UniqueEntityID } from './UniqueEntityID';

export abstract class AggregateRoot<T> extends Entity<T> {
    private _domainEvents: IDomainEvent[] = [];

    get id(): UniqueEntityID {
        return this._id;
    }

    get domainEvents(): IDomainEvent[] {
        return this.domainEvents;
    }

    protected addDomainEvent(domainEvent: IDomainEvent): void {
        // Add the domain event to this aggregate's list of domain events
        this.domainEvents.push(domainEvent);
        // Add this aggregate instance to the domain event's list of aggregates who's
        // events it eventually needs to dispatch.
        DomainEvents.markAggregateForDispatch(this);
        // Log the domain event
        this.logDomainEventAdded(domainEvent);
    }

    public clearEvents(): void {
        this.domainEvents.splice(0, this.domainEvents.length);
    }

    private logDomainEventAdded(domainEvent: IDomainEvent): void {
        const thisClass = Reflect.getPrototypeOf(this);
        const domainEventClass = Reflect.getPrototypeOf(domainEvent);
        console.info(
            '[Domain Event Created]:',
            thisClass.constructor.name,
            '==>',
            domainEventClass.constructor.name,
        );
    }
}
