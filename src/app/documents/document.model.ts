export class Document {
    constructor(
      public id: string,
      public name: string,
      public description: string,
      public url: string,
      public imageUrl: string,
      public children: Document[] = []// This indicates it's an array of other `Contact` objects
    ) {}
  }