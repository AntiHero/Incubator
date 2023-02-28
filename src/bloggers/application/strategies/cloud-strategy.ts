export abstract class CloudStrategy {
  abstract upload(
    fileName: string,
    file: Express.Multer.File,
    prefix?: string,
  ): Promise<string>;
}
