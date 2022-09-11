import { Scan } from '../../../types';

export class ProgressiveScan {
  public percent: number = 0;

  public total: number = 0;

  public processed: number = 0;

  public isFinished: boolean = false;

  static defaultProgress() {
    return new ProgressiveScan(() => {}).scanData;
  }

  public get scanData(): Scan {
    return {
      isFinished: this.isFinished,
      percent: this.percent,
      processed: this.processed,
      total: this.total,
    };
  }

  constructor(private onProgressUpdate: (progress: Scan) => void) {}

  /**
   * incrementProcessed
   */
  public incrementProcessed(amount: number) {
    this.processed += amount;
    this.handleUpdate();
  }

  public setTotal(total: number) {
    this.total = total;
    this.handleUpdate();
  }

  public setFinished() {
    this.isFinished = true;
    this.handleUpdate();
  }

  private handleUpdate() {
    this.percent = Math.round((this.processed / this.total) * 100);
    if (this.processed === this.total) this.isFinished = true;
    this.onProgressUpdate(this.scanData);
  }
}
