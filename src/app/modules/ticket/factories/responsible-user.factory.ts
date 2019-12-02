import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';

export class ResponsibleUserFactory {
  static createByDetails(details: ResponsibleUserDetailsI): ResponsibleUserI {
    return {
      tn: details.tn,
      details
    } as ResponsibleUserI;
  }
}
