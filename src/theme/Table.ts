import $, { Cash as CashElement } from 'cash-dom';

type TableOptions = {
  isHighlight?: boolean;
};

type TableConfig = {
  container: CashElement | HTMLElement | string;
  options?: TableOptions;
};

export class Table {
  private container: CashElement;
  private table: CashElement;
  private options: TableOptions;

  constructor({ container, options = {} }: TableConfig) {
    this.container = $(container);
    this.options = options;
  }

  public getTable(): CashElement {
    return this.table;
  }

  private buildHead(captions: string[]): CashElement {
    const row = $('<tr></tr>');
    captions.forEach((text) => {
      const cell = $(`<th>${text}</th>`);
      row.append(cell);
    });
    return row;
  }

  private buildBody(items: TObject[]): CashElement {
    const body = $('<tbody></tbody>');
    items.forEach((item) => {
      const row = $('<tr></tr>');
      Object.keys(item).forEach((prop) => {
        const cell = $(`<td>${item[prop]}</td>`);
        row.append(cell);
      });
      body.append(row);
    });
    return body;
  }

  private buildTable(captions: string[], items: TObject[]): void {
    const head = this.buildHead(captions);
    const body = this.buildBody(items);

    const table = $('<table></table>');
    table.append(head).append(body);

    if (this.options.isHighlight) {
      table.addClass('highlight');
    }

    this.table = table;
  }

  public update(items: TObject[]): void {
    const body = this.buildBody(items);
    this.table.find('tbody').replaceWith(body);
  }

  public render(captions: string[], items: TObject[]): void {
    this.buildTable(captions, items);
    this.container.append(this.table);
  }
}
