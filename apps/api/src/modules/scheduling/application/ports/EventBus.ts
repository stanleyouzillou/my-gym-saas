export type DomainEvent = { type: string; payload: any; occurredAt: string };

export interface EventBus {
  emit(event: DomainEvent): void;
}
