export interface CommonServiceI {
  /**
   * Возвращает строку с адресом ссылки на просмотр информации о выбранном шаблоне.
   */
  getShowLink(): string;
  /**
   * Возвращает имя компонента выбранного шаблона для выдачи пользователю.
   */
  pageComponent(): string;
}
