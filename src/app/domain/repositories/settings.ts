import { Setting } from 'src/app/domain/entities/setting';

export interface Settings {

  item(id: number): Promise<Setting>;

  put(setting: Setting): Promise<Setting>;
}
