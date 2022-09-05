export class Progress {
  public percent: number = 0;

  public total: number = 0;

  public processed: number = 0;

  public isFinished: boolean = false;

  static defaultProgress() {
    return new Progress();
  }

  /**
   * incrementProcessed
   */
  public incrementProcessed(amount: number) {
    this.processed += amount;
    this.percent = Math.round((this.processed / this.total) * 100);
    if (this.processed === this.total) this.isFinished = true;
  }
}
