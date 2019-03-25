import { AppLoadService } from './app-load.service';

export function loadDataFactory(appLoadService: AppLoadService) {
  return () => appLoadService.load();
}
