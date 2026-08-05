export abstract class BaseComponent<Props = Record<string, unknown>> {
  protected element: HTMLElement | null = null;
  protected props: Props;

  constructor(props?: Props) {
    this.props = props || ({} as Props);
  }

  /**
   * Genera el HTML string del componente
   */
  protected abstract template(): string;

  /**
   * Asigna manejadores de eventos o lógica de DOM tras renderizar
   */
  protected onMount(): void {}

  /**
   * Limpieza de referencias y event listeners
   */
  public destroy(): void {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  /**
   * Renderiza el componente y devuelve un elemento del DOM real
   */
  public render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template().trim();
    
    // Si la plantilla tiene un único elemento raíz, lo extraemos
    const renderedElement = wrapper.firstElementChild as HTMLElement || wrapper;
    this.element = renderedElement;

    // Ejecutamos ciclo de vida post-renderizado
    setTimeout(() => this.onMount(), 0);

    return this.element;
  }
}