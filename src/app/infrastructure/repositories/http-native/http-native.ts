import { ContactMeansMainRemovedException } from 'src/app/domain/exceptions/contact-means-main-removed-exception';
import { ContactMeansNameEqualException } from 'src/app/domain/exceptions/contact-means-name-equal-exception';
import { ContactMeansSingleRemovedException } from 'src/app/domain/exceptions/contact-means-single-removed-exception';
import { ContactNameEqualException } from 'src/app/domain/exceptions/contact-name-equal-exception';

export class HttpNative {

  protected defaultOptions: {
    'Content-type': 'application/json', 
    'Accept': 'application/json'
  };

  handlerException(e) {
    const errorJSON:any = JSON.parse(e.error);
    if (errorJSON.type == 'domain') {
      const status: number = errorJSON.status;
      switch (status) {
        case ContactMeansMainRemovedException.code: throw new ContactMeansMainRemovedException();
        case ContactMeansSingleRemovedException.code: throw new ContactMeansSingleRemovedException();
        case ContactNameEqualException.code: throw new ContactNameEqualException();
        case ContactMeansNameEqualException.code: throw new ContactMeansNameEqualException();
        default: throw Error('undefined');
      }
    } else {
      throw e;
    }
  }
}
