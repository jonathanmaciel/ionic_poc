import { HttpErrorResponse } from "@angular/common/http";
import { ContactMeansMainRemovedException } from "./contact-means-main-removed-exception";
import { ContactMeansNameEqualException } from "./contact-means-name-equal-exception";
import { ContactMeansSingleRemovedException } from "./contact-means-single-removed-exception";
import { ContactNameEqualException } from "./contact-name-equal-exception";

export class DomainException extends Error {
    
  constructor(message: string) {
    super(message)
  }
}