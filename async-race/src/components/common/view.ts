export default abstract class View {
  protected abstract element: HTMLElement;
  
  public getElement(): HTMLElement {
    return this.element;
  }
}
