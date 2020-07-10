import $, { Cash as CashElement } from 'cash-dom';

export class Loader {
  private loader: CashElement;
  private container: CashElement;

  constructor(container: CashElement | HTMLElement | string) {
    this.container = $(container);
  }

  public showLoader(): void {
    this.loader = $(
      `<div class="preloader-wrapper active">
        <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>`,
    );
    this.container.addClass('loader-container').append(this.loader);
  }

  public hideLoader(): void {
    this.container.removeClass('loader-container');
    this.loader.remove();
    this.loader = null;
  }
}
