import account from '@C/API/account';
import Conf from '@C/index';
import { BaseService } from '@S/BASE_SERVICE';

const accountService: any = new BaseService(Conf.APP.config.BASE_API, account);

export default accountService;​​
