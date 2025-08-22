import { EventBus, DomainEvent } from '../../../application/ports/EventBus';

export class InMemoryEventBus implements EventBus {
  private events: DomainEvent[] = [];

  emit(event: DomainEvent) {
    this.events.push(event);
  }

  all(): DomainEvent[] {
    return [...this.events];
  }

  clear() {
    this.events = [];
  }
}
