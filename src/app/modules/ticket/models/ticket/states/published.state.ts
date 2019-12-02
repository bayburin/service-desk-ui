import { AbstractState } from './abstract.state';

export class PublishedState extends AbstractState {
  publish() {
    throw new Error('Нельзя опубликовать');
  }
}
