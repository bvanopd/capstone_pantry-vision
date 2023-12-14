export class SavedRecipe {
  id: number;
  title: string;

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
  }

  getDbString(): string {
    return this.id + "%" + this.title;
  }
}