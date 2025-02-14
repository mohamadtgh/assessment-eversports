export enum ValidationErrorType {
  MissingMandatoryFields = "missingMandatoryFields",
  NegativeRecurringPrice = "negativeRecurringPrice",
  CashPriceBelow100 = "cashPriceBelow100",
  BillingPeriodsMoreThan12Months = "billingPeriodsMoreThan12Months",
  BillingPeriodsLessThan6Months = "billingPeriodsLessThan6Months",
  BillingPeriodsMoreThan10Years = "billingPeriodsMoreThan10Years",
  BillingPeriodsLessThan3Years = "billingPeriodsLessThan3Years",
  InvalidBillingPeriods = "invalidBillingPeriods",
}

export enum ApiErrorType {
  InternalServerError = "internalServerError",
}
