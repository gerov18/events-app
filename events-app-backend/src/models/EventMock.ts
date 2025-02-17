import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../mocks/events.json');

export class EventMock {
  static getAll = () => {
    const data = fs.readFile(filePath, { encoding: 'utf-8' });
    return JSON.parse(data);
  };

  static getById = (id: number) => {
    return EventMock.getAll().find(event => event.id === id);
  };
}
