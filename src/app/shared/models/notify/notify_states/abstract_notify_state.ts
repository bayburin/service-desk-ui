export abstract class AbstractNotifyState {
  /**
   * Возвращает имя иконки уведомления.
   */
  abstract getIconName(): string;
  /**
   * Возвращает именя классов селекторов уведомления.
   */
  abstract getClassName(): string;
  /**
   * Определяет, закрывать ли уведомление автоматически.
   */
  abstract isAutoClose(): boolean;
}
