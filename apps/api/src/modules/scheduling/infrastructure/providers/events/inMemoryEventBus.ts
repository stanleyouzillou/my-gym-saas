export type DomainEvent = { type: string; payload: any; occurredAt: string };

export class InMemoryEventBus {
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
