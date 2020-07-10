import $, { Cash as CashElement } from 'cash-dom';
import { personsAPI } from '../api/persons';
import { PersonFull, baseFields as personBaseFields } from '../models/persons';
import { Loader } from '../theme/Loader';
import { Table } from '../theme/Table';
import { filterByValue } from '../utils/helpers';
import { Pager } from '../theme/Pager';
import pick from 'lodash/pick';
import isPlainObject from 'lodash/isPlainObject';
import orderBy from 'lodash/orderBy';
import throttle from 'lodash/throttle';

type SortOptions = {
  index: number;
  asc: boolean;
};

type FilterOptions = {
  value: string;
  min: number;
};

type PersonsTableConfig = {
  container: string;
  showCount?: number;
  maxLoad?: number;
  hasSort?: boolean;
  hasFilter?: boolean;
};

export class PersonsTable {
  private container: CashElement;
  private showCount: number;
  private maxLoad: number;
  private hasSort: boolean;
  private hasFilter: boolean;

  private persons: PersonFull[];
  private loader: Loader;
  private table: Table;
  private $pager: Pager;

  private sort: SortOptions;
  private filter: FilterOptions = {
    value: '',
    min: 2,
  };

  private currentPage = 0;

  constructor({
    showCount = 50,
    maxLoad = 1000,
    hasSort = false,
    hasFilter = false,
    container,
  }: PersonsTableConfig) {
    this.showCount = showCount;
    this.maxLoad = maxLoad;
    this.container = $(`.${container}`);
    this.hasSort = hasSort;
    this.hasFilter = hasFilter;

    this.loader = new Loader(this.container);
    this.table = new Table({
      container: this.container,
      options: {
        isHighlight: true,
      },
    });
  }

  public async init() {
    this.persons = await this.loadPersons();
    this.render();

    if (this.hasSort) {
      this.enableSort();
    }

    if (this.hasFilter) {
      this.enableFiltering();
    }
  }

  get preparedPersons(): Partial<PersonFull>[] {
    let persons = this.persons;
    const baseProps = Object.keys(personBaseFields);

    if (this.isAllowFiltering()) {
      persons = filterByValue(persons, baseProps, this.filter.value);
    }

    if (this.hasSort && isPlainObject(this.sort)) {
      const prop = baseProps[this.sort.index];
      const order = this.sort.asc ? 'asc' : 'desc';
      persons = orderBy(persons, [prop], [order]);
    }

    const pickOffset = this.currentPage * this.showCount;
    return persons
      .slice(pickOffset, pickOffset + this.showCount)
      .map((item) => pick(item, baseProps));
  }

  private async loadPersons() {
    try {
      this.loader.showLoader();
      const persons = await personsAPI.load({ count: this.maxLoad });
      this.loader.hideLoader();
      return persons;
    } catch (e) {
      this.loader.hideLoader();
      console.error(e);
    }
  }

  private render() {
    const captions = Object.values(personBaseFields);
    this.table.render(captions, this.preparedPersons);
    this.setPager();
  }

  private enableSort(): void {
    const table = this.table.getTable();
    table.addClass('sort');

    const onSort = (event: MouseEvent) => {
      const $target = $(<HTMLInputElement>event.target);
      const $th = $target.closest('th');

      if ($th) {
        this.sort = {
          index: $th.index(),
          asc: !$th.hasClass('desc'),
        };
        $th.toggleClass('desc');
        this.table.update(this.preparedPersons);
      }
    };

    table.on('click', onSort);
  }

  private enableFiltering(): void {
    const placeholder = `Введите минимум ${this.filter.min} символа`;
    const $input = $(
      `<input type="text" size="50" placeholder="${placeholder}" />`,
    );
    const $table = this.table.getTable();

    const onFilter = throttle((event) => {
      const { value } = event.target;
      this.filter.value = value ? value : '';
      const preparedPersons = this.preparedPersons;
      this.table.update(preparedPersons);

      this.setPager();
      this.currentPage = 0;
    }, 300);

    $input.on('input', onFilter);
    $table.before($input);
  }

  private isAllowFiltering(): boolean {
    return this.hasFilter && this.filter.value.length >= this.filter.min;
  }

  private setPager(): void {
    let pageCount: number;

    if (this.isAllowFiltering()) {
      const filteredPersons = filterByValue(
        this.persons,
        Object.keys(personBaseFields),
        this.filter.value,
      );
      pageCount = Math.ceil(filteredPersons.length / this.showCount);
    } else {
      pageCount = Math.ceil(this.persons.length / this.showCount);
    }

    if (pageCount <= 1) {
      if (this.$pager) {
        this.$pager.getPager().remove();
        this.$pager = null;
      }
      return;
    }

    const $pager = new Pager(pageCount, 0, this.pageNavHandler.bind(this));
    if (!this.$pager) {
      this.$pager = $pager;
      this.container.append(this.$pager.getPager());
    } else {
      this.$pager.getPager().replaceWith($pager.getPager());
      this.$pager = $pager;
    }
  }

  private pageNavHandler(index: number): void {
    this.currentPage = index;
    this.table.update(this.preparedPersons);
  }
}
