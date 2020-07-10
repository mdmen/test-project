import $, { Cash as CashElement } from 'cash-dom';
import isFunction from 'lodash/isFunction';

export class Pager {
  private $pager: CashElement;
  private pageCount: number;
  private activeIndex: number;
  private callback: (n: number) => void;

  constructor(
    pageCount: number,
    activeIndex: number,
    onClick: (n: number) => void,
  ) {
    this.pageCount = pageCount;
    this.activeIndex = activeIndex;
    this.callback = onClick;

    this.init();
  }

  private init(): void {
    this.$pager = this.buildPager();
  }

  public getPager(): CashElement {
    return this.$pager;
  }

  private onClick(event: MouseEvent, index: number): void {
    const $item = $(<HTMLElement>event.target).closest('li');
    this.$pager.find('li').removeClass('active');
    $item.addClass('active');
    this.activeIndex = index;

    if (index !== 0) {
      this.$pager.find('.js-arrow-prev').removeClass('disabled');
    }

    if (index !== this.pageCount - 1) {
      this.$pager.find('.js-arrow-next').removeClass('disabled');
    }

    this.checkArrows();

    if (isFunction(this.callback)) {
      this.callback(index);
    }
  }

  private onArrowClick(event: MouseEvent): void {
    const $arrow = $(<HTMLElement>event.target).closest('li');
    if ($arrow.hasClass('disabled')) {
      return;
    }

    const $activeItem = this.$pager.find('li.active');
    $activeItem.removeClass('active');

    if ($arrow.hasClass('js-arrow-prev')) {
      $activeItem.prev().addClass('active');
      this.activeIndex--;
    } else {
      $activeItem.next().addClass('active');
      this.activeIndex++;
    }
    this.checkArrows();

    if (isFunction(this.callback)) {
      this.callback(this.activeIndex);
    }
  }

  private checkArrows(): void {
    if (this.activeIndex === 0) {
      this.$pager.find('.js-arrow-prev').addClass('disabled');
    } else {
      this.$pager.find('.js-arrow-prev').removeClass('disabled');
    }

    if (this.activeIndex === this.pageCount - 1) {
      this.$pager.find('.js-arrow-next').addClass('disabled');
    } else {
      this.$pager.find('.js-arrow-next').removeClass('disabled');
    }
  }

  public buildPager(): CashElement {
    const $pager = $('<ul class="pagination section"></ul>');
    const $leftArrow = this.getArrow('prev');
    const $rightArrow = this.getArrow('next');

    $pager.append($leftArrow);
    for (let i = 0; i < this.pageCount; i += 1) {
      const $item = $(`<li><a href="#!">${i + 1}</a></li>`);
      if (i === this.activeIndex) {
        $item.addClass('active');
      }
      $item.on('click', (e) => {
        this.onClick(e, i);
      });
      $pager.append($item);
    }
    $pager.append($rightArrow);

    return $pager;
  }

  private getArrow(order: 'prev' | 'next'): CashElement {
    const iconName = order === 'prev' ? 'chevron_left' : 'chevron_right';
    const className = order === 'prev' ? 'js-arrow-prev' : 'js-arrow-next';
    const $arrow = $(
      `<li class="${className}"><a href="#!"><i class="material-icons">${iconName}</i></a></li>`,
    );

    if (
      (order === 'prev' && this.activeIndex === 0) ||
      (order === 'next' && this.activeIndex === this.pageCount - 1)
    ) {
      $arrow.addClass('disabled');
    }

    $arrow.on('click', this.onArrowClick.bind(this));

    return $arrow;
  }
}
