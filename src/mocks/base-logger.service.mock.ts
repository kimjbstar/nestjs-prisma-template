export class BaseLoggerServiceMock {
  log(message: string, dirPath?) {
    console.log(message);
  }
  error(message: string, dirPath?) {
    console.log(message);
  }
  warn(message: string, dirPath?) {
    console.log(message);
  }
  debug(message: string, dirPath?) {
    console.log(message);
  }
  verbose(message: string, dirPath?) {
    console.log(message);
  }
}
